import React from 'react'
import PropTypes from 'prop-types'

import { useStoreState } from '../../../store'

import { LocusMap } from '@eqworks/react-maps'
import { getCursor } from '@eqworks/react-maps/dist/utils'
import { makeStyles } from '@material-ui/core/styles'
import modes from '../../../constants/modes'
import { mapVis } from '../../../constants/map'


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
  props: PropTypes.object.isRequired,
}

const getKeyValues = (objArray, key) => objArray.filter(o => o.map_vis === key)[0]

export default {
  component: Map,
  adapt: (data, { options, ...config }) => ({
    // create a good id
    dataConfig: [{ id: 'testWIReport', data }],
    layerConfig: [{
      layer: 'scatterplot',
      dataId: 'testWIReport',
      geometry: { longitude: 'lon', latitude: 'lat' },
      visualizations: {
        [mapVis.RADIUS]: config?.valueKeys ?
          {
            value: {
              field: `${getKeyValues(config.valueKeys, mapVis.RADIUS)?.key}_${getKeyValues(config.valueKeys, mapVis.RADIUS)?.agg}`,
            },
            valueOptions: [5, 15],
            dataScale: 'linear',
          }:
          null,
        [mapVis.FILL]: getKeyValues(config?.valueKeys, mapVis.FILL)?.key ?
          {
            value: {
              field: `${getKeyValues(config.valueKeys, mapVis.FILL)?.key}_${getKeyValues(config.valueKeys, mapVis.FILL)?.agg}`,
            },
            valueOptions: [[214, 232, 253], [39, 85, 196]],
            dataScale: 'linear',
          }:
          null,
      },
      interactions: {
        tooltip: {
          tooltipKeys: {
            name: 'poi_name',
          },
        },
      },
      legend: { showLegend: true },
      opacity: 0.3,
    }],
    mapConfig: {
      cursor: (layers) => getCursor({ layers }),
      legendPosition: 'top-right',
      legendSize: 'widget',
      mapboxApiAccessToken: process.env.MAPBOX_ACCESS_TOKEN || process.env.STORYBOOK_MAPBOX_ACCESS_TOKEN, // <ignore scan-env>
      showMapLegend: options.showLegend,
      showMapTooltip: options.showTooltip,
    },
  }),
}
