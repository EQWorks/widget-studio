# Widget Studio

System to create & configure widgets.



## Getting started
In `widget-studio` project root:
```shell
$ nvm use
$ yarn install
$ yarn start
```

Navigate to http://localhost:6008 to view the development storybook.

---

![image](https://user-images.githubusercontent.com/53827672/155380039-55f85ddf-6b22-4815-8173-34d92bf99aeb.png)

![image](https://user-images.githubusercontent.com/53827672/155379886-4dcecc54-444a-44e4-8624-334b1e9e81bd.png)

![image](https://user-images.githubusercontent.com/53827672/155380165-a9a5bd37-e42e-491b-b423-ebf84ac1a311.png)

![image](https://user-images.githubusercontent.com/53827672/155380256-95e15dbf-90bc-4a93-9e39-076a8da86452.png)

## Widget component documentation

### Props

- **id** - id of the widget. Defaults is `undefined`.
- **mode** - Widget Studio's mode. Default is `'editor'`. Options: `['editor', 'ql', 'view_only', 'compact_view_only']`.
- **wl** - EQ Works's whitelabel. Default is `null`.
- **cu** - EQ Works's customer. Default is `null`.
- **staticData** - Defaults is `boolean`.
- **config** - widget configuration object. [Ref](https://github.com/EQWorks/widget-studio/blob/b9936a7d29d1dc88f1d2a8b9538d8abad6f22906/src/store/model.js#L189). Default is `null`.
- **rows** - data rows. Default is `null`.
- **columns** - data columns. Default is `null`.
- **className** - styling classes. Defaults is `''`
- **allowOpenInEditor** - whether or not to allow Editor button in Widget view. Defaults to `true`.
- **onOpenInEditor** - callback to handle opening the widget in Editor. Default is `null`.
- **onInsightsDataRequired** - callback to pass back `{id, dataSourceID, type}` to parent element. Default is `() => {}`.
- **saveWithInsightsData** - whether to save or not as an Insights Data- sourced widget. Default is `false`.
- **dataProviderResponse** - response object from data provider. Default is `{}`.
- **onWidgetRender** - callback to determine the state of the widget (ie: rendering). Default is `() => {}`.
- **filters** - data filters. Default is `[]`. Example:
  ```
  [{ key: 'resolution', filter: [5000] }]
  ```
- **executionID** - execution id. Defaults is `-1`
- **sampleData** - sample data passed to widget for testing. Defaults to `null`.
- **sampleConfigs** - list of sample configs for testing. Default is `null`.
- **mapGroupKey** - map group key. Default is `''`. [Options](https://github.com/EQWorks/widget-studio/blob/96299e2a437a81e895922b8f08cdd9ac6b3fb2bc/src/constants/map.js#L71).
- **useMVTOption** - whether to use MVT layer in the map when data source is polygons. Default is `null`.
- **mapTooltipLabelTitles** - column names for the tooltip titles. Default is `null`. Example:
  ```
  {
    sourceTitle: 'poi_name',
    targetTitle: 'target_poi_name',
    title: 'poi_id',
  }
  ```
- **customXMapLegendLayerTitles** - labels for layer names in the legend for cross visit maps. Default is `null`. Example:
  ```
  {
    sourceTitle: 'Shop',
    targetTitle: 'Competitor Shop',
  }
  ```
- **customColors** - custom colors to use in chart and maps. Default is `null`. Example:
  ```
  {
    chart: {
    color1: ['#004C86', '#CF7047', '#1F7F79', '#B24456', '#582A7D'],
    color2: [...],
  },
    map: {
      baseColor: '#218CCD',
      targetLayerColor: '',
      iconColor: '#CF7047',
    },
  }
  ```
- **dataFormat** - object of data formatting functions. Default is `null`. Example:
  ```
  {
    years: {
      keyList: ['Age Group'],
      formatFunction: (val) => val,
      formatSymbol: {
        isPrefix: false,
        symbol: 'years',
      },
    },
    coxPercentageA: {
      keyList: [
        'rate', 'visits',
      ],
      formatFunction: (val) => numeral(val / 100).format('0.00%'),
      formatSymbol: {
        isPrefix: false,
        symbol: '%',
      },
    },
  }
  ```
- **insightsDataCategories** - categories of data for special category map. Default is `null`. Example:
  ```
  {
    population: [
      'Total Population',
      'Male+ Population',
      'Female+ Population',
    ],
    families: [
      'Lone Parent',
      'Couple - no Children',
      'Couple - with Children',
      'Other',
    ],
  }
  ```
- **categoryOrder** - list of ordered cateries / columns. Defaults is `null`. Example:
  ```
  ['Population', 'Families']
  ```