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
- `mode`: `string`
  - default `'view_only'`
  - possible values are `'view_only'`, `'ql'`, and `'editor'`. 
- `staticData`: `bool`
  - default `false`
  - If `staticData === true`, controls for modifying the widget's data source are not exposed to the frontend.

---
## Usage scenarios

1. A `Widget` has no `id`, so its initial configuration is empty, but its studio features are enabled so it has the capacity to modify its own configuration. This widget is "starting from scratch."
```jsx
<Widget mode='editor' /> 
```

2. A `Widget` has an `id` that determines its initial configuration. Its configuration is controlled by the enabled studio features. This widget is essentially a "loaded" widget.
```jsx
<Widget mode='editor' id={someID} />
```

3. A `Widget` has an `id` that determines its initial configuration. This configuration cannot change because the editor features are not enabled. This widget is essentially read-only.

```jsx
<Widget mode='view_only' id={someID} />
```
