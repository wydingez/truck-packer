var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
/// <reference types="react" />
/// <reference types="react-dom" />
/// <reference types="react-data-grid" />
/// <reference types="three" />
/// <reference types="axios" />
/// <reference types="3d-bin-packing" />
/// <reference path="API.ts" />
// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX
var bws;
(function (bws) {
    var packer;
    (function (packer_1) {
        var demo;
        (function (demo) {
            var Application = /** @class */ (function (_super) {
                __extends(Application, _super);
                /* -----------------------------------------------------------
                    CONSTRUCTORS
                ----------------------------------------------------------- */
                /**
                 * Default Constructor.
                 */
                function Application() {
                    var _this = _super.call(this) || this;
                    /* -----------------------------------------------------------
                        RENDERERS
                    ----------------------------------------------------------- */
                    _this.scene = null;
                    _this.renderer = null;
                    _this.camera = null;
                    _this.trackball = null;
                    _this.mouse = null;
                    // this.instances = new InstanceFormArray();
                    // this.wrappers = new WrapperArray();
                    _this.result = new packer_1.WrapperArray();
                    _this.state = { solidCheck: false, instances: new packer_1.InstanceFormArray(), wrappers: new packer_1.WrapperArray() };
                    _this.recordWrapper = null;
                    // setTimeout(() => {
                    // 	let instances = new InstanceFormArray()
                    // 	let wrappers = new WrapperArray()
                    // 	let info = {
                    // 		"vehicleModel": "12.5m",
                    // 		"vehicleNo": "P888888",
                    // 		"vehicleLength": 1250,
                    // 		"vehicleWidth": 250,
                    // 		"vehicleHeight": 250,
                    // 		"packageList": [
                    // 			{
                    // 				color: "rgba(190,153,36,1)",
                    // 				height: 28,
                    // 				length: 60,
                    // 				partName: "右遮阳板总成",
                    // 				sum: 10,
                    // 				width: 40,
                    // 			}
                    // 		]
                    // 	}
                    // 	wrappers.push(new Wrapper(info.vehicleNo, 1000, info.vehicleWidth, info.vehicleHeight, info.vehicleLength, 0))
                    // 	info.packageList.forEach(good => {
                    // 		instances.push(new InstanceForm(new Product(good.partName, good.width, good.height, good.length, good.color), good.sum))
                    // 	})
                    // 	this.setState({
                    // 		instances,
                    // 		wrappers
                    // 	}, () => {
                    // 		this.pack()
                    // 	})
                    // }, 1000)
                    console.log(222);
                    window.addEventListener('message', function (event) {
                        //  if(event.origin !== 'http://davidwalsh.name') return;
                        var instances = new packer_1.InstanceFormArray();
                        var wrappers = new packer_1.WrapperArray();
                        var info = event.data;
                        console.log(111, event.data);
                        wrappers.push(new packer_1.Wrapper(info.vehicleNo, info.vehicleNo, info.vehicleWidth, info.vehicleHeight, info.vehicleLength, 0));
                        info.packageList.forEach(function (good) {
                            instances.push(new packer_1.InstanceForm(new packer_1.Product(good.partName, good.width, good.height, good.length, good.color), good.sum));
                        });
                        _this.setState({
                            instances: instances,
                            wrappers: wrappers
                        }, function () {
                            _this.pack();
                        });
                    }, false);
                    return _this;
                }
                Application.prototype.getUrlParams = function (key) {
                    var reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)");
                    var r = window.location.search.substr(1).match(reg);
                    var ret = '';
                    if (r != null) {
                        ret = unescape(r[2]);
                    }
                    return ret;
                };
                /* -----------------------------------------------------------
                    PROCEDURES
                ----------------------------------------------------------- */
                Application.prototype.pack = function () {
                    var packer_form = new packer_1.PackerForm(this.state.instances, this.state.wrappers);
                    /////
                    // FIND THE OPTIMIZED SOLUTION
                    /////
                    var packer = packer_form.toPacker();
                    var result;
                    try {
                        result = packer.optimize();
                    }
                    catch (exception) {
                        alert(exception.what());
                        return;
                    }
                    this.result.assign(result.begin(), result.end());
                    /////
                    // DRAW THE 1ST WRAPPER
                    /////
                    if (this.result.empty() == true)
                        return;
                    this.drawWrapper(this.result.front());
                    this.refs["tabNavigator"].setState({ selectedIndex: 1 });
                };
                Application.prototype.updateRecrodWrapper = function (wrapper, index) {
                    this.recordWrapper = { wrapper: wrapper, index: index };
                };
                Application.prototype.drawWrapper = function (wrapper, index) {
                    if (index === void 0) { index = wrapper.size(); }
                    // INITIALIZE
                    var div = document.getElementById("wrapper_viewer");
                    var canvas = this.wrapper_to_canvas(wrapper, index); // DRAW
                    this.recordWrapper = null;
                    // PRINT
                    if (div.hasChildNodes() == true)
                        div.removeChild(div.childNodes[0]);
                    div.appendChild(canvas);
                };
                Application.prototype.drawSwitchSolid = function () {
                    if (this.recordWrapper) {
                        this.wrapper_to_canvas(this.recordWrapper.wrapper, this.recordWrapper.index);
                    }
                    else {
                        this.drawWrapper(this.result.front());
                    }
                };
                Application.prototype.render = function () {
                    var ret = React.createElement("div", null,
                        React.createElement("div", { style: { width: "100%", height: "100%", fontSize: 12 } },
                            React.createElement(flex.TabNavigator, { ref: "tabNavigator", solidCheck: this.state.solidCheck, handle_selectSolid: this.handle_selectSolid.bind(this), handle_reset: this.handle_reset.bind(this), style: { width: 400, height: "100%", float: "left" } },
                                React.createElement(flex.NavigatorContent, { label: "\u88C5\u8F7D\u9879" },
                                    React.createElement(demo.ItemEditor, { application: this, instances: this.state.instances, wrappers: this.state.wrappers })),
                                React.createElement(flex.NavigatorContent, { label: "\u88C5\u8F7D\u914D\u7F6E" },
                                    React.createElement(demo.ResultViewer, { application: this, wrappers: this.result }))),
                            React.createElement("div", { id: "wrapper_viewer", style: { height: "100%", overflow: "hidden" } })));
                    return ret;
                };
                Application.prototype.handle_selectSolid = function (e) {
                    var _this = this;
                    this.setState({
                        solidCheck: !this.state.solidCheck
                    }, function () {
                        _this.drawSwitchSolid();
                    });
                };
                Application.prototype.handle_reset = function () {
                    var wrapperInf = this.state.wrappers && this.state.wrappers.data_ && this.state.wrappers.data_[0];
                    this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 10000);
                    this.camera.position.x = -wrapperInf.length / 1.3;
                    this.camera.position.z = this.result.front().size() * 5;
                    this.trackball = new THREE.TrackballControls(this.camera);
                    this.trackball.rotateSpeed = 10;
                    this.trackball.zoomSpeed = 1.2;
                    this.trackball.panSpeed = 0.8;
                    this.trackball.noZoom = false;
                    this.trackball.noPan = false;
                    this.trackball.staticMoving = true;
                    this.trackball.dynamicDampingFactor = 0.3;
                    this.render_three();
                };
                Application.prototype.wrapper_to_canvas = function (wrapper, index) {
                    //
                    // ---------------------------------------
                    // CONSTRUCTS
                    // ---------------------------------------
                    // SCENE AND GEOMETRY
                    var wrapperInfo = this.state.wrappers.data_[0];
                    this.scene = new THREE.Scene();
                    this.scene.position.set(-wrapperInfo.width / 2, -wrapperInfo.height / 2, -wrapperInfo.length / 2);
                    var geometry = new THREE.BoxGeometry(1, 1, 1);
                    // BOUNDARY LINES
                    for (var i = 1; i <= 12; i++) {
                        var boundaryLine = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({
                            color: 0xFFFFFF, shading: THREE.FlatShading,
                            vertexColors: THREE.VertexColors, shininess: 0
                        }));
                        var width = void 0, height = void 0, length_1 = void 0;
                        var x = void 0, y = void 0, z = void 0;
                        // SCALE
                        switch (i) {
                            case 1:
                            case 3:
                            case 9:
                            case 12:
                                width = wrapper.getWidth() + 2 * Application.WRAPPER_BOUNDARY_THICKNESS;
                                height = Application.WRAPPER_BOUNDARY_THICKNESS;
                                length_1 = Application.WRAPPER_BOUNDARY_THICKNESS;
                                break;
                            case 2:
                            case 4:
                            case 10:
                            case 11:
                            case 10:
                                height = wrapper.getHeight() + 2 * Application.WRAPPER_BOUNDARY_THICKNESS;
                                width = Application.WRAPPER_BOUNDARY_THICKNESS;
                                length_1 = Application.WRAPPER_BOUNDARY_THICKNESS;
                                break;
                            default: // 5, 6, 7, 8
                                length_1 = wrapper.getLength() + 2 * Application.WRAPPER_BOUNDARY_THICKNESS;
                                width = Application.WRAPPER_BOUNDARY_THICKNESS;
                                height = Application.WRAPPER_BOUNDARY_THICKNESS;
                                break;
                        }
                        // X
                        switch (i) {
                            case 4:
                            case 6:
                            case 8:
                            case 11:
                                x = wrapper.getWidth() + Application.WRAPPER_BOUNDARY_THICKNESS;
                                break;
                            default:
                                x = -Application.WRAPPER_BOUNDARY_THICKNESS;
                                break;
                        }
                        // Y
                        switch (i) {
                            case 3:
                            case 7:
                            case 8:
                            case 12:
                                y = wrapper.getHeight();
                                break;
                            default:
                                y = -Application.WRAPPER_BOUNDARY_THICKNESS;
                                break;
                        }
                        // Z
                        switch (i) {
                            case 9:
                            case 10:
                            case 11:
                            case 12:
                                z = wrapper.getLength() + Application.WRAPPER_BOUNDARY_THICKNESS;
                                break;
                            default:
                                z = -Application.WRAPPER_BOUNDARY_THICKNESS;
                                break;
                        }
                        // SET POSITION AND SCALE
                        boundaryLine.scale.set(width, height, length_1);
                        boundaryLine.position.set(x + width / 2, y + height / 2, z + length_1 / 2);
                        this.scene.add(boundaryLine);
                    }
                    // CHILDREN (PACKED) INSTANCES
                    for (var i = 0; i < Math.min(index, wrapper.size()); i++) {
                        // 1st to 11th: boundaries, 12th: shape
                        var objects = this.wrap_to_display_objects(wrapper.at(i), geometry);
                        for (var j = 0; j < objects.size(); j++)
                            this.scene.add(objects.at(j));
                    }
                    // LIGHTS
                    var ambientLight = new THREE.AmbientLight(0x555555);
                    //let spotLight: THREE.SpotLight = new THREE.SpotLight(0xFFFFFF, 1.5);
                    //spotLight.position.set(0, 500, 2000);
                    this.scene.add(ambientLight);
                    //this.scene.add(spotLight);
                    // ---------------------------------------
                    // CAMERA, TRACKBALL AND MOUSE
                    // ---------------------------------------
                    if (this.camera == null) // LAZY CREATION
                     {
                        var wrapperInf = this.state.wrappers && this.state.wrappers.data_ && this.state.wrappers.data_[0];
                        this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 10000);
                        this.camera.position.x = -wrapperInf.length / 1.3;
                        this.camera.position.z = wrapper.size() * 5;
                        this.trackball = new THREE.TrackballControls(this.camera);
                        this.trackball.rotateSpeed = 10;
                        this.trackball.zoomSpeed = 1.2;
                        this.trackball.panSpeed = 0.8;
                        this.trackball.noZoom = false;
                        this.trackball.noPan = false;
                        this.trackball.staticMoving = true;
                        this.trackball.dynamicDampingFactor = 0.3;
                        this.mouse = new THREE.Vector2();
                        // RENDERER
                        this.renderer = new THREE.WebGLRenderer({ antialias: true });
                        this.renderer.setClearColor(0xFFFFFF);
                        this.renderer.setPixelRatio(window.devicePixelRatio);
                        this.renderer.setSize(window.innerWidth * .75, window.innerHeight);
                        this.renderer.sortObjects = false;
                        this.renderer.domElement.addEventListener("mousemove", this.handle_mouse_move.bind(this));
                        this.animate();
                    }
                    // ---------------------------------------
                    // RETURNS AN HTML_ELEMENT OF THE RENDERER
                    // ---------------------------------------
                    return this.renderer.domElement;
                };
                Application.prototype.wrap_to_display_objects = function (wrap, geometry) {
                    var objects = new std.Vector();
                    // ---------------------------------------
                    // BOUNDARIES
                    // ---------------------------------------
                    for (var i = 1; i <= 12; i++) {
                        var boundaryLine = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({
                            color: '#ddd', shading: THREE.FlatShading,
                            vertexColors: THREE.VertexColors, shininess: 0
                        }));
                        var width = void 0, height = void 0, length_2 = void 0;
                        var x = void 0, y = void 0, z = void 0;
                        // SCALE
                        switch (i) {
                            case 1:
                            case 3:
                            case 9:
                            case 12:
                                width = wrap.getLayoutWidth();
                                height = Application.WRAP_BOUNDARY_THICKNESS;
                                length_2 = Application.WRAP_BOUNDARY_THICKNESS;
                                break;
                            case 2:
                            case 4:
                            case 10:
                            case 11:
                            case 10:
                                height = wrap.getLayoutHeight();
                                width = Application.WRAP_BOUNDARY_THICKNESS;
                                length_2 = Application.WRAP_BOUNDARY_THICKNESS;
                                break;
                            default: // 5, 6, 7, 8
                                length_2 = wrap.getLength();
                                width = Application.WRAP_BOUNDARY_THICKNESS;
                                height = Application.WRAP_BOUNDARY_THICKNESS;
                                break;
                        }
                        // X
                        switch (i) {
                            case 4:
                            case 6:
                            case 8:
                            case 11:
                                x = wrap.getX() + wrap.getLayoutWidth() - Application.WRAP_BOUNDARY_THICKNESS;
                                break;
                            default:
                                x = wrap.getX();
                                break;
                        }
                        // Y
                        switch (i) {
                            case 3:
                            case 7:
                            case 8:
                            case 12:
                                y = wrap.getY() + wrap.getLayoutHeight() - Application.WRAP_BOUNDARY_THICKNESS;
                                break;
                            default:
                                y = wrap.getY();
                                break;
                        }
                        // Z
                        switch (i) {
                            case 9:
                            case 10:
                            case 11:
                            case 12:
                                z = wrap.getZ() + wrap.getLength() - Application.WRAP_BOUNDARY_THICKNESS;
                                break;
                            default:
                                z = wrap.getZ();
                                break;
                        }
                        // SET POSITION AND SCALE
                        boundaryLine.scale.set(width, height, length_2);
                        boundaryLine.position.set(x + width / 2, y + height / 2, z + length_2 / 2);
                        objects.push_back(boundaryLine);
                    }
                    // ---------------------------------------
                    // SHAPE
                    // ---------------------------------------
                    if (wrap.color_ == undefined)
                        wrap.color_ = wrap.instance.color || Math.random() * 0xFFFFFF;
                    var shape = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({
                        color: wrap.color_,
                        opacity: 0.5,
                        transparent: !this.state.solidCheck
                    }));
                    shape.scale.set(wrap.getLayoutWidth(), wrap.getLayoutHeight(), wrap.getLength());
                    shape.position.set(wrap.getX() + wrap.getLayoutWidth() / 2, wrap.getY() + wrap.getLayoutHeight() / 2, wrap.getZ() + wrap.getLength() / 2);
                    objects.push_back(shape);
                    return objects;
                };
                Application.prototype.handle_mouse_move = function (event) {
                    this.mouse.x = event.clientX;
                    this.mouse.y = event.clientY;
                };
                Application.prototype.animate = function () {
                    requestAnimationFrame(this.animate.bind(this));
                    this.render_three();
                };
                Application.prototype.render_three = function () {
                    this.trackball.update();
                    this.renderer.render(this.scene, this.camera);
                };
                /* -----------------------------------------------------------
                    MAIN FUNCTIONS
                ----------------------------------------------------------- */
                Application.main = function () {
                    ReactDOM.render(React.createElement(Application, null), document.body);
                };
                Application.WRAPPER_BOUNDARY_THICKNESS = 0.5;
                Application.WRAP_BOUNDARY_THICKNESS = 0.1;
                return Application;
            }(React.Component));
            demo.Application = Application;
        })(demo = packer_1.demo || (packer_1.demo = {}));
    })(packer = bws.packer || (bws.packer = {}));
})(bws || (bws = {}));
/// <reference path="API.ts" />
// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX
var bws;
(function (bws) {
    var packer;
    (function (packer) {
        var demo;
        (function (demo) {
            var Editor = /** @class */ (function (_super) {
                __extends(Editor, _super);
                /* ------------------------------------------------------------
                    CONSTRUCTORS
                ------------------------------------------------------------ */
                /**
                 * Default Constructor.
                 */
                function Editor() {
                    var _this = _super.call(this) || this;
                    _this.columns = _this.createColumns();
                    _this.selected_index = 0;
                    return _this;
                }
                /* ------------------------------------------------------------
                    ACCESSORSS
                ------------------------------------------------------------ */
                Editor.prototype.get_row = function (index) {
                    return this.props.dataProvider.at(index);
                };
                Editor.prototype.insert_instance = function (event) {
                    var child = this.props.dataProvider.createChild(null);
                    this.props.dataProvider.push_back(child);
                };
                Editor.prototype.erase_instances = function (event) {
                    try {
                        this.props.dataProvider.erase(this.props.dataProvider.begin().advance(this.selected_index));
                    }
                    catch (exception) {
                        // OUT OF RANGE 
                    }
                };
                /* ------------------------------------------------------------
                    EVENT HANDLERS
                ------------------------------------------------------------ */
                Editor.prototype.handle_data_change = function (event) {
                    setTimeout(this.setState.bind(this, {}), 0);
                };
                Editor.prototype.handle_row_change = function (event) {
                    Object.assign(this.props.dataProvider.at(event.rowIdx), event.updated);
                };
                Editor.prototype.handle_select = function (event) {
                    this.selected_index = event.rowIdx;
                };
                /* ------------------------------------------------------------
                    EXPORTERS
                ------------------------------------------------------------ */
                Editor.prototype.render = function () {
                    this.props.dataProvider.addEventListener("insert", this.handle_data_change, this);
                    this.props.dataProvider.addEventListener("erase", this.handle_data_change, this);
                    var ret = React.createElement("div", null,
                        React.createElement("h3", null, " \u88C5\u8F7D\u8D27\u7269\u5217\u8868 "),
                        React.createElement(ReactDataGrid, { rowGetter: this.get_row.bind(this), rowsCount: this.props.dataProvider.size(), columns: this.columns, onRowUpdated: this.handle_row_change.bind(this), onCellSelected: this.handle_select.bind(this), enableCellSelect: true, minHeight: Math.min(document.body.offsetHeight * .3, 40 + this.props.dataProvider.size() * 35) }),
                        React.createElement("p", { style: { textAlign: "right" } }));
                    return ret;
                };
                return Editor;
            }(React.Component));
            demo.Editor = Editor;
        })(demo = packer.demo || (packer.demo = {}));
    })(packer = bws.packer || (bws.packer = {}));
})(bws || (bws = {}));
/// <reference path="API.ts" />
// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX
var bws;
(function (bws) {
    var packer;
    (function (packer) {
        var demo;
        (function (demo) {
            var ItemEditor = /** @class */ (function (_super) {
                __extends(ItemEditor, _super);
                function ItemEditor() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                ItemEditor.prototype.clear = function (event) {
                    this.props.instances.clear();
                    this.props.wrappers.clear();
                };
                ItemEditor.prototype.open = function (event) {
                    var this_ = this;
                    var handle_select = function (event) {
                        file_ref.load();
                    };
                    var handle_complete = function (event) {
                        var packer_form = new packer.PackerForm();
                        packer_form.construct(new packer.library.XML(file_ref.data));
                        this_.props.instances.assign(packer_form.getInstanceFormArray().begin(), packer_form.getInstanceFormArray().end());
                        this_.props.wrappers.assign(packer_form.getWrapperArray().begin(), packer_form.getWrapperArray().end());
                    };
                    var file_ref = new packer.library.FileReference();
                    file_ref.addEventListener("select", handle_select);
                    file_ref.addEventListener("complete", handle_complete);
                    file_ref.browse();
                };
                ItemEditor.prototype.save = function (event) {
                    var packer_form = new packer.PackerForm(this.props.instances, this.props.wrappers);
                    var file_ref = new packer.library.FileReference();
                    file_ref.save(packer_form.toXML().toString(), "packing_items.xml");
                };
                ItemEditor.prototype.pack = function (event) {
                    this.props.application.pack();
                };
                ItemEditor.prototype.render = function () {
                    return React.createElement("div", null,
                        React.createElement("table", { style: { textAlign: "center" } },
                            React.createElement("tbody", null,
                                React.createElement("tr", null,
                                    React.createElement("td", null,
                                        " ",
                                        React.createElement("img", { src: "images/document.png", onClick: this.pack.bind(this) }),
                                        " ")),
                                React.createElement("tr", null,
                                    React.createElement("td", null, " \u88C5\u8F7D ")))),
                        React.createElement("hr", null),
                        React.createElement("p", null,
                            " ",
                            React.createElement(InstanceEditor, { dataProvider: this.props.instances }),
                            " "),
                        React.createElement("hr", null),
                        React.createElement("p", null,
                            " ",
                            React.createElement(WrapperEditor, { dataProvider: this.props.wrappers }),
                            " "));
                };
                return ItemEditor;
            }(React.Component));
            demo.ItemEditor = ItemEditor;
            var InstanceEditor = /** @class */ (function (_super) {
                __extends(InstanceEditor, _super);
                function InstanceEditor() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                InstanceEditor.prototype.createColumns = function () {
                    var columns = [
                        { key: "$name", name: "名称", editable: true, width: 100 },
                        { key: "$width", name: "宽", editable: true, width: 60 },
                        { key: "$height", name: "高", editable: true, width: 60 },
                        { key: "$length", name: "长", editable: true, width: 60 },
                        { key: "$count", name: "数量", editable: true, width: 60 }
                    ];
                    return columns;
                };
                return InstanceEditor;
            }(demo.Editor));
            demo.InstanceEditor = InstanceEditor;
            var WrapperEditor = /** @class */ (function (_super) {
                __extends(WrapperEditor, _super);
                function WrapperEditor() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                WrapperEditor.prototype.createColumns = function () {
                    var columns = [
                        { key: "$name", name: "名称", editable: true, width: 100 },
                        { key: "$width", name: "宽", editable: true, width: 60 },
                        { key: "$height", name: "高", editable: true, width: 60 },
                        { key: "$length", name: "长", editable: true, width: 60 },
                    ];
                    return columns;
                };
                return WrapperEditor;
            }(demo.Editor));
            demo.WrapperEditor = WrapperEditor;
        })(demo = packer.demo || (packer.demo = {}));
    })(packer = bws.packer || (bws.packer = {}));
})(bws || (bws = {}));
/// <reference path="API.ts" />
// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX
var bws;
(function (bws) {
    var packer;
    (function (packer) {
        var demo;
        (function (demo) {
            var ResultViewer = /** @class */ (function (_super) {
                __extends(ResultViewer, _super);
                function ResultViewer() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                ResultViewer.prototype.drawWrapper = function (wrapper, index) {
                    if (index === void 0) { index = wrapper.size(); }
                    console.log(this.props.application);
                    this.props.application.drawWrapper(wrapper, index);
                    this.props.application.updateRecrodWrapper(wrapper, index);
                };
                ResultViewer.prototype.clear = function (event) {
                    this.props.wrappers.clear();
                    this.drawWrapper(new packer.Wrapper());
                    this.refresh();
                };
                ResultViewer.prototype.open = function (event) {
                    var this_ = this;
                    var handle_select = function (event) {
                        file_ref.load();
                    };
                    var handle_complete = function (event) {
                        this_.props.wrappers.construct(new packer.library.XML(file_ref.data));
                        if (this_.props.wrappers.empty() == true)
                            this_.drawWrapper(new packer.Wrapper());
                        else
                            this_.drawWrapper(this_.props.wrappers.front());
                        this_.refresh();
                    };
                    var file_ref = new packer.library.FileReference();
                    file_ref.addEventListener("select", handle_select);
                    file_ref.addEventListener("complete", handle_complete);
                    file_ref.browse();
                };
                ResultViewer.prototype.save = function (event) {
                    var file_ref = new packer.library.FileReference();
                    var content = this.props.wrappers.toXML().toString();
                    file_ref.save(content, "packing_result.xml");
                };
                ResultViewer.prototype.refresh = function () {
                    this.refs["wrapperGrid"].setState({});
                    this.refs["wrapGrid"].setState({});
                };
                ResultViewer.prototype.render = function () {
                    var wrapper = this.props.wrappers.empty()
                        ? new packer.Wrapper()
                        : this.props.wrappers.front();
                    var ret = React.createElement("div", null,
                        React.createElement("table", { style: { textAlign: "center" } },
                            React.createElement("tbody", null,
                                React.createElement("tr", null),
                                React.createElement("tr", null))),
                        React.createElement("hr", null),
                        React.createElement("p", null, " \u88C5\u8F7D\u7ED3\u679C "),
                        React.createElement("ul", null,
                            React.createElement("li", null,
                                " \u7A7A\u95F4\u5229\u7528\u7387: ",
                                Math.round(this.props.wrappers.getUtilization() * 10000) / 100.0,
                                " % ")),
                        React.createElement("hr", null),
                        React.createElement("p", null,
                            " ",
                            React.createElement(WrapperGrid, { ref: "wrapperGrid", viewer: this }),
                            " "),
                        React.createElement("hr", null),
                        React.createElement("div", { id: "wrap_grid_div" },
                            React.createElement(WrapGrid, { ref: "wrapGrid", viewer: this })));
                    return ret;
                };
                return ResultViewer;
            }(React.Component));
            demo.ResultViewer = ResultViewer;
            var WrapperGrid = /** @class */ (function (_super) {
                __extends(WrapperGrid, _super);
                /* ------------------------------------------------------------
                    CONSTRUCTORS
                ------------------------------------------------------------ */
                /**
                 * Default Constructor.
                 */
                function WrapperGrid() {
                    var _this = _super.call(this) || this;
                    _this.selectedIndex = 0;
                    // CONSTRUCT COLUMNS
                    _this.columns =
                        [
                            { key: "$name", name: "名称", width: 120 },
                            { key: "$scale", name: "尺寸", width: 120 },
                            { key: "$spaceUtilization", name: "空间利用率", width: 90 }
                        ];
                    return _this;
                }
                Object.defineProperty(WrapperGrid.prototype, "wrappers", {
                    /* ------------------------------------------------------------
                        ACCESSORSS
                    ------------------------------------------------------------ */
                    get: function () {
                        return this.props.viewer.props.wrappers;
                    },
                    enumerable: false,
                    configurable: true
                });
                WrapperGrid.prototype.get_row = function (index) {
                    return this.wrappers.at(index);
                };
                WrapperGrid.prototype.handle_select = function (event) {
                    this.selectedIndex = event.rowIdx;
                    var wrapper = this.wrappers.at(this.selectedIndex);
                    this.props.viewer.drawWrapper(wrapper);
                    this.props.viewer.refs["wrapGrid"].setState({});
                };
                /* ------------------------------------------------------------
                    EXPORTERS
                ------------------------------------------------------------ */
                WrapperGrid.prototype.render = function () {
                    var ret = React.createElement("div", null,
                        React.createElement("h3", null, " \u5BB9\u5668\u5217\u8868"),
                        React.createElement(ReactDataGrid, { rowGetter: this.get_row.bind(this), rowsCount: this.wrappers.size(), columns: this.columns, enableCellSelect: true, onCellSelected: this.handle_select.bind(this), minHeight: Math.min(document.body.offsetHeight * .3, 40 + this.wrappers.size() * 35) }));
                    return ret;
                };
                return WrapperGrid;
            }(React.Component));
            var WrapGrid = /** @class */ (function (_super) {
                __extends(WrapGrid, _super);
                /* ------------------------------------------------------------
                    CONSTRUCTORS
                ------------------------------------------------------------ */
                /**
                 * Default Constructor.
                 */
                function WrapGrid() {
                    var _this = _super.call(this) || this;
                    // CONSTRUCT COLUMNS
                    _this.columns =
                        [
                            { key: "$instanceName", name: "名称", width: 120 },
                            { key: "$layoutScale", name: "宽, 高, 长", width: 90 },
                            { key: "$position", name: "坐标", width: 90 },
                            { key: '$color', name: '颜色', width: 50, formatter: function (obj) {
                                    var style = function (color) {
                                        return {
                                            width: '35px',
                                            height: '35px',
                                            background: color
                                        };
                                    };
                                    return React.createElement("div", { style: style(obj.value) });
                                } }
                        ];
                    return _this;
                }
                Object.defineProperty(WrapGrid.prototype, "wrapper", {
                    /* ------------------------------------------------------------
                        ACCESSORSS
                    ------------------------------------------------------------ */
                    get: function () {
                        var wrappers = this.props.viewer.props.wrappers;
                        try {
                            var index = this.props.viewer.refs["wrapperGrid"].selectedIndex;
                            var wrapper = this.props.viewer.props.wrappers.at(index);
                            return wrapper;
                        }
                        catch (exception) {
                            if (wrappers.empty() == true)
                                return new packer.Wrapper();
                            else
                                return wrappers.front();
                        }
                    },
                    enumerable: false,
                    configurable: true
                });
                WrapGrid.prototype.get_row = function (index) {
                    return this.wrapper.at(index);
                };
                WrapGrid.prototype.handle_select = function (event) {
                    this.props.viewer.drawWrapper(this.wrapper, event.rowIdx + 1);
                };
                /* ------------------------------------------------------------
                    EXPORTERS
                ------------------------------------------------------------ */
                WrapGrid.prototype.render = function () {
                    var ret = React.createElement("div", null,
                        React.createElement("h3", null, " \u5355\u4E2A\u5BB9\u5668\u88C5\u8F7D\u5B9E\u4F8B "),
                        React.createElement(ReactDataGrid, { rowGetter: this.get_row.bind(this), rowsCount: this.wrapper.size(), columns: this.columns, enableCellSelect: true, onCellSelected: this.handle_select.bind(this), minHeight: Math.min(document.body.offsetHeight * .3, 40 + this.wrapper.size() * 35) }));
                    return ret;
                };
                return WrapGrid;
            }(React.Component));
        })(demo = packer.demo || (packer.demo = {}));
    })(packer = bws.packer || (bws.packer = {}));
})(bws || (bws = {}));
// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX
var flex;
(function (flex) {
    var TabNavigator = /** @class */ (function (_super) {
        __extends(TabNavigator, _super);
        function TabNavigator() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        TabNavigator.prototype.render = function () {
            if (this.state == null)
                this.state = { selectedIndex: this.props.selectedIndex, solidCheck: false };
            if (this.state.selectedIndex == undefined)
                this.state = { selectedIndex: 0, solidCheck: false };
            var children = this.props.children;
            var selected = children[this.state.selectedIndex];
            var tabs = [];
            for (var i = 0; i < children.length; i++) {
                var child = children[i];
                var className = (i == this.state.selectedIndex) ? "active" : "";
                var label = React.createElement("li", { key: i, className: "tabNavigator_label" },
                    React.createElement("a", { href: "#", className: className, onClick: this.handle_change.bind(this, i) }, child.props.label));
                tabs.push(label);
            }
            var ret = React.createElement("div", { className: "tabNavigator", style: __assign(__assign({}, this.props.style), { position: 'relative' }) },
                React.createElement("ul", { className: "tabNavigator_label" }, tabs),
                selected,
                React.createElement("div", { style: {
                        position: 'absolute',
                        top: '5px',
                        right: '5px'
                    } },
                    React.createElement("button", { onClick: this.props.handle_reset }, "\u8FD8\u539F"),
                    React.createElement("input", { type: "checkbox", onChange: this.props.handle_selectSolid, style: { 'vertical-align': 'middle' }, defaultChecked: this.props.solidCheck }),
                    "\u5B9E\u5FC3"));
            return ret;
        };
        TabNavigator.prototype.handle_change = function (index, event) {
            this.setState({ selectedIndex: index });
        };
        return TabNavigator;
    }(React.Component));
    flex.TabNavigator = TabNavigator;
    var NavigatorContent = /** @class */ (function (_super) {
        __extends(NavigatorContent, _super);
        function NavigatorContent() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        NavigatorContent.prototype.render = function () {
            return React.createElement("div", { className: "tabNavigator_content" }, this.props.children);
        };
        return NavigatorContent;
    }(React.Component));
    flex.NavigatorContent = NavigatorContent;
})(flex || (flex = {}));
//# sourceMappingURL=packer.js.map