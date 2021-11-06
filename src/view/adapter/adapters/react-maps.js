import React from 'react'
import PropTypes from 'prop-types'

import { useStoreState } from '../../../store'

import { LocusMap } from '@eqworks/react-maps'
import { getCursor } from '@eqworks/react-maps/dist/utils'
import { makeStyles } from '@material-ui/core/styles'
import modes from '../../../constants/modes'
import {
  COORD_KEYS,
  MAP_LAYERS,
  MAP_LAYER_VIS,
  MAP_LAYER_GEO_KEYS,
  VIS_OPTIONS,
  OPACITY,
} from '../../../constants/map'


const useStyles = makeStyles({
  mapWrapper: (props) => ({
    position: 'absolute',
    width: props.width,
    height: props.height,
    margin: props.margin,
  }),
})

const Map = ({ width, height, ...props }) => {
  const mode = useStoreState(state => state.ui.mode)
  const MODE_DIMENSIONS = Object.freeze({
    [modes.EDITOR]: { margin: '5px', width: width - 10, height: height - 10 },
    [modes.QL]: { margin: '5px 5px 0 0', width: width - 5, height: height - 5 },
    [modes.VIEW]: { margin: '5px 0 0 0', width: width, height: height - 5 },
  })

  const finalMargin = MODE_DIMENSIONS[mode].margin || 0
  const finalWidth = MODE_DIMENSIONS[mode].width || width
  const finalHeight = MODE_DIMENSIONS[mode].height || height

  const classes = useStyles({ width: finalWidth, height: finalHeight, margin: finalMargin })

  return (
    <div className={classes.mapWrapper}>
      <LocusMap { ...props } />
    </div>
  )
}

Map.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  props: PropTypes.object,
}

Map.defaultProps = {
  props: {},
}

export default {
  component: Map,
  adapt: (data, { options, ...config }) => {
    const { mapGroupKey, mapValueKeys } = config
    const mapLayer = Object.keys(MAP_LAYER_VIS).filter(layer => MAP_LAYER_GEO_KEYS[layer].includes(mapGroupKey))[0]
    //----TO DO - extend geometry logic for other layers if necessary
    const dataKeys = Object.keys(data[0])

    const getTooltipKey = (tooltipKey) =>
      dataKeys.filter(key => MAP_LAYER_GEO_KEYS[mapLayer].includes(key) && key.includes(tooltipKey))[0]

    const name = getTooltipKey('name')
    const id = getTooltipKey('id')

    let geometry = {}
    if (mapLayer === MAP_LAYERS.scatterplot) {
      const latitude = dataKeys.filter(key => COORD_KEYS.latitude.includes(key))[0]
      const longitude = dataKeys.filter(key => COORD_KEYS.longitude.includes(key))[0]
      geometry = { longitude, latitude }
    }

    return ({
      // create a good id
      dataConfig: [{ id: 'testWIReport', data }],
      layerConfig: [{
        layer: mapLayer,
        dataId: 'testWIReport',
        geometry,
        visualizations: Object.fromEntries(mapValueKeys.map(({ key, agg, mapVis }) => [
          mapVis,
          {
            value: {
              field: `${key}_${agg}`,
            },
            valueOptions: VIS_OPTIONS.values[mapVis],
            dataScale: VIS_OPTIONS.scale,
          },
        ])),
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
        legendPosition: 'top-right',
        legendSize: 'widget',
        mapboxApiAccessToken: process.env.MAPBOX_ACCESS_TOKEN || process.env.STORYBOOK_MAPBOX_ACCESS_TOKEN, // <ignore scan-env>
        showMapLegend: options.showLegend,
        showMapTooltip: options.showTooltip,
      },
    })
  },
}
