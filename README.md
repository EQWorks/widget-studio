### NOTE
This document describes a usage pattern that is changed in unmerged branches. Please see [this README](https://github.com/EQWorks/widget-studio/blob/refactor/new-component-structure/README.md) for the most recent usage pattern which is more intuitive with fewer caveats.

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
This project allows us to have a portable `Widget` component that reads a config object and passes it to some visualization-library-specific `WidgetAdapter`.

Optionally, the `Widget` component can be wrapped in a `WidgetStudio`. In this case, one container is rendered that encapsulates the chart, widget configuration controls, data source selection, and raw data view. 

---
## Usage scenarios

**`WidgetStudio`+`Widget` can be used in **_one of three_** ways:**

1. A `WidgetStudio` **implicitly** passes its controlled `config` object as a prop to its child. 
```jsx
<WidgetStudio>
  <Widget /> 
</WidgetStudio>
```

2. A standalone `Widget` **explicitly receives an `id` prop** and retrieves the appropriate config object. * 
```jsx
<Widget id={someID}  />
```

3. A `Widget` **explicitly receives an `id` prop _but is also wrapped in a `WidgetStudio`_**. The `Widget` retrieves the appropriate config object, **but the `WidgetStudio` then "reaches into" the Widget, reads the Widget's config, and overrides the Widget's config with a new controlled copy.** Once this process is complete (represented by `initComplete` state), the final result is similar to case 1 above. 
```jsx
<WidgetStudio>
  <Widget id={someID} />
</WidgetStudio>
```

\* *Currently, the widget config database is not implemented and configs are instead retrieved from a hardcoded file.*
