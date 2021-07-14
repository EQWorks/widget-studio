
# widget-studio 

Collection of widgets and controls, graduated from `ml-ui`

Currently, `ml-ui` is the only project that can create this component, as it can pass an object containing saved queries as the data source. The goal is to generalize this in order for `widget-studio` to be used in multiple places throughout Locus. 

## Getting started

As `widget-studio` is not yet published as a package, we can use it by making a symbolic link in the parent project. 

In `widget-studio` project root:
```shell
$ yarn link
$ yarn install
$ yarn build       # or yarn watch for development
```

In `ml-ui` project root:
```shell
$ yarn link "@eqworks/widget-studio"
```

Example usage to replicate existing functionality in `ml-ui/src/hooks/nav-control.js`:
```jsx
...
// import Widgets from './widgets'
import WidgetStudio from '@eqworks/widget-studio'
...
topNavConfig = [
  ...
  {
    tab: 'Widget Studio',
    tabIndex: 1,
    isSelected: false,
    // TabComponent: Widgets,
    TabComponent: WidgetStudio,
    leftNavs: ['Saved', 'Execution History'],
    selectedLeftNav: 'Saved',
  }
]
...
export const useNavControl = ({ qlModel }) => {
  ...
  const topNavChildren = topNavConfig.map(({ tab, TabComponent, tabComponent }, i) => {
    ...
    } else if (tab === 'Widget Studio') {
      return (<TabComponent key='widget-studio' qlModel={qlModel} />)
    ...
  })
  ...
}
```