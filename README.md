# widget-studio 

System to generate, handle and control widget config objects, graduated from `ml-ui`

## Getting started

In `widget-studio` project root:
```shell
$ nvm use
$ yarn install
$ yarn start
```

Navigate to http://localhost:6008 to view the development storybook.

## Short intro
This project allows us to have a `Widget` component that reads a config object and passes it to some visualization-library-specific `WidgetAdapter`.

Optionally, the `Widget` component can be wrapped in a `WidgetStudio`. In this case, one container is rendered that encapsulates the chart, widget configuration controls, data source selection, and raw data view. 

Specifically, these components can be used in **_one of three_** ways:

1. A `WidgetStudio` implicitly passes its controlled `config` object as a prop to its child. 
```jsx
import { WidgetAdapter as NivoAdapter } from '@eqworks/chart-system'

<WidgetStudio>
  <Widget adapter={NivoAdapter} /> 
</WidgetStudio>
```

2. A standalone `Widget` explicitly receives an `id` prop and queries a database to retrieve the appropriate config object. * 
```jsx
import { WidgetAdapter as NivoAdapter } from '@eqworks/chart-system'

<Widget id={someID} adapter={NivoAdapter} />
```

3. A `Widget` wrapped in a `WidgetStudio` explicitly receives an `id` prop and queries a database to retrieve the appropriate config object. * Then, the `WidgetStudio` gains control of that object and the result is similar to case #1. 
```jsx
import { WidgetAdapter as NivoAdapter } from '@eqworks/chart-system'

<WidgetStudio>
  <Widget id={someID} adapter={NivoAdapter} />
</WidgetStudio>
```

\* *Currently, the widget config database is not implemented and configs are instead retrieved from a hardcoded file.*
