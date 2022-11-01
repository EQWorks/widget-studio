import React, { useState, useEffect, useMemo } from 'react'
import PropTypes from 'prop-types'

import { useDebounce } from 'use-debounce'
import { LocusMap } from '@eqworks/react-maps'
import { makeStyles } from '@eqworks/lumen-labs'

import { useStoreState, useStoreActions } from '../../../store'
import { getLayerValueKeys } from '../../../util/map-layer-value-functions'
import { complementaryColor } from '../../../util/color'
import { pixelOffset } from '../../../util/map-text-layer-offset'
import modes from '../../../constants/modes'
import {
  COORD_KEYS,
  MAP_LAYERS,
  MAP_LAYER_VALUE_VIS,
  MAP_LAYER_GEO_KEYS,
  MAP_VALUE_VIS,
  MAP_VIS_OTHERS,
  LAYER_SCALE,
  GEO_KEY_TYPES,
  GEO_KEY_TYPE_NAMES,
  PITCH,
  MAP_LEGEND_POSITION,
  MAP_LEGEND_SIZE,
  MIN_ZOOM,
  MAX_ZOOM,
  MAP_VIEW_STATE,
  MAP_TOAST_ZOOM_ADJUSTMENT,
  LABEL_OFFSET,
  KEY_ALIASES,
  XWI_KEY_ALIASES,
  ONE_ICON_SIZE,
} from '../../../constants/map'

import { COX_XWI_KEY_ALIASES } from '../../../constants/client-specific'


const useStyles = ({ width, height, marginTop }) => makeStyles({
  mapWrapper: {
    position: 'absolute',
    width: `${width}px`,
    height: `calc((${height}px) - (${marginTop}rem))`,
    marginTop: `${marginTop}rem`,
    overflow: 'hidden',
  },
})

const Map = ({ width, height, dataConfig, layerConfig, mapConfig }) => {
  const toast = useStoreActions(actions => actions.toast)
  const mode = useStoreState(state => state.ui.mode)
  const mapGroupKey = useStoreState(state => state.mapGroupKey)
  const uniqueOptions = useStoreState(state => state.uniqueOptions)
  const addUserControls = useStoreState((state) => state.addUserControls)
  const userControlKeyValues = useStoreState((state) => state.userControlKeyValues)

  const [currentViewport, setCurrentViewport] = useState({})
  const [debouncedCurrentViewport] = useDebounce(currentViewport, 500)
  const [showToastMessage, setShowToastMessage] = useState(false)

  const haveUserControls = useMemo(() => Boolean(addUserControls && userControlKeyValues.length),
    [addUserControls, userControlKeyValues])

  const MODE_DIMENSIONS = Object.freeze({
    [modes.EDITOR]: { marginTop: 0 },
    [modes.QL]: { marginTop: haveUserControls ? 0 : 0.75 },
    [modes.VIEW]: { marginTop: haveUserControls ? 0 : 0.75 },
    [modes.COMPACT]: { marginTop: haveUserControls? 0 : 0.75 },
  })

  const finalMarginTop = MODE_DIMENSIONS[mode].marginTop || 0

  const classes = useStyles({ width, height, marginTop: finalMarginTop })

  useEffect(() => {
    if (GEO_KEY_TYPES.postalcode.includes(mapGroupKey) && showToastMessage &&
      debouncedCurrentViewport?.zoom < MIN_ZOOM.postalCode - MAP_TOAST_ZOOM_ADJUSTMENT) {
      toast({
        title: 'Zoom in for postal code visualization!',
        color: 'warning',
      })
    }
  }, [toast, mapGroupKey, uniqueOptions, debouncedCurrentViewport, showToastMessage])

  useEffect(() => {
    if (GEO_KEY_TYPES.postalcode.includes(mapGroupKey) &&
      debouncedCurrentViewport?.zoom < MIN_ZOOM.postalCode) {
      setShowToastMessage(true)
    } else {
      setShowToastMessage(false)
    }
  }, [mapGroupKey, debouncedCurrentViewport])

  if (width > 0 && height > 0) {
    return (
      <div id='LocusMap' className={classes.mapWrapper}>
        <LocusMap {
          ...{
            dataConfig,
            layerConfig,
            mapConfig: {
              ...mapConfig,
              setCurrentViewport,
            },
          }
        } />
      </div>
    )
  }
  return null
}

Map.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  dataConfig: PropTypes.array.isRequired,
  layerConfig: PropTypes.array.isRequired,
  mapConfig: PropTypes.object.isRequired,
}

Map.defaultProps = {
  width: 0,
  height: 0,
}

export default {
  component: Map,
  adapt: (data, { wl, mapInitViewState, genericOptions, uniqueOptions, ...config }) => {
    const {
      mapGroupKey,
      mapGroupKeyTitle,
      mapValueKeys,
      formatDataKey,
      formatDataFunctions,
      mapTooltipLabelTitles,
    } = config
    const {
      baseColor,
      legendPosition,
      legendSize,
      showLegend,
      showTooltip,
      mapHideSourceLayer,
      mapHideTargetLayer,
      mapHideArcLayer,
      showLocationPins,
      mapPinTooltipKey,
    } = genericOptions

    const mapLayer = Object.keys(MAP_LAYERS)
      .find(layer => MAP_LAYER_GEO_KEYS[layer].includes(mapGroupKey))
    //----TO DO - extend geometry logic for other layers if necessary
    const dataKeys = Object.keys(data.arcData?.[0] || data[0]?.properties || data[0] || {})
    const findKey = keyArray => dataKeys?.find(key => keyArray.includes(key))

    const sourcePOIId = findKey(MAP_LAYER_GEO_KEYS.scatterplot)
    const targetPOIId = findKey(MAP_LAYER_GEO_KEYS.targetScatterplot)
    const sourceLon = findKey(COORD_KEYS.longitude)
    const sourceLat = findKey(COORD_KEYS.latitude)
    const targetLon = findKey(COORD_KEYS.targetLon)
    const targetLat = findKey(COORD_KEYS.targetLat)

    const isXWIReportMap = Boolean(data.arcData)

    let finalData = data
    let iconData = []
    let geometry = {}
    let iconLayerGeometry = {}
    let mapGroupKeyType = ''

    if ((mapLayer === MAP_LAYERS.scatterplot || showLocationPins) && !isXWIReportMap) {
      const latitude = dataKeys.find(key => COORD_KEYS.latitude.includes(key))
      const longitude = dataKeys.find(key => COORD_KEYS.longitude.includes(key))

      if (mapLayer === MAP_LAYERS.scatterplot) {
        geometry = { longitude, latitude }
      }

      if (showLocationPins) {
        if (!GEO_KEY_TYPES[GEO_KEY_TYPE_NAMES.region].includes(mapGroupKey)) {
          iconLayerGeometry = { longitude, latitude }
          iconData = data.reduce((acc, el ) => acc.find((elem) =>
            elem[longitude] === el[longitude] && elem[latitude] === el[latitude]) ?
            acc :
            [...acc, el]
          ,[])
        } else {
          iconLayerGeometry = { longitude, latitude }
          iconData = data.reduce((acc, el ) => acc.find((elem) => {
            return elem[longitude] === el.properties[longitude] &&
              elem[latitude] === el.properties[latitude]}) ?
            acc :
            [
              ...acc,
              { ...el.properties,
                lon: el.properties[longitude],
                lat: el.properties[latitude],
              },
            ]
          ,
          [])
        }
      }
    }

    if (mapLayer === MAP_LAYERS.geojson) {
      geometry = {
        geoKey: mapGroupKeyTitle,
        longitude: 'longitude',
        latitude: 'latitude',
        geometryAccessor: d => d.properties,
      }
      mapGroupKeyType = Object.keys(GEO_KEY_TYPES)
        .find(type => GEO_KEY_TYPES[type].includes(mapGroupKey))
      if (!GEO_KEY_TYPES[GEO_KEY_TYPE_NAMES.region].includes(mapGroupKey)) {
        finalData = {
          tileGeom: `${process.env.TEGOLA_SERVER_URL || process.env.STORYBOOK_TEGOLA_SERVER_URL}/maps/${mapGroupKeyType}/{z}/{x}/{y}.vector.pbf?`, // <ignore scan-env>
          tileData: data,
        }
      }
    }

    const { id, type } = config?.dataSource || {}

    const arcLayerValueKeys =
      getLayerValueKeys({ mapValueKeys, dataKeys, data: data?.arcData, layer: MAP_LAYERS.arc })
    const sourceLayerValueKeys =
      getLayerValueKeys({ mapValueKeys, dataKeys, data: data?.sourceData, layer: MAP_LAYERS.scatterplot })
    const targetLayerValueKeys =
      getLayerValueKeys({ mapValueKeys, dataKeys, data: data?.targetData, layer: MAP_LAYERS.targetScatterplot })

    // TO DO: move this logic out to Cox app
    const getFinalLayerTitle = i => {
      let layerTitle
      if (isXWIReportMap) {
        if (wl === 2456) {
          layerTitle = i === 0 ? data?.arcData?.[0]?.['Poi name'] || 'Dealer' : 'Competitor'
        } else {
          layerTitle = i === 0 ? 'Source Layer' : 'Target Layer'
        }
      }
      return layerTitle
    }

    // TO DO: move this logic out to Cox app
    const finalMapTooltipLabelTitles = wl === 2456 ?
      {
        sourceTitle: 'Poi name',
        targetTitle: 'Target poi name',
      } :
      mapTooltipLabelTitles

    let layerConfig = isXWIReportMap ?
      [
        {
          layer: MAP_LAYERS.arc,
          dataId: `${id}-${type}-arc`,
          geometry: {
            source: { longitude: sourceLon, latitude: sourceLat },
            target: { longitude: targetLon, latitude: targetLat },
          },
          visualizations: Object.fromEntries(
            MAP_LAYER_VALUE_VIS.arc.concat(Object.keys(MAP_VIS_OTHERS)).map(vis => {
              const keyTitle = mapValueKeys.find(({ mapVis }) => mapVis === vis)?.title
              const visValue = uniqueOptions[vis]?.value
              return [
                vis,
                {
                  value: keyTitle ?
                    { field: keyTitle } :
                    visValue,
                  valueOptions: uniqueOptions[vis]?.valueOptions,
                  dataScale: LAYER_SCALE,
                },
              ]
            })),
          interactions: {
            tooltip: {
              tooltipKeys: {
                tooltipTitle1: finalMapTooltipLabelTitles?.sourceTitle || sourcePOIId,
                tooltipTitle2: finalMapTooltipLabelTitles?.targetTitle || targetPOIId,
                metricKeys: arcLayerValueKeys,
              },
            },
          },
          legend: {
            showLegend: true,
            layerTitle: 'Arc Layer',
          },
          // TO DO: move this logic out to Cox app
          keyAliases: wl === 2456 ? COX_XWI_KEY_ALIASES : XWI_KEY_ALIASES,
          formatDataKey,
          formatDataValue: formatDataFunctions,
          schemeColor: baseColor,
          visible: !mapHideArcLayer,
        },
      ].concat(
        [
          { dataId: `${id}-${type}-source`, longitude: sourceLon, latitude: sourceLat },
          { dataId: `${id}-${type}-target`, longitude: targetLon, latitude: targetLat },
        ].map(({ dataId, longitude, latitude }, i) => ({
          layer: MAP_LAYER_VALUE_VIS[i === 0 ? 'scatterplot' : 'targetScatterplot']
            .some(vis => JSON.stringify(mapValueKeys)?.includes(vis)) ?
            MAP_LAYERS.scatterplot :
            MAP_LAYERS.icon,
          dataId,
          geometry: { longitude, latitude },
          visualizations: Object.fromEntries(
            MAP_LAYER_VALUE_VIS.scatterplot.concat(Object.keys(MAP_VIS_OTHERS)).map(vis => {
              const keyTitle = mapValueKeys.find(({ mapVis }) =>
                (i === 1 && vis === MAP_VALUE_VIS.fill && mapVis === MAP_VALUE_VIS.targetFill) ||
                (i === 1 && vis === MAP_VALUE_VIS.radius && mapVis === MAP_VALUE_VIS.targetRadius) ||
                (mapVis === vis && !(i === 1 && (mapVis === MAP_VALUE_VIS.fill || mapVis === MAP_VALUE_VIS.radius))))
                ?.title
              const visValue = uniqueOptions[vis]?.value

              return [
                vis,
                {
                  value: keyTitle ?
                    { field: keyTitle } :
                    visValue,
                  valueOptions: uniqueOptions[vis]?.valueOptions,
                  dataScale: LAYER_SCALE,
                },
              ]
            })
          ),
          interactions: {
            tooltip: {
              tooltipKeys: {
                tooltipTitle1: i === 0 ?
                  finalMapTooltipLabelTitles?.sourceTitle || sourcePOIId :
                  finalMapTooltipLabelTitles?.targetTitle || targetPOIId,
                metricKeys: longitude === targetLon ? targetLayerValueKeys : sourceLayerValueKeys,
              },
            },
          },
          legend: {
            showLegend: true,
            layerTitle: getFinalLayerTitle(i),
          },
          // TO DO: move this logic out to Cox app
          keyAliases: wl === 2456 ? COX_XWI_KEY_ALIASES : XWI_KEY_ALIASES,
          formatDataKey,
          formatDataValue: formatDataFunctions,
          // we don't apply opacity to icon layer for POI locations
          opacity:  MAP_LAYER_VALUE_VIS[i === 0 ? 'scatterplot' : 'targetScatterplot']
            .some(vis => JSON.stringify(mapValueKeys)?.includes(vis)) ?
            uniqueOptions.opacity.value / 100 :
            1,
          isTargetLayer: i === 1,
          schemeColor: baseColor,
          visible: i === 0 ? !mapHideSourceLayer : !mapHideTargetLayer,
        }))
      ) :
      [
        {
          layer: mapLayer,
          dataId: `${id}-${type}`,
          dataPropertyAccessor: mapLayer === MAP_LAYERS.geojson ? d => d.properties : d => d,
          geometry,
          visualizations: Object.fromEntries(
            MAP_LAYER_VALUE_VIS[mapLayer]?.concat(Object.keys(MAP_VIS_OTHERS)).map(vis => {
              const keyTitle = mapValueKeys.find(({ mapVis }) => mapVis === vis)?.title
              /*
              * we only allow to set the max elevation value, keeping the min=0, therefore,
              * in Widget Studio in uniqueOptions, we work with one value to use in slider updates;
              * however, the LocusMap receives an array valueOptions prop for elevation, hence
              * the special case for elevation in this case
              */
              const visValue = vis === MAP_VALUE_VIS.elevation ? 0 : uniqueOptions[vis]?.value
              return [
                vis,
                {
                  value: keyTitle ?
                    { field: keyTitle } :
                    visValue,
                  valueOptions: vis === MAP_VALUE_VIS.elevation ?
                    [0, uniqueOptions[vis]?.value] :
                    uniqueOptions[vis]?.valueOptions,
                  //----TO DO - ERIKA - add the LAYER_SCALE to state for editor when implementing constrols for scale
                  dataScale: LAYER_SCALE,
                },
              ]
            })),
          keyAliases: KEY_ALIASES,
          formatDataKey,
          formatDataValue: formatDataFunctions,
          interactions: {
            tooltip: {
              tooltipKeys: {
                tooltipTitle1: mapLayer === MAP_LAYERS.scatterplot ?
                  mapTooltipLabelTitles?.title || mapGroupKeyTitle :
                  mapGroupKeyTitle,
              },
            },
          },
          legend: { showLegend: true },
          schemeColor: baseColor,
          opacity: uniqueOptions.opacity.value / 100,
          minZoom: GEO_KEY_TYPES.postalcode.includes(mapGroupKey) ?
            MIN_ZOOM.postalCode :
            MIN_ZOOM.defaultValue,
          maxZoom: mapLayer === MAP_LAYERS.geojson ? MAX_ZOOM.geojson : MAX_ZOOM.defaultValue,
          // restrict initial zoom-in to data for postal code polygons; the browser might not be able to handle it
          initialViewportDataAdjustment: !GEO_KEY_TYPES.postalcode.includes(mapGroupKey) ||
            (GEO_KEY_TYPES.postalcode.includes(mapGroupKey) && data.length < 1000),
        },
      ]

    const radiusValue = uniqueOptions?.radius?.value
    const { showLabels } = genericOptions || {}

    if (showLabels && isXWIReportMap) {
      layerConfig = layerConfig.concat(
        [
          { dataId: `${id}-${type}-source`, longitude: sourceLon, latitude: sourceLat },
          { dataId: `${id}-${type}-target`, longitude: targetLon, latitude: targetLat },
        ].map(({ dataId, longitude, latitude }, i) => ({
          layer: 'text',
          dataId,
          geometry: { longitude, latitude },
          visualizations: {
            text: {
              value: {
                title: i === 0 ?
                  mapTooltipLabelTitles?.sourceTitle || 'Poi id' :
                  mapTooltipLabelTitles?.targetTitle || 'Target poi id',
                valueKeys: mapValueKeys.filter(({ mapVis }) => (i === 0 ?
                  // filter the visualisations for source layer
                  MAP_LAYER_VALUE_VIS.scatterplot :
                  // filter the visualisations for target layer
                  MAP_LAYER_VALUE_VIS.targetScatterplot)
                  .includes(mapVis))
                  .map(vis => vis.title),
              },
            },
            size: { value: 12 },
            pixelOffset: {
              value:  [radiusValue + LABEL_OFFSET.point, 0 - radiusValue - LABEL_OFFSET.point],
            },
          },
          // TO DO: move this logic out to Cox app
          keyAliases: wl === 2456 ? COX_XWI_KEY_ALIASES : XWI_KEY_ALIASES,
          formatDataKey,
          formatDataValue: formatDataFunctions,
          interactions: {},
          visible: i === 0 ? !mapHideSourceLayer : !mapHideTargetLayer,
        }))
      )
    }

    if (showLabels && !isXWIReportMap &&
        !JSON.stringify(mapValueKeys)?.includes(MAP_VALUE_VIS.elevation)) {
      layerConfig = [
        ...layerConfig,
        {
          layer: 'text',
          dataId: `${id}-${type}`,
          dataPropertyAccessor: mapLayer === MAP_LAYERS.geojson ? d => d.properties : d => d,
          geometry,
          visualizations: {
            text: {
              value: {
                title: mapLayer === mapLayer === MAP_LAYERS.scatterplot ?
                  mapTooltipLabelTitles?.title || mapGroupKeyTitle :
                  mapGroupKeyTitle,
                valueKeys: mapValueKeys.map(vis => vis.title),
              },
            },
            pixelOffset: {
              value: pixelOffset({ mapLayer, radiusValue }),
            },
          },
          keyAliases: KEY_ALIASES,
          formatDataKey,
          formatDataValue: formatDataFunctions,
          interactions: {},
        },
      ]
    }

    let dataConfig = []

    if (isXWIReportMap) {
      dataConfig = [
        { id: `${id}-${type}-arc`, data: finalData.arcData },
        { id: `${id}-${type}-source`, data: finalData.sourceData },
        { id: `${id}-${type}-target`, data: finalData.targetData },
      ]
    } else {
      dataConfig = [
        { id: `${id}-${type}`, data: finalData },
      ]
      if (iconData.length) {
        dataConfig = [...dataConfig, { id: `${id}-${type}-icon`, data: iconData }]
      }
    }

    if (showLocationPins && iconData.length && !isXWIReportMap) {
      layerConfig = [
        ...layerConfig,
        {
          layer: MAP_LAYERS.icon,
          dataId: `${id}-${type}-icon`,
          geometry: iconLayerGeometry,
          visualizations: Object.fromEntries(
            Object.keys(MAP_VIS_OTHERS).map(vis =>
              [
                vis,
                {
                  value: iconData.length === 1 ?
                    ONE_ICON_SIZE :
                    uniqueOptions[vis]?.value,
                },
              ],
            )
          ),
          interactions: mapPinTooltipKey?.title ?
            {
              tooltip: {
                tooltipKeys: {
                  tooltipTitle1: mapPinTooltipKey.title,
                },
              },
            } :
            {},
          schemeColor: complementaryColor({ baseColor }),
          initialViewportDataAdjustment: !GEO_KEY_TYPES.postalcode.includes(mapGroupKey) ||
            (GEO_KEY_TYPES.postalcode.includes(mapGroupKey) && data.length < 1000),
        },
      ]
    }

    return ({
      dataConfig,
      layerConfig,
      mapConfig: {
        legendPosition: MAP_LEGEND_POSITION[JSON.stringify(legendPosition)],
        legendSize: MAP_LEGEND_SIZE[legendSize],
        mapboxApiAccessToken: process.env.MAPBOX_ACCESS_TOKEN ||
          process.env.STORYBOOK_MAPBOX_ACCESS_TOKEN, // <ignore scan-env>
        showMapLegend: showLegend,
        showMapTooltip: showTooltip,
        initViewState:  {
          ...GEO_KEY_TYPES.postalcode.includes(mapGroupKey) ?
            MAP_VIEW_STATE.postalCode :
            MAP_VIEW_STATE.value,
          ...mapInitViewState,
        },
        pitch: mapValueKeys.map(({ mapVis }) => mapVis).includes(MAP_VALUE_VIS.elevation) ||
          (isXWIReportMap &&
          (!mapHideArcLayer ||
            ![...MAP_LAYER_VALUE_VIS.scatterplot, ...MAP_LAYER_VALUE_VIS.targetScatterplot]
              .some(vis => JSON.stringify(mapValueKeys)?.includes(vis)))) ?
          PITCH.elevation :
          PITCH.default,
        controller: {
          scrollZoom: false,
          doubleClickZoom: true,
        },
      },
    })
  },
}
