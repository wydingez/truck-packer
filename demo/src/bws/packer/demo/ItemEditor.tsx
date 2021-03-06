/// <reference path="API.ts" />

// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX

namespace bws.packer.demo
{
	export interface ItemEditorProps extends React.Props<ItemEditor>
	{
		application: Application;
		instances: InstanceFormArray;
		wrappers: WrapperArray;
	}

	export class ItemEditor
		extends React.Component<ItemEditorProps, { }>
	{
		private clear(event: React.MouseEvent<HTMLElement>): void
		{
			this.props.instances.clear();
			this.props.wrappers.clear();
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
				let packer_form = new PackerForm();
				packer_form.construct(new library.XML(file_ref.data));

				this_.props.instances.assign(packer_form.getInstanceFormArray().begin(), packer_form.getInstanceFormArray().end());
				this_.props.wrappers.assign(packer_form.getWrapperArray().begin(), packer_form.getWrapperArray().end());
			}

			let file_ref = new library.FileReference();
			file_ref.addEventListener("select", handle_select);
			file_ref.addEventListener("complete", handle_complete);

			file_ref.browse();
		}
		private save(event: React.MouseEvent<HTMLElement>): void
		{
			let packer_form = new PackerForm(this.props.instances, this.props.wrappers);

			let file_ref = new library.FileReference();
			file_ref.save(packer_form.toXML().toString(), "packing_items.xml");
		}

		private pack(event: React.MouseEvent<HTMLElement>): void
		{
			this.props.application.pack();
		}

		public render(): JSX.Element
		{
			return <div>
					<table style={{ textAlign: "center" }}>
					<tbody>
						<tr>
							{/* <td> <img src="images/newFile.png" onClick={this.clear.bind(this)} /> </td>
							<td> <img src="images/openFile.png" onClick={this.open.bind(this)} /> </td>
							<td> <img src="images/saveFile.png" onClick={this.save.bind(this)} /> </td> */}
							<td> <img src="images/document.png" onClick={this.pack.bind(this)} /> </td>
						</tr>
						<tr>
							{/* <td> New File </td>
							<td> Open File </td>
							<td> Save File </td> */}
							<td> 装载 </td>
						</tr>
					</tbody>
					</table>
					<hr />
					<p> <InstanceEditor dataProvider={this.props.instances} title="车辆列表"/> </p>
					<hr />
					<p> <WrapperEditor dataProvider={this.props.wrappers} title="装载货物列表"/> </p>
				</div>;
		}
	}

	export class InstanceEditor extends Editor<InstanceForm>
	{
		protected createColumns(): AdazzleReactDataGrid.Column[]
		{
			let columns: AdazzleReactDataGrid.Column[] = 
				[
					{ key: "$name", name: "名称", width: 100 },
					{ key: "$width", name: "宽", width: 60 },
					{ key: "$height", name: "高", width: 60 },
					{ key: "$length", name: "长", width: 60 },
					{ key: "$count", name: "数量", width: 60 }
				];
			return columns;
		}
	}

	export class WrapperEditor extends Editor<Wrapper>
	{
		protected createColumns(): AdazzleReactDataGrid.Column[]
		{
			let columns: AdazzleReactDataGrid.Column[] =
				[
					{ key: "$name", name: "名称", width: 100 },
					{ key: "$width", name: "宽", width: 60 },
					{ key: "$height", name: "高", width: 60 },
					{ key: "$length", name: "长", width: 60 },
				];
			return columns;
		}
	}
}