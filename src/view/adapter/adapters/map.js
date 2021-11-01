import React from 'react'
import PropTypes from 'prop-types'

import { useStoreState } from '../../../store'

import { LocusMap } from '@eqworks/react-maps'
import { getCursor } from '@eqworks/react-maps/dist/utils'
import { makeStyles } from '@material-ui/core/styles'
import modes from '../../../constants/modes'


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

  let finalMargin = '5px 0 0 0'
  if (mode === modes.EDITOR) {
    finalMargin = '5px'
  }
  if (mode === modes.QL) {
    finalMargin = '5px 5px 0 0'
  }
  let finalWidth = width
  if (mode === modes.EDITOR) {
    finalWidth = width - 10
  }
  if (mode === modes.QL) {
    finalWidth = width - 5
  }
  let finalHeight = height - 5
  if (mode === modes.EDITOR) {
    finalHeight = height - 10
  }

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
        radius: config?.valueKeys ?
          {
            value: {
              field: `${getKeyValues(config.valueKeys, 'radius')?.key}_${getKeyValues(config.valueKeys, 'radius')?.agg}`,
            },
            valueOptions: [5, 15],
            dataScale: 'linear',
          }:
          null,
        fill: getKeyValues(config?.valueKeys, 'fill')?.key ?
          {
            value: {
              field: `${getKeyValues(config.valueKeys, 'fill')?.key}_${getKeyValues(config.valueKeys, 'fill')?.agg}`,
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
