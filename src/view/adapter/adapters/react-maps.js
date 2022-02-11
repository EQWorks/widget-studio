import React from 'react'
import PropTypes from 'prop-types'

import { useStoreState } from '../../../store'

import { LocusMap } from '@eqworks/react-maps'
import { getCursor } from '@eqworks/react-maps/dist/utils'
import { makeStyles } from '@eqworks/lumen-labs'

import { cleanUp } from '../../../util/string-manipulation'
import modes from '../../../constants/modes'
import {
  COORD_KEYS,
  MAP_LAYERS,
  MAP_LAYER_VIS,
  MAP_LAYER_GEO_KEYS,
  VIS_OPTIONS,
  GEO_KEY_TYPES,
  OPACITY,
  PITCH,
  MAP_LEGEND_POSITION,
  MAP_LEGEND_SIZE,
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
  const mode = useStoreState(state => state.ui.mode)
  const MODE_DIMENSIONS = Object.freeze({
    [modes.EDITOR]: { marginTop: 0 },
    [modes.QL]: { marginTop: 0.75 },
    [modes.VIEW]: { marginTop: 0.75 },
  })

  const finalMarginTop = MODE_DIMENSIONS[mode].marginTop || 0

  const classes = useStyles({ width, height, marginTop: finalMarginTop })

  if (width > 0 && height > 0) {
    return (
      <div id='LocusMap' className={classes.mapWrapper}>
        <LocusMap { ...props } />
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
    const mapLayer = Object.keys(MAP_LAYER_VIS).find(layer => MAP_LAYER_GEO_KEYS[layer].includes(mapGroupKey))
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
        visualizations:  Object.fromEntries(MAP_LAYER_VIS[mapLayer].map(vis => {
          const keyTitle = mapValueKeys.find(({ mapVis }) => mapVis === vis)?.title
          return  [
            vis,
            {
              value: keyTitle ?
                { field: keyTitle } :
                //----TO DO - ERIKA - add the options below to state for editor
                VIS_OPTIONS[vis].value,
              valueOptions: VIS_OPTIONS[vis].valueOptions,
              dataScale: VIS_OPTIONS.scale,
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
        //----TO DO - ERIKA - add to state for editor
        opacity: OPACITY,
      }],
      mapConfig: {
        cursor: (layers) => getCursor({ layers }),
        legendPosition: MAP_LEGEND_POSITION[JSON.stringify(genericOptions.legendPosition)],
        legendSize: MAP_LEGEND_SIZE[genericOptions.legendSize],
        mapboxApiAccessToken: process.env.MAPBOX_ACCESS_TOKEN || process.env.STORYBOOK_MAPBOX_ACCESS_TOKEN, // <ignore scan-env>
        showMapLegend: uniqueOptions.showLegend,
        showMapTooltip: uniqueOptions.showTooltip,
        initViewState: {
          latitude: 44.41,
          longitude: -79.23,
          zoom: 7,
        },
        pitch: mapValueKeys.map(({ mapVis }) => mapVis).includes('elevation') ? PITCH.elevation : 0,
      },
    })
  },
}
