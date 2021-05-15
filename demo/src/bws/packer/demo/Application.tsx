/// <reference path="API.ts" />

// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX

namespace bws.packer.demo
{
	export class Application
		extends React.Component<{solidCheck?: boolean, instances?: InstanceFormArray, wrappers?: WrapperArray}, {solidCheck?: boolean, instances?: InstanceFormArray, wrappers?: WrapperArray}>
	{
		private instances: InstanceFormArray;
		private wrappers: WrapperArray;

		private result: WrapperArray;

		private recordWrapper: {wrapper: Wrapper, index: number}

		/* -----------------------------------------------------------
			CONSTRUCTORS
		----------------------------------------------------------- */
		/**
		 * Default Constructor.
		 */
		public constructor()
		{
			super();
			
			// this.instances = new InstanceFormArray();
			// this.wrappers = new WrapperArray();
			this.result = new WrapperArray();

			this.state = { solidCheck: false, instances: new InstanceFormArray(), wrappers: new WrapperArray() }
			this.recordWrapper = null
			
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

			console.log(222)

			window.addEventListener('message',(event) => {
				//  if(event.origin !== 'http://davidwalsh.name') return;
					let instances = new InstanceFormArray()
					let wrappers = new WrapperArray()
				 	let info = event.data

					 console.log(111, event.data)

					wrappers.push(new Wrapper(info.vehicleNo, info.vehicleNo, info.vehicleWidth, info.vehicleHeight, info.vehicleLength, 0))
	
					info.packageList.forEach(good => {
						instances.push(new InstanceForm(new Product(good.partName, good.width, good.height, good.length, good.color), good.sum))
					})

					this.setState({
						instances,
						wrappers
					}, () => {
						this.pack()
					})
			}, false);
		}

		public getUrlParams (key: string) : string {
			let reg: RegExp = new RegExp(`(^|&)${key}=([^&]*)(&|$)`)
			let r: RegExpMatchArray = window.location.search.substr(1).match(reg)

			let ret: string = ''
			
			if (r != null) {
				ret = unescape(r[2])
			}

			return ret
		}

		/* -----------------------------------------------------------
			PROCEDURES
		----------------------------------------------------------- */
		public pack(): void
		{
			let packer_form: PackerForm = new PackerForm(this.state.instances, this.state.wrappers);

			/////
			// FIND THE OPTIMIZED SOLUTION
			/////
			let packer: Packer = packer_form.toPacker();
			let result: WrapperArray;

			try
			{
				result = packer.optimize();
			}
			catch (exception)
			{
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
			(this.refs["tabNavigator"] as flex.TabNavigator).setState({ selectedIndex: 1 });
		}

		public updateRecrodWrapper (wrapper: Wrapper, index: number) {
			this.recordWrapper = {wrapper, index}
		}

		public drawWrapper(wrapper: Wrapper, index: number = wrapper.size()): void
		{
			// INITIALIZE
			let div: HTMLDivElement = document.getElementById("wrapper_viewer") as HTMLDivElement;
			let canvas: HTMLCanvasElement = this.wrapper_to_canvas(wrapper, index); // DRAW

			this.recordWrapper = null
			// PRINT
			if (div.hasChildNodes() == true)
				div.removeChild(div.childNodes[0]);
			div.appendChild(canvas);
		}

		public drawSwitchSolid () {
			if (this.recordWrapper) {
				this.wrapper_to_canvas(this.recordWrapper.wrapper, this.recordWrapper.index)
			} else {
				this.drawWrapper(this.result.front())
			}
		}
		
		/* -----------------------------------------------------------
			RENDERERS
		----------------------------------------------------------- */
		private scene: THREE.Scene = null;
		private renderer: THREE.WebGLRenderer = null;

		private camera: THREE.PerspectiveCamera = null;
		private trackball: THREE.TrackballControls = null;
		private mouse: THREE.Vector2 = null;

		private static WRAPPER_BOUNDARY_THICKNESS: number = 0.5;
		private static WRAP_BOUNDARY_THICKNESS: number = 0.1;

		public render(): JSX.Element
		{
			let ret: JSX.Element =
				<div>
					<div style={{width: "100%", height: "100%", fontSize: 12}}>
						<flex.TabNavigator 
							ref="tabNavigator"
							solidCheck={this.state.solidCheck}
							handle_selectSolid={this.handle_selectSolid.bind(this)}
							handle_reset={this.handle_reset.bind(this)}
										   style={{ width: 400, height: "100%", float: "left" }}>
							<flex.NavigatorContent label="装载项">
								<ItemEditor application={this}
											instances={this.state.instances} wrappers={this.state.wrappers} />
							</flex.NavigatorContent>
							<flex.NavigatorContent label="装载配置">
								<ResultViewer application={this} 
											  wrappers={this.result} />
							</flex.NavigatorContent>
						</flex.TabNavigator>
						<div id="wrapper_viewer" style={{height: "100%", overflow: "hidden"}}>
						</div>
					</div>
				</div>;
			
			return ret;
		}

		private handle_selectSolid (e: React.FormEvent<HTMLInputElement>) : void {
			this.setState({
				solidCheck: !this.state.solidCheck
			}, () => {
				this.drawSwitchSolid()
			})
		} 

		private handle_reset () {
			let wrapperInf = this.state.wrappers && this.state.wrappers.data_ && this.state.wrappers.data_[0]

			this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 10000);
			this.camera.position.x = -wrapperInf.length / 1.3
			this.camera.position.z = this.result.front().size() * 5;

			this.trackball = new THREE.TrackballControls(this.camera);
			this.trackball.rotateSpeed = 10;
			this.trackball.zoomSpeed = 1.2;
			this.trackball.panSpeed = 0.8;
			this.trackball.noZoom = false;
			this.trackball.noPan = false;
			this.trackball.staticMoving = true;
			this.trackball.dynamicDampingFactor = 0.3;

			this.render_three()
		}

		private wrapper_to_canvas(wrapper: Wrapper, index: number): HTMLCanvasElement
		{
			//
			// ---------------------------------------
			// CONSTRUCTS
			// ---------------------------------------
			// SCENE AND GEOMETRY
			let wrapperInfo = this.state.wrappers.data_[0]

			this.scene = new THREE.Scene();
			this.scene.position.set(-wrapperInfo.width / 2, -wrapperInfo.height / 2, - wrapperInfo.length / 2)

			let geometry: THREE.BoxGeometry = new THREE.BoxGeometry(1, 1, 1);

			// BOUNDARY LINES
			for (let i: number = 1; i <= 12; i++)
			{
				let boundaryLine: THREE.Mesh =
					new THREE.Mesh
						(
						geometry,
						new THREE.MeshPhongMaterial
							({
								color: 0xFFFFFF, shading: THREE.FlatShading,
								vertexColors: THREE.VertexColors, shininess: 0
							})
						);
				let width: number, height: number, length: number;
				let x: number, y: number, z: number;

				// SCALE
				switch (i)
				{
					case 1: case 3: case 9: case 12:
						width = wrapper.getWidth() + 2 * Application.WRAPPER_BOUNDARY_THICKNESS;
						height = Application.WRAPPER_BOUNDARY_THICKNESS;
						length = Application.WRAPPER_BOUNDARY_THICKNESS;
						break;
					case 2: case 4: case 10: case 11: case 10:
						height = wrapper.getHeight() + 2 * Application.WRAPPER_BOUNDARY_THICKNESS;
						width = Application.WRAPPER_BOUNDARY_THICKNESS;
						length = Application.WRAPPER_BOUNDARY_THICKNESS;
						break;
					default: // 5, 6, 7, 8
						length = wrapper.getLength() + 2 * Application.WRAPPER_BOUNDARY_THICKNESS;
						width = Application.WRAPPER_BOUNDARY_THICKNESS;
						height = Application.WRAPPER_BOUNDARY_THICKNESS;
						break;
				}

				// X
				switch (i)
				{
					case 4: case 6: case 8: case 11:
						x = wrapper.getWidth() + Application.WRAPPER_BOUNDARY_THICKNESS;
						break;
					default:
						x = -Application.WRAPPER_BOUNDARY_THICKNESS;
						break;
				}

				// Y
				switch (i)
				{
					case 3: case 7: case 8: case 12:
						y = wrapper.getHeight();
						break;
					default:
						y = -Application.WRAPPER_BOUNDARY_THICKNESS;
						break;
				}

				// Z
				switch (i)
				{
					case 9: case 10: case 11: case 12:
						z = wrapper.getLength() + Application.WRAPPER_BOUNDARY_THICKNESS;
						break;
					default:
						z = -Application.WRAPPER_BOUNDARY_THICKNESS;
						break;
				}

				// SET POSITION AND SCALE
				boundaryLine.scale.set(width, height, length);
				boundaryLine.position.set(x + width / 2, y + height / 2, z + length / 2);

				this.scene.add(boundaryLine);
			}

			// CHILDREN (PACKED) INSTANCES
			for (let i: number = 0; i < Math.min(index, wrapper.size()); i++)
			{
				// 1st to 11th: boundaries, 12th: shape
				let objects: std.Vector<THREE.Object3D> = this.wrap_to_display_objects(wrapper.at(i), geometry);

				for (let j: number = 0; j < objects.size(); j++)
					this.scene.add(objects.at(j));
			}

			// LIGHTS
			let ambientLight: THREE.AmbientLight = new THREE.AmbientLight(0x555555);
			//let spotLight: THREE.SpotLight = new THREE.SpotLight(0xFFFFFF, 1.5);

			//spotLight.position.set(0, 500, 2000);

			this.scene.add(ambientLight);
			//this.scene.add(spotLight);

			// ---------------------------------------
			// CAMERA, TRACKBALL AND MOUSE
			// ---------------------------------------
			if (this.camera == null) // LAZY CREATION
			{
				let wrapperInf = this.state.wrappers && this.state.wrappers.data_ && this.state.wrappers.data_[0]

				this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 10000);
				this.camera.position.x = -wrapperInf.length / 1.3
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
		}

		private wrap_to_display_objects(wrap: Wrap, geometry: THREE.Geometry): std.Vector<THREE.Object3D>
		{
			let objects: std.Vector<THREE.Object3D> = new std.Vector<THREE.Object3D>();

			// ---------------------------------------
			// BOUNDARIES
			// ---------------------------------------
			for (let i: number = 1; i <= 12; i++)
			{
				let boundaryLine: THREE.Mesh =
					new THREE.Mesh
						(
						geometry,
						new THREE.MeshPhongMaterial
							({
								color: '#ddd', shading: THREE.FlatShading,
								vertexColors: THREE.VertexColors, shininess: 0
							})
						);
				let width: number, height: number, length: number;
				let x: number, y: number, z: number;

				// SCALE
				switch (i)
				{
					case 1: case 3: case 9: case 12:
						width = wrap.getLayoutWidth();
						height = Application.WRAP_BOUNDARY_THICKNESS;
						length = Application.WRAP_BOUNDARY_THICKNESS;
						break;
					case 2: case 4: case 10: case 11: case 10:
						height = wrap.getLayoutHeight();
						width = Application.WRAP_BOUNDARY_THICKNESS;
						length = Application.WRAP_BOUNDARY_THICKNESS;
						break;
					default: // 5, 6, 7, 8
						length = wrap.getLength();
						width = Application.WRAP_BOUNDARY_THICKNESS;
						height = Application.WRAP_BOUNDARY_THICKNESS;
						break;
				}

				// X
				switch (i)
				{
					case 4: case 6: case 8: case 11:
						x = wrap.getX() + wrap.getLayoutWidth() - Application.WRAP_BOUNDARY_THICKNESS;
						break;
					default:
						x = wrap.getX();
						break;
				}

				// Y
				switch (i)
				{
					case 3: case 7: case 8: case 12:
						y = wrap.getY() + wrap.getLayoutHeight() - Application.WRAP_BOUNDARY_THICKNESS;
						break;
					default:
						y = wrap.getY();
						break;
				}

				// Z
				switch (i)
				{
					case 9: case 10: case 11: case 12:
						z = wrap.getZ() + wrap.getLength() - Application.WRAP_BOUNDARY_THICKNESS;
						break;
					default:
						z = wrap.getZ();
						break;
				}

				// SET POSITION AND SCALE
				boundaryLine.scale.set(width, height, length);
				boundaryLine.position.set(x + width / 2, y + height / 2, z + length / 2);

				objects.push_back(boundaryLine);
			}

			// ---------------------------------------
			// SHAPE
			// ---------------------------------------
			if ((wrap as any).color_ == undefined)
				(wrap as any).color_ = wrap.instance.color || Math.random() * 0xFFFFFF;

			let shape: THREE.Mesh = new THREE.Mesh
			(
				geometry,
				new THREE.MeshBasicMaterial
				({
					color: (wrap as any).color_,
					opacity: 0.5,
					transparent: !this.state.solidCheck
				})
			);

			shape.scale.set(wrap.getLayoutWidth(), wrap.getLayoutHeight(), wrap.getLength());
			shape.position.set
			(
				wrap.getX() + wrap.getLayoutWidth() / 2,
				wrap.getY() + wrap.getLayoutHeight() / 2,
				wrap.getZ() + wrap.getLength() / 2
			);

			objects.push_back(shape);
			return objects;
		}

		private handle_mouse_move(event: MouseEvent): void
		{
			this.mouse.x = event.clientX;
			this.mouse.y = event.clientY;
		}
		private animate(): void
		{
			requestAnimationFrame(this.animate.bind(this));
			this.render_three();
		}
		private render_three(): void
		{
			this.trackball.update();
			this.renderer.render(this.scene, this.camera);
		}

		/* -----------------------------------------------------------
			MAIN FUNCTIONS
		----------------------------------------------------------- */
		public static main(): void
		{
			ReactDOM.render(<Application />, document.body);
		}
	}
}