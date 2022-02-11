import React from 'react'
import PropTypes from 'prop-types'

import { Tooltip, Icons, getTailwindConfigColor, makeStyles } from '@eqworks/lumen-labs'

import PluralLinkedSelect from '../../../components/plural-linked-select'
import { VIS_OPTIONS } from '../../../constants/map'


const classes = makeStyles({
  linkedSelect:{
    marginBottom: '0.125rem',
  },
  visTitleWrapper: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '0.75rem',
    marginTop: '0.625rem',
    gap: '0.406rem',
  },
  visTitle: {
    height: '1rem',
    fontWeight: 700,
    fontSize: '0.75rem',
    color: getTailwindConfigColor('secondary-800'),
  },
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
        <div key={i} className={classes.linkedSelect} >
          <div className={classes.visTitleWrapper}>
            <div className={classes.visTitle}>
              {`${VIS_OPTIONS[mapVis].label}:`}
            </div>
            <s>
              <Tooltip
                description={VIS_OPTIONS[mapVis].info}
                width='13rem'
                arrow={false}
                position='right'
              >
                <Icons.AlertInformation
                  size='sm'
                  color={getTailwindConfigColor('secondary-500')}
                />
              </Tooltip>
            </s>
          </div>
          <PluralLinkedSelect
            staticQuantity={1}
            headerIcons={[
              Icons.Columns,
              Icons.Sum,
            ]}
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
