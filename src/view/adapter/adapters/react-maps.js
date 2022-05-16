import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

import { useDebounce } from 'use-debounce'
import { useStoreState, useStoreActions } from '../../../store'

import { LocusMap } from '@eqworks/react-maps'
import { getCursor } from '@eqworks/react-maps/dist/utils'
import { makeStyles } from '@eqworks/lumen-labs'

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
  MAP_TOAST_ZOOM_ADJUSTMENT,
  LABEL_OFFSET,
} from '../../../constants/map'


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
  const userUpdate = useStoreActions(actions => actions.userUpdate)
  const mode = useStoreState(state => state.ui.mode)
  const mapGroupKey = useStoreState(state => state.mapGroupKey)
  const uniqueOptions = useStoreState(state => state.uniqueOptions)

  const [currentViewport, setCurrentViewport] = useState({})
  const [debouncedCurrentViewport] = useDebounce(currentViewport, 500)
  const [showToastMessage, setShowToastMessage] = useState(false)

  const MODE_DIMENSIONS = Object.freeze({
    [modes.EDITOR]: { marginTop: 0 },
    [modes.QL]: { marginTop: 0.75 },
    [modes.VIEW]: { marginTop: 0.75 },
    [modes.COMPACT]: { marginTop: 0.75 },
  })

  const finalMarginTop = MODE_DIMENSIONS[mode].marginTop || 0

  const classes = useStyles({ width, height, marginTop: finalMarginTop })

  useEffect(() => {
    if (GEO_KEY_TYPES.postalcode.includes(mapGroupKey) &&
        currentViewport?.zoom < MIN_ZOOM.postalCode - MAP_TOAST_ZOOM_ADJUSTMENT &&
        showToastMessage) {
      toast({
        title: 'Zoom in for postal code visualization!',
        color: 'warning',
      })
    }
  }, [toast, mapGroupKey, uniqueOptions, currentViewport, showToastMessage])

  useEffect(() => {
    // display toast message only after the initial zooming in for postal code visualization
    if (GEO_KEY_TYPES.postalcode.includes(mapGroupKey) &&
        currentViewport?.zoom >= MIN_ZOOM.postalCode) {
      setShowToastMessage(true)
    }
    if (!GEO_KEY_TYPES.postalcode.includes(mapGroupKey)) {
      setShowToastMessage(false)
    }
  }, [mapGroupKey, currentViewport])

  // update uniqueOptions.mapViewState with current map viewport config
  useEffect(() => {
    if (debouncedCurrentViewport.width) {
      userUpdate(
        {
          uniqueOptions: {
            mapViewState: GEO_KEY_TYPES.postalcode.includes(mapGroupKey) ?
              { postalCode: debouncedCurrentViewport } :
              { value: debouncedCurrentViewport },
          },
        }
      )
    }
  }, [debouncedCurrentViewport, mapGroupKey, userUpdate])

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
  adapt: (data, { genericOptions, uniqueOptions, ...config }) => {
    const { mapGroupKey, mapGroupKeyTitle, mapValueKeys } = config

    const mapLayer = Object.keys(MAP_LAYERS)
      .find(layer => MAP_LAYER_GEO_KEYS[layer].includes(mapGroupKey))
    //----TO DO - extend geometry logic for other layers if necessary
    const dataKeys = Object.keys(data.arcData ? data.arcData[0] : data[0] || {})

    const findCoord = coordArray => dataKeys?.find(key => coordArray.includes(key))

    const sourceLon = findCoord(COORD_KEYS.longitude)
    const sourceLat = findCoord(COORD_KEYS.latitude)
    const targetLon = findCoord(COORD_KEYS.targetLon)
    const targetLat = findCoord(COORD_KEYS.targetLat)

    const isXWIReportMap = Boolean(data.arcData)

    let finalData = data
    let geometry = {}
    let mapGroupKeyType = ''

    if (mapLayer === MAP_LAYERS.scatterplot) {
      const latitude = dataKeys.find(key => COORD_KEYS.latitude.includes(key))
      const longitude = dataKeys.find(key => COORD_KEYS.longitude.includes(key))
      geometry = { longitude, latitude }
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
          schemeColor: genericOptions.baseColor,
        },
      ].concat(
        [
          { dataId: `${id}-${type}-source`, longitude: sourceLon, latitude: sourceLat },
          { dataId: `${id}-${type}-target`, longitude: targetLon, latitude: targetLat },
        ].map(({ dataId, longitude, latitude }, i) => ({
          layer: MAP_LAYERS.scatterplot,
          dataId,
          geometry: { longitude, latitude },
          visualizations: Object.fromEntries(
            MAP_LAYER_VALUE_VIS.scatterplot.concat(Object.keys(MAP_VIS_OTHERS)).map(vis => {
              const keyTitle = mapValueKeys.find(({ mapVis }) =>
                (i === 1 && vis === MAP_VALUE_VIS.fill && mapVis === MAP_VALUE_VIS.targetFill) ||
                (i === 1 && vis === MAP_VALUE_VIS.radius && mapVis === MAP_VALUE_VIS.targetRadius) ||
                (mapVis === vis && !(i === 1 && (mapVis === MAP_VALUE_VIS.fill || mapVis === MAP_VALUE_VIS.radius))))
                ?.title
              let finalVis = vis
              if (i === 1 && vis === MAP_VALUE_VIS.fill) {
                finalVis = MAP_VALUE_VIS.targetFill
              }
              if (i === 1 && vis === MAP_VALUE_VIS.radius) {
                finalVis = MAP_VALUE_VIS.targetRadius
              }
              const visValue = uniqueOptions[finalVis]?.value
              return [
                vis,
                {
                  value: keyTitle ?
                    { field: keyTitle } :
                    visValue,
                  valueOptions: uniqueOptions[finalVis]?.valueOptions,
                  dataScale: LAYER_SCALE,
                },
              ]
            })),
          opacity: uniqueOptions.opacity.value / 100,
          isTargetLayer: longitude === targetLon,
          schemeColor: genericOptions.baseColor,
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
          formatData: config.formatDataFunctions,
          interactions: {
            tooltip: {
              tooltipKeys: {
                name: mapGroupKeyTitle,
              },
            },
          },
          legend: { showLegend: true },
          schemeColor: genericOptions.baseColor,
          opacity: uniqueOptions.opacity.value / 100,
          minZoom: GEO_KEY_TYPES.postalcode.includes(mapGroupKey) ?
            MIN_ZOOM.postalCode :
            MIN_ZOOM.defaultValue,
          maxZoom: mapLayer === MAP_LAYERS.geojson ? MAX_ZOOM.geojson : MAX_ZOOM.defaultValue,
        },
      ]

    const radiusValue = uniqueOptions?.radius?.value
    const { showLabels } = genericOptions || {}

    layerConfig = showLabels && !JSON.stringify(mapValueKeys)?.includes(MAP_VALUE_VIS.elevation) ?
      [
        ...layerConfig,
        {
          layer: 'text',
          dataId: `${id}-${type}`,
          dataPropertyAccessor: mapLayer === MAP_LAYERS.geojson ? d => d.properties : d => d,
          geometry,
          visualizations: {
            text: {
              value: {
                title: mapGroupKeyTitle,
                valueKeys: mapValueKeys.map(vis => vis.title),
              },
            },
            pixelOffset: {
              value: mapLayer === MAP_LAYERS.scatterplot ?
                [radiusValue + LABEL_OFFSET.point, 0 - radiusValue - LABEL_OFFSET.point] :
                [LABEL_OFFSET.polygon, 0],
            },
          },
          formatData: config.formatDataFunctions,
          interactions: {},
        },
      ] :
      layerConfig

    return ({
      dataConfig: isXWIReportMap ?
        [
          { id: `${id}-${type}-arc`, data: finalData.arcData },
          { id: `${id}-${type}-source`, data: finalData.sourceData },
          { id: `${id}-${type}-target`, data: finalData.targetData },
        ] :
        [
          { id: `${id}-${type}`, data: finalData },
        ],
      layerConfig,
      mapConfig: {
        cursor: (layers) => getCursor({ layers }),
        legendPosition: MAP_LEGEND_POSITION[JSON.stringify(genericOptions.legendPosition)],
        legendSize: MAP_LEGEND_SIZE[genericOptions.legendSize],
        mapboxApiAccessToken: process.env.MAPBOX_ACCESS_TOKEN ||
          process.env.STORYBOOK_MAPBOX_ACCESS_TOKEN, // <ignore scan-env>
        showMapLegend: genericOptions.showLegend,
        showMapTooltip: genericOptions.showTooltip,
        initViewState: GEO_KEY_TYPES.postalcode.includes(mapGroupKey) ?
          uniqueOptions.mapViewState.postalCode :
          uniqueOptions.mapViewState.value,
        pitch: mapValueKeys.map(({ mapVis }) => mapVis).includes(MAP_VALUE_VIS.elevation) || isXWIReportMap?
          PITCH.elevation :
          PITCH.default,
      },
    })
  },
}
