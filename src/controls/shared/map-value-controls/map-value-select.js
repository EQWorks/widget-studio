import React from 'react'
import PropTypes from 'prop-types'

import { Tooltip, Icons, getTailwindConfigColor, makeStyles } from '@eqworks/lumen-labs'

import CustomSelect from '../../../components/custom-select'
import PluralLinkedSelect from '../../../components/plural-linked-select'
import types from '../../../constants/type-info'
import { useStoreState } from '../../../store'


const classes = makeStyles({
  linkedSelect:{
    marginBottom: '0.125rem',
  },
  visTitleWrapper: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '0.25rem',
    marginTop: '0.625rem',
    gap: '0.406rem',
  },
  visTitle: {
    height: '1rem',
    fontWeight: 700,
    fontSize: '0.75rem',
    color: getTailwindConfigColor('secondary-800'),
    overflowY: 'visible',
  },
})

const [PRIMARY_KEY, SECONDARY_KEY] = ['key', 'agg']

const MapValueSelect = ({
  categories,
  values,
  titles,
  data,
  subData,
  disableSubs,
  disableSubMessage,
  callback,
  isTargetLayer,
}) => {
  const columnsAnalysis = useStoreState((state) => state.columnsAnalysis)
  const dataIsXWIReport = useStoreState((state) => state.dataIsXWIReport)
  return (
    categories.map((mapVis, i) => {
      const match = values.findIndex(v => v.mapVis === mapVis)
      const _data = data.filter(d => values[match]?.key === d || !(values.map(v => v.key).includes(d)))
      const icons = _data.map(c => columnsAnalysis[c]?.Icon)
      return (
        <div key={i} className={classes.linkedSelect} >
          <div className={classes.visTitleWrapper}>
            <div className={classes.visTitle}>
              {`${types.map.uniqueOptions[mapVis].valueConfigName}:`}
            </div>
            <s>
              <Tooltip
                description={
                  types.map.uniqueOptions[mapVis].info[dataIsXWIReport ? 'xwiReport' : 'standard']
                }
                width={dataIsXWIReport ? '9.316rem' : '11.5rem'}
                arrow={false}
                position='right'
                classes={{ content: 'overflow-y-visible' }}
              >
                <Icons.AlertInformation
                  size='sm'
                  color={getTailwindConfigColor('secondary-500')}
                />
              </Tooltip>
            </s>
          </div>
          {dataIsXWIReport ?
            (
              <CustomSelect
                fullWidth
                // multiSelect
                data={_data}
                icons={icons}
                value={values[match] ? values[match].key : ''}
                // onSelect={val => {
                //   // update groupKey with mapGroupKey value to have it available if we switch to a chart widget type
                //   userUpdate({ mapGroupKey: val, groupKey: val })
                //   const newLayer = Object.keys(MAP_LAYER_VALUE_VIS)
                //     .find(layer => MAP_LAYER_GEO_KEYS[layer].includes(val))
                //   /*
                //   * reset mapValueKeys when we change to a mapGroupKey that requires a different layer,
                //   * as different layer requires different visualization types
                //   */
                //   if (newLayer !== mapLayer) {
                //     update({ mapValueKeys: [] })
                //   }
                // }}
                // onClear={() => userUpdate({
                //   groupKey: null,
                //   indexKey: null,
                //   mapGroupKey: null,
                //   mapValueKeys: [],
                // })}
                placeholder={'Column'}
              />
            ) :
            (
              <PluralLinkedSelect
                staticQuantity={1}
                headerIcons={[
                  Icons.Columns,
                  Icons.Sum,
                ]}
                titles={titles}
                values={values[match] ? [values[match]] : []}
                valueIcons={icons}
                callback={(_, v) => callback(
                  match,
                  {
                    mapVis,
                    [PRIMARY_KEY]: v[PRIMARY_KEY],
                    [SECONDARY_KEY]: v[SECONDARY_KEY],
                  }
                )}
                data={_data}
                subData={subData}
                primaryKey={PRIMARY_KEY}
                secondaryKey={SECONDARY_KEY}
                disableSubs={disableSubs}
                disableSubMessage={disableSubMessage}
              />
            )
          }
        </div>
      )
    })
  )
}

export default MapValueSelect

MapValueSelect.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.string).isRequired,
  data: PropTypes.arrayOf(PropTypes.string).isRequired,
  titles: PropTypes.arrayOf(PropTypes.string),
  subData: PropTypes.arrayOf(PropTypes.string).isRequired,
  callback: PropTypes.func.isRequired,
  values: PropTypes.arrayOf(PropTypes.object).isRequired,
  disableSubs: PropTypes.bool,
  disableSubMessage: PropTypes.string,
  isTargetLayer: PropTypes.bool,
}

MapValueSelect.defaultProps = {
  titles: [],
  disableSubs: false,
  disableSubMessage: '',
  isTargetLayer: false,
}
