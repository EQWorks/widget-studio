import React, { useMemo } from 'react'
import PropTypes from 'prop-types'

import { Chip, makeStyles } from '@eqworks/lumen-labs'

import LinkedSelect from '../../../components/linked-select'
import { getLongest } from '../../../util'


const classes = makeStyles({
  keyControl1 : { marginTop: '15px' },
  linkedSelect : { marginTop: '5px' },
})

const MapLinkedSelect = ({
  categories,
  values,
  titles,
  data,
  subData,
  disableSubFor,
  disableSubMessage,
  callback,
  deleteCallback,
}) => {
  const remainingValues = useMemo(() => data.filter((name) =>
    !(values.map(v => v.key).includes(name))), [data, values])

  return (
    categories.map((mapVis, i) => {
      const match = values.findIndex(v => v.mapVis === mapVis)
      return (
        <div key={i} className={i === 0 ? '' : classes.keyControl1} >
          <div className='invisible h-0 grid grid-cols-min-min pointer-events-none'>
            <LinkedSelect
              data={[]}
              subData={[]}
              deletable
              callback={() => {}}
              placeholders={[getLongest([titles[0], ...data]), getLongest([titles[1], ...subData])]}
            />
          </div>
          <Chip color={i === 0 ? 'primary' : 'success'}>
            {mapVis.toUpperCase()}
          </Chip>
          <div className='grid grid-cols-min-1fr'>
            <LinkedSelect
              key={mapVis}
              className={classes.linkedSelect}
              callback={([_k, _v]) => callback(match, { key: _k, agg: _v, mapVis })}
              data={remainingValues}
              subData={subData}
              deletable={false}
              clearable
              deleteCallback={() => deleteCallback(match)}
              init={values[match]?.key}
              subInit={values[match]?.agg}
              placeholders={titles}
              disableSub={disableSubFor.includes(values[match]?.key)}
              disableSubMessage={`${values[match]?.key} ${disableSubMessage}`}
            />
          </div>
        </div>
      )
    })
  )
}

export default MapLinkedSelect

MapLinkedSelect.propTypes = {
  data: PropTypes.arrayOf(PropTypes.string).isRequired,
  subData: PropTypes.arrayOf(PropTypes.string).isRequired,
  callback: PropTypes.func.isRequired,
  values: PropTypes.arrayOf(PropTypes.object).isRequired,
}
