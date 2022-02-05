import React from 'react'
import PropTypes from 'prop-types'

import { Icons, Chip, makeStyles } from '@eqworks/lumen-labs'

import PluralLinkedSelect from '../../../components/plural-linked-select'


const classes = makeStyles({
  keyControl1 : { marginTop: '15px' },
  linkedSelect : { marginTop: '5px' },
})

const [PRIMARY_KEY, SECONDARY_KEY] = ['key', 'agg']

const MapLinkedSelect = ({
  categories,
  values,
  titles,
  data,
  subData,
  disableSubs,
  disableSubMessage,
  callback,
}) => {
  return (
    categories.map((mapVis, i) => {
      const match = values.findIndex(v => v.mapVis === mapVis)
      return (
        <div key={i} className={i === 0 ? '' : classes.keyControl1} >
          <Chip color={i === 0 ? 'primary' : 'success'}>
            {mapVis}
          </Chip>
          <PluralLinkedSelect
            staticQuantity={1}
            headerIcons={[Icons.Sum, Icons.Columns]}
            titles={titles}
            values={values[match] ? [values[match]] : []}
            callback={(_, v) => callback(
              match,
              {
                mapVis,
                [PRIMARY_KEY]: v[PRIMARY_KEY],
                [SECONDARY_KEY]: v[SECONDARY_KEY],
              }
            )}
            data={data.filter(d => values[match]?.key === d || !(values.map(v => v.key).includes(d)))}
            subData={subData}
            primaryKey={PRIMARY_KEY}
            secondaryKey={SECONDARY_KEY}
            disableSubs={disableSubs}
            disableSubMessage={disableSubMessage}
          />
        </div>
      )
    })
  )
}

export default MapLinkedSelect

MapLinkedSelect.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.string).isRequired,
  data: PropTypes.arrayOf(PropTypes.string).isRequired,
  titles: PropTypes.arrayOf(PropTypes.string),
  subData: PropTypes.arrayOf(PropTypes.string).isRequired,
  callback: PropTypes.func.isRequired,
  values: PropTypes.arrayOf(PropTypes.object).isRequired,
  disableSubs: PropTypes.bool,
  disableSubMessage: PropTypes.string,
}

MapLinkedSelect.defaultProps = {
  titles: [],
  disableSubs: false,
  disableSubMessage: '',
}
