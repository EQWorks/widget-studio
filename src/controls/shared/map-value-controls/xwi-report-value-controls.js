// specific value control component for xwi report data
import React, { useMemo } from 'react'
import PropTypes from 'prop-types'

import { Icons, makeStyles, getTailwindConfigColor } from '@eqworks/lumen-labs'

import MutedBarrier from '../muted-barrier'
import MapValueSelect from './map-value-select'
import CustomButton from '../../../components/custom-button'
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
        buttonLabel: 'mapHideSourceLayer',
        buttonState: genericOptions.mapHideSourceLayer,
      },
      {
        categories: MAP_LAYER_VALUE_VIS.targetScatterplot,
        header: 'Target Layer',
        buttonLabel: 'mapHideTargetLayer',
        buttonState: genericOptions.mapHideTargetLayer,
      },
      {
        categories: MAP_LAYER_VALUE_VIS.arc,
        header: 'Arc Layer',
        buttonLabel: 'mapHideArcLayer',
        buttonState: genericOptions.mapHideArcLayer,
      },
    ]
  ),[genericOptions.mapHideSourceLayer, genericOptions.mapHideTargetLayer, genericOptions.mapHideArcLayer])

  return (
    XWI_MAP_LAYERS.map(({ categories, header, buttonState, buttonLabel }, i) => {
      return (
        <div key={i} className={classes.layerValueControls}>
          <div className={classes.layer}>
            <div className={classes.layerHeader}>
              {header}
            </div>
            <CustomButton
              onClick={() => {
                userUpdate({ genericOptions: { [buttonLabel]: !buttonState } })
              }}>
              {!buttonState && <Icons.EyeOpen size='md' />}
              {buttonState && <Icons.EyeClosed size='md' />}
            </CustomButton>
          </div>
          <MutedBarrier
            mute={buttonState}
          >
            <MapValueSelect
              categories={categories}
              values={mapValueKeys}
              {...{ data, callback }}
            />
          </MutedBarrier>
        </div>
      )
    })
  )
}

XWIReportValueControls.propTypes = {
  data: PropTypes.arrayOf(PropTypes.string).isRequired,
  callback: PropTypes.func.isRequired,
}

export default XWIReportValueControls
