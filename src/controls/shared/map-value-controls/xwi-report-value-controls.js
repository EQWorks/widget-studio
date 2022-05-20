// specific value control component for xwi report data
import React, { useMemo } from 'react'
import PropTypes from 'prop-types'

import { makeStyles, getTailwindConfigColor } from '@eqworks/lumen-labs'

import MutedBarrier from '../muted-barrier'
import MapValueSelect from './map-value-select'
import CustomToggle from '../../../components/custom-toggle'
import { useStoreActions, useStoreState } from '../../../store'
import { MAP_LAYER_VALUE_VIS } from '../../../constants/map'


const classes = makeStyles({
  layerValueControls: {
    marginBottom: '1rem',
  },
  layer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  layerHeader: {
    fontWeight: 700,
    color: getTailwindConfigColor('secondary-800'),
  },
})

const XWIReportValueControls = ({ data, callback }) => {
  // store actions
  const userUpdate = useStoreActions((actions) => actions.update)

  // widget state
  const mapValueKeys = useStoreState((state) => state.mapValueKeys)
  const genericOptions = useStoreState((state) => state.genericOptions)

  const XWI_MAP_LAYERS = useMemo(() => (
    [
      {
        categories: MAP_LAYER_VALUE_VIS.scatterplot,
        header: 'Source Layer',
        switchLabel: 'mapHideSourceLayer',
        switchState: genericOptions.mapHideSourceLayer,
      },
      {
        categories: MAP_LAYER_VALUE_VIS.targetScatterplot,
        header: 'Target Layer',
        switchLabel: 'mapHideTargetLayer',
        switchState: genericOptions.mapHideTargetLayer,
      },
      {
        categories: MAP_LAYER_VALUE_VIS.arc,
        header: 'Arc Layer',
        switchLabel: 'mapHideArcLayer',
        switchState: genericOptions.mapHideArcLayer,
      },
    ]
  ),[genericOptions.mapHideSourceLayer, genericOptions.mapHideTargetLayer, genericOptions.mapHideArcLayer])

  return (
    XWI_MAP_LAYERS.map(({ categories, header, switchLabel, switchState }, i) => (
      <div key={i} className={classes.layerValueControls}>
        <div className={classes.layer}>
          <div className={classes.layerHeader}>
            {header}
          </div>
          <CustomToggle
            disabled={false}
            value={switchState}
            label='Hide'
            onChange={() => {
              userUpdate({ genericOptions: { [switchLabel]: !switchState } })
            }}
          />
        </div>
        <MutedBarrier
          mute={switchState}
        >
          <MapValueSelect
            categories={categories}
            values={mapValueKeys}
            {...{ data, callback }}
          />
        </MutedBarrier>
      </div>
    ))
  )
}

XWIReportValueControls.propTypes = {
  data: PropTypes.arrayOf(PropTypes.string).isRequired,
  callback: PropTypes.func.isRequired,
}

export default XWIReportValueControls
