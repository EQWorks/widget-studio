import React from 'react'
import PropTypes from 'prop-types'

import { Tooltip, Icons, getTailwindConfigColor, makeStyles } from '@eqworks/lumen-labs'

import CustomSelect from '../../../components/custom-select'
import PluralLinkedSelect from '../../../components/plural-linked-select'
import types from '../../../constants/type-info'
import { MAP_LAYER_VALUE_VIS } from '../../../constants/map'
import { useStoreState, useStoreActions } from '../../../store'


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
  titles,
  data,
  subData,
  disableSubs,
  disableSubMessage,
  callback,
}) => {
  // common actions
  const userUpdate = useStoreActions((actions) => actions.userUpdate)

  // common state
  const columnsAnalysis = useStoreState((state) => state.columnsAnalysis)
  const mapValueKeys = useStoreState((state) => state.mapValueKeys)
  const dataIsXWIReport = useStoreState((state) => state.dataIsXWIReport)
  const mapLayer = useStoreState((state) => state.mapLayer)

  return (
    categories.map((mapVis, i) => {
      const match = mapValueKeys.findIndex(v => v.mapVis === mapVis)
      let currentLayer = mapLayer
      if (dataIsXWIReport) {
        currentLayer = Object.keys(MAP_LAYER_VALUE_VIS).find(layer => MAP_LAYER_VALUE_VIS[layer].includes(mapVis))
      }
      const _data = data.filter(d => mapValueKeys[match]?.[PRIMARY_KEY] === d ||
        !(dataIsXWIReport && mapValueKeys.filter(v => MAP_LAYER_VALUE_VIS[currentLayer]
          .includes(v.mapVis)).map(v => v.key).includes(d)) ||
        !(mapValueKeys.map(v => v.key).includes(d)))
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
                data={_data}
                icons={icons}
                value={mapValueKeys[match] ? mapValueKeys[match]?.[PRIMARY_KEY] : ''}
                onSelect={val => callback(
                  match,
                  {
                    mapVis,
                    [PRIMARY_KEY]: val,
                  }
                )}
                onClear={() => {
                  const valueKeysCopy = JSON.parse(JSON.stringify(mapValueKeys))
                  valueKeysCopy.splice(match, 1)
                  userUpdate({ mapValueKeys: valueKeysCopy })
                }}
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
                values={mapValueKeys[match] ? [mapValueKeys[match]] : []}
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
}

MapValueSelect.defaultProps = {
  titles: [],
  disableSubs: false,
  disableSubMessage: '',
}
