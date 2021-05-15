// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX

namespace flex
{
	export class TabNavigator extends React.Component<TabNavigatorProps, TabNavigatorProps>
	{
		public render(): JSX.Element
		{
			if (this.state == null)
				this.state = { selectedIndex: this.props.selectedIndex, solidCheck: false };
			if (this.state.selectedIndex == undefined)
				this.state = { selectedIndex: 0, solidCheck: false };
			
			let children: NavigatorContent[] = this.props.children as NavigatorContent[];
			let selected: NavigatorContent = children[this.state.selectedIndex];

			let tabs: JSX.Element[] = [];

			for (let i = 0; i < children.length; i++)
			{
				let child: NavigatorContent = children[i];
				let className: string = (i == this.state.selectedIndex) ? "active" : "";

				let label: JSX.Element = 
					<li key={i} className="tabNavigator_label">
						<a href="#" className={className}  style={{'font-size': '1.17em'}}
						   onClick={this.handle_change.bind(this, i) }>{child.props.label}</a>
					</li>;

				tabs.push(label);
			}
			
			let ret: JSX.Element =
				<div className="tabNavigator" style={{...this.props.style, position: 'relative'}}>
					<ul className="tabNavigator_label">
						{tabs}
					</ul>
					{selected}
					<div style={{
						position: 'absolute',
						top: '5px',
						right: '5px'
					}}>
						<button onClick={this.props.handle_reset}>还原</button>
						<input 
							type="checkbox" 
							onChange={this.props.handle_selectSolid} 
							style={{'vertical-align': 'middle'}}
							defaultChecked={this.props.solidCheck}/>
							实心
					</div>
				</div>;

			return ret;
		}

		private handle_change(index: number, event: React.MouseEvent<HTMLElement>): void
		{
			this.setState({ selectedIndex: index });
		}
	}
	
	export class NavigatorContent extends React.Component<NavigatorContentProps, NavigatorContentProps>
	{
		public render(): JSX.Element
		{
			return <div className="tabNavigator_content">{this.props.children}</div>;
		}
	}

	export interface TabNavigatorProps extends React.Props<TabNavigator>
	{
		selectedIndex?: number;
		solidCheck?: boolean;
		style?: React.CSSProperties;
		handle_selectSolid?: any,
		handle_reset?: any
	}
	export interface NavigatorContentProps extends React.Props<NavigatorContent>
	{
		label: string;
	}
}