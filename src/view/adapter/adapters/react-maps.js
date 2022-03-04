import React, { useEffect } from 'react'
import PropTypes from 'prop-types'

import { useStoreState, useStoreActions } from '../../../store'

import { LocusMap } from '@eqworks/react-maps'
import { getCursor } from '@eqworks/react-maps/dist/utils'
import { makeStyles } from '@eqworks/lumen-labs'

import { cleanUp } from '../../../util/string-manipulation'
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
  PITCH,
  MAP_LEGEND_POSITION,
  MAP_LEGEND_SIZE,
  MIN_ZOOM,
  MAX_ZOOM,
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

const Map = ({ width, height, ...props }) => {
  const toast = useStoreActions(actions => actions.toast)
  const mode = useStoreState(state => state.ui.mode)
  const mapGroupKey = useStoreState(state => state.mapGroupKey)
  const uniqueOptions = useStoreState(state => state.uniqueOptions)

  const MODE_DIMENSIONS = Object.freeze({
    [modes.EDITOR]: { marginTop: 0 },
    [modes.QL]: { marginTop: 0.75 },
    [modes.VIEW]: { marginTop: 0.75 },
  })

  const finalMarginTop = MODE_DIMENSIONS[mode].marginTop || 0

  const classes = useStyles({ width, height, marginTop: finalMarginTop })

  useEffect(() => {
    if (GEO_KEY_TYPES.postalcode.includes(mapGroupKey)) {
      toast({
        title: 'Zoom in for postal code visualization!',
        color: 'warning',
      })
    }
  }, [toast, mapGroupKey, uniqueOptions])

  if (width > 0 && height > 0) {
    return (
      <div id='LocusMap' className={classes.mapWrapper}>
        <LocusMap {...props} />
      </div>
    )
  }
  return null
}

Map.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  props: PropTypes.object,
}

Map.defaultProps = {
  width: 0,
  height: 0,
  props: {},
}

export default {
  component: Map,
  adapt: (data, { genericOptions, uniqueOptions, ...config }) => {
    const { mapGroupKey, mapGroupKeyTitle, mapValueKeys } = config
    const mapLayer = Object.keys(MAP_LAYER_VALUE_VIS).find(layer => MAP_LAYER_GEO_KEYS[layer].includes(mapGroupKey))
    //----TO DO - extend geometry logic for other layers if necessary
    const dataKeys = Object.keys(data[0])

    const getTooltipKey = (tooltipKey) =>
      dataKeys.find(key => MAP_LAYER_GEO_KEYS[mapLayer].map(elem => cleanUp(elem)).includes(key) &&
        key.toLowerCase().includes(tooltipKey))

    let name = ''
    let id = ''
    let geometry = {}
    let mapGroupKeyType = ''
    if (mapLayer === MAP_LAYERS.scatterplot) {
      const latitude = dataKeys.find(key => COORD_KEYS.latitude.includes(key))
      const longitude = dataKeys.find(key => COORD_KEYS.longitude.includes(key))
      geometry = { longitude, latitude }
      name = getTooltipKey('name') || getTooltipKey('poi')
      if (name) {
        id = getTooltipKey('id') === name ? '' : getTooltipKey('id')
      }
    }
    if (mapLayer === MAP_LAYERS.geojson) {
      geometry = { geoKey: mapGroupKeyTitle }
      name = mapGroupKeyTitle
      mapGroupKeyType = Object.keys(GEO_KEY_TYPES).find(type => GEO_KEY_TYPES[type].includes(mapGroupKey))
    }

    // TO DO: implement logic for when we want to use geojson layer to display POIs in editor mode
    const dataSource = mapLayer === MAP_LAYERS.geojson ?
      {
        tileGeom: `https://mapsource.locus.place/maps/${mapGroupKeyType}/{z}/{x}/{y}.vector.pbf?`,
        tileData: data,
      } :
      data

    return ({
      // create a good id
      dataConfig: [{ id: 'testWIReport', data: dataSource }],
      layerConfig: [{
        layer: mapLayer,
        dataId: 'testWIReport',
        dataPropertyAccessor: mapLayer === MAP_LAYERS.geojson ? d => d.properties : d => d,
        geometry,
        visualizations: Object.fromEntries(
          MAP_LAYER_VALUE_VIS[mapLayer].concat(Object.keys(MAP_VIS_OTHERS)).map(vis => {
            const keyTitle = mapValueKeys.find(({ mapVis }) => mapVis === vis)?.title
            /*
            * we only allow to set the max elevation value, keeping the min=0, therefore,
            * in Widget Studio in uniqueOptions, we work with one value to use in slider updates;
            * however, the LocusMap receives an array valueOptions prop for elevation, hence
            * the special case for elevation in this case
            */
            const visValue = vis === 'elevation' ? 0 : uniqueOptions[vis]?.value
            return [
              vis,
              {
                value: keyTitle ?
                  { field: keyTitle } :
                  visValue,
                valueOptions: vis === 'elevation' ?
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
              name,
              id,
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
      }],
      mapConfig: {
        cursor: (layers) => getCursor({ layers }),
        legendPosition: MAP_LEGEND_POSITION[JSON.stringify(genericOptions.legendPosition)],
        legendSize: MAP_LEGEND_SIZE[genericOptions.legendSize],
        mapboxApiAccessToken: process.env.MAPBOX_ACCESS_TOKEN || process.env.STORYBOOK_MAPBOX_ACCESS_TOKEN, // <ignore scan-env>
        showMapLegend: genericOptions.showLegend,
        showMapTooltip: genericOptions.showTooltip,
        initViewState: GEO_KEY_TYPES.postalcode.includes(mapGroupKey) ?
          uniqueOptions.mapViewState.postalCode :
          uniqueOptions.mapViewState.value,
        pitch: mapValueKeys.map(({ mapVis }) => mapVis).includes(MAP_VALUE_VIS.elevation) ?
          PITCH.elevation :
          PITCH.default,
      },
    })
  },
}
