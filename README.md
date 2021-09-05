# widget-studio 

System to generate and control widgets, graduated from `ml-ui`

## Getting started
In `widget-studio` project root:
```shell
$ nvm use
$ yarn install
$ yarn start
```

Navigate to http://localhost:6008 to view the development storybook.

## Short intro
This project provides a declarative `Widget` component with a simple interface.

- `id`: `string`
  - identifier for a widget config JSON that this widget will read from and update. 
- `studio`: `bool`
  - default `false`
  - If `studio === true`, one container is rendered that encapsulates the chart, widget configuration controls, data source selection, and raw data view. Otherwise, only the chart and title are rendered. 
- `staticData`: `bool`
  - default `false`
  - If `staticData === true`, controls for modifying the widget's data source are not exposed to the frontend.

---
## Usage scenarios

1. A `Widget` has no `id`, so its initial configuration is empty, but its studio features are enabled so it has the capacity to construct a config. This widget is "starting from scratch."
```jsx
<Widget studio /> 
```

2. A `Widget` has an `id` that determines its initial configuration. Its configuration is controlled by the enabled studio features. This widget is essentially a "loaded" widget.
```jsx
<Widget studio id={someID} />
```

3. A `Widget` has an `id` that determines its initial configuration. This configuration cannot change because the studio features are not enabled. This widget is essentially a read-only chart with a title.

```jsx
<Widget id={someID} />
```

\* *Currently, the widget config database is not implemented and configs are instead retrieved from a hardcoded file.*
