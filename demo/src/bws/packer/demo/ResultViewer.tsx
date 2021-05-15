﻿/// <reference path="API.ts" />

// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX

namespace bws.packer.demo
{
	export class ResultViewer
		extends React.Component<WrapperViewerProps, {}>
	{
		public drawWrapper(wrapper: Wrapper, index: number = wrapper.size()): void
		{
			console.log(this.props.application)
			this.props.application.drawWrapper(wrapper, index);
			this.props.application.updateRecrodWrapper(wrapper, index) 
		}

		private clear(event: React.MouseEvent<HTMLElement>): void
		{
			this.props.wrappers.clear();
			this.drawWrapper(new Wrapper());

			this.refresh();
		}
		private open(event: React.MouseEvent<HTMLElement>): void
		{
			let this_ = this;
			let handle_select = function (event: library.BasicEvent): void
			{
				file_ref.load();
			}
			let handle_complete = function (event: library.BasicEvent): void
			{
				this_.props.wrappers.construct(new library.XML(file_ref.data));
				
				if (this_.props.wrappers.empty() == true)
					this_.drawWrapper(new Wrapper());
				else
					this_.drawWrapper(this_.props.wrappers.front());

				this_.refresh();
			}

			let file_ref = new library.FileReference();
			file_ref.addEventListener("select", handle_select);
			file_ref.addEventListener("complete", handle_complete);

			file_ref.browse();
		}
		private save(event: React.MouseEvent<HTMLElement>): void
		{
			let file_ref: library.FileReference = new library.FileReference();
			let content: string = this.props.wrappers.toXML().toString();

			file_ref.save(content, "packing_result.xml");
		}

		public refresh(): void
		{
			(this.refs["wrapperGrid"] as WrapperGrid).setState({});
			(this.refs["wrapGrid"] as WrapGrid).setState({});
		}

		public render(): JSX.Element
		{
			let wrapper: Wrapper = this.props.wrappers.empty()
				? new Wrapper()
				: this.props.wrappers.front();

			let ret: JSX.Element = 
				<div>
					<table style={{ textAlign: "center" }}>
						<tbody>
							<tr>
								{/* <td> <img src="images/newFile.png" onClick={this.clear.bind(this) } /> </td>
								<td> <img src="images/openFile.png" onClick={this.open.bind(this) } /> </td>
								<td> <img src="images/saveFile.png" onClick={this.save.bind(this) } /> </td> */}
							</tr>
							<tr>
								{/* <td> New File </td>
								<td> Open File </td>
								<td> Save File </td> */}
							</tr>
						</tbody>
					</table>
					<hr />
					<p> 装载结果 </p>
					<ul>
						<li> 空间利用率: {Math.round(this.props.wrappers.getUtilization() * 10000) / 100.0} % </li>
					</ul>
					<hr />
					<p> <WrapperGrid ref="wrapperGrid"
									 viewer={this} /> </p>
					<hr />
					<div id="wrap_grid_div"> 
						<WrapGrid ref="wrapGrid" 
								  viewer={this} /> 
					</div>
				</div>;

			return ret;
		}
	}

	class WrapperGrid extends React.Component<WrapperGridProps, {}>
	{
		private columns: AdazzleReactDataGrid.Column[];

		public selectedIndex: number = 0;

		/* ------------------------------------------------------------
			CONSTRUCTORS
		------------------------------------------------------------ */
		/**
		 * Default Constructor.
		 */
		public constructor()
		{
			super();

			// CONSTRUCT COLUMNS
			this.columns =
				[
					{ key: "$name", name: "名称", width: 120 },
					{ key: "$scale", name: "尺寸", width: 90 },
					{ key: "$spaceUtilization", name: "空间利用率", width: 90 }
				];
		}

		/* ------------------------------------------------------------
			ACCESSORSS
		------------------------------------------------------------ */
		private get wrappers(): WrapperArray
		{
			return this.props.viewer.props.wrappers;
		}

		private get_row(index: number): Wrapper
		{
			return this.wrappers.at(index);
		}

		private handle_select(event: any): void
		{
			this.selectedIndex = event.rowIdx;
			let wrapper = this.wrappers.at(this.selectedIndex);

			this.props.viewer.drawWrapper(wrapper);
			(this.props.viewer.refs["wrapGrid"] as WrapGrid).setState({});
		}

		/* ------------------------------------------------------------
			EXPORTERS
		------------------------------------------------------------ */
		public render(): JSX.Element
		{
			let ret: JSX.Element =
				<div>
					<h3> 容器列表</h3>
					<ReactDataGrid rowGetter={this.get_row.bind(this) }
								   rowsCount={this.wrappers.size() }
								   columns={this.columns}
								
								   enableCellSelect={true} 
								   onCellSelected={this.handle_select.bind(this)}
						
								   minHeight={Math.min(document.body.offsetHeight * .3, 40 + this.wrappers.size() * 35)} />
				</div>;
			return ret;
		}
	}

	class WrapGrid extends React.Component<WrapGridProps, {}>
	{
		private columns: AdazzleReactDataGrid.Column[];

		/* ------------------------------------------------------------
			CONSTRUCTORS
		------------------------------------------------------------ */
		/**
		 * Default Constructor.
		 */
		public constructor()
		{
			super();



			// CONSTRUCT COLUMNS
			this.columns =
				[
					{ key: "$instanceName", name: "名称", width: 120 },
					{ key: "$layoutScale", name: "宽, 高, 长", width: 90 },
					{ key: "$position", name: "坐标", width: 90 },
					{ key: '$color', name: '颜色', width: 50, formatter: (obj: any) => {

						let style = (color: string) => {
							return {
								width: '35px',
								height: '35px',
								background: color
							}
						}
						return <div style={style(obj.value)}></div>
					}}
				];
		}

		/* ------------------------------------------------------------
			ACCESSORSS
		------------------------------------------------------------ */
		private get wrapper(): Wrapper
		{
			let wrappers: WrapperArray = this.props.viewer.props.wrappers;

			try
			{
				let index: number = (this.props.viewer.refs["wrapperGrid"] as WrapperGrid).selectedIndex;
				let wrapper: Wrapper = this.props.viewer.props.wrappers.at(index);
				return wrapper;
			}
			catch (exception)
			{
				if (wrappers.empty() == true)
					return new Wrapper();
				else
					return wrappers.front();
			}
		}

		private get_row(index: number): Wrap
		{
			return this.wrapper.at(index);
		}

		private handle_select(event: any): void
		{
			this.props.viewer.drawWrapper(this.wrapper, event.rowIdx + 1);
		}

		/* ------------------------------------------------------------
			EXPORTERS
		------------------------------------------------------------ */
		public render(): JSX.Element
		{
			let ret: JSX.Element =
				<div>
					<h3> 单个容器装载实例 </h3>
					<ReactDataGrid rowGetter={this.get_row.bind(this) }
						rowsCount={this.wrapper.size()}
						columns={this.columns}

						enableCellSelect={true}
						onCellSelected={this.handle_select.bind(this) }
						
						minHeight={Math.min(document.body.offsetHeight * .3, 40 + this.wrapper.size() * 35)} />
				</div>;
			return ret;
		}
	}

	export interface WrapperViewerProps extends React.Props<ResultViewer>
	{
		application: Application;
		wrappers: WrapperArray;
	}
	interface WrapperGridProps extends React.Props<WrapperGrid>
	{
		viewer: ResultViewer;
	}
	interface WrapGridProps extends React.Props<WrapGrid>
	{
		viewer: ResultViewer;
	}
}