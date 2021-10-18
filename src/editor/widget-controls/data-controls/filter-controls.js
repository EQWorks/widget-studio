import React, { useCallback, useMemo, useState } from 'react'

import { makeStyles } from '@material-ui/core/styles'
import AddIcon from '@material-ui/icons/Add'
import IconButton from '@material-ui/core/IconButton'
import { Typography } from '@eqworks/lumen-ui'

import { useStoreState, useStoreActions } from '../../../store'
import ToggleableCard from '../../shared-components/toggleable-card'
import CustomSelect from '../../shared-components/custom-select'
import CustomSlider from '../../shared-components/custom-slider'
import WidgetControlCard from '../../shared-components/widget-control-card'

import styles from '../../styles'


const useStyles = makeStyles(styles)

const FilterControls = () => {
  const classes = useStyles()

  const [addingFilter, setAddingFilter] = useState(false)
  const [disabledFilters, setDisabledFilters] = useState({})

  const filters = useStoreState((state) => state.filters)
  const rows = useStoreState((state) => state.rows)
  const columns = useStoreState((state) => state.columns)

  const update = useStoreActions(actions => actions.update)
  const nestedUpdate = useStoreActions(actions => actions.nestedUpdate)

  const numericColumns = useMemo(() => (
    columns.filter(({ category }) => category === 'Numeric')
  ), [columns])

  const min = useCallback((key) => Math.min.apply(null, rows.map(r => r[key])), [rows])
  const max = useCallback((key) => Math.max.apply(null, rows.map(r => r[key])), [rows])


  const card = (key, range, enabled) => {
    return <ToggleableCard key={key}
      init={enabled}
      title={key}
      callback={(val) => {
        if (!val) {
          const { [key]: _range, ...remainingFilters } = filters
          update({ filters: remainingFilters })
          setDisabledFilters({ ...{ [key]: _range }, ...disabledFilters })
        } else {
          const { [key]: _range, ...remainingFilters } = disabledFilters
          nestedUpdate({ filters: { [key]: _range } })
          setDisabledFilters(remainingFilters)
        }
      }}
    >
      <div className={classes.controlRow}>
        <div style={{ marginRight: '1rem' }}>
          <Typography color="textSecondary" variant='subtitle2'>
            {`${range[0]}-${range[1]}`}
          </Typography>
        </div>
        <CustomSlider
          min={min(key)}
          max={max(key)}
          value={range}
          callback={val => nestedUpdate({ filters: { [key]: val } })}
        />
      </div>
    </ToggleableCard >
  }

  return (
    <div className={classes.filterControls}>
      {Object.entries(filters).map(([key, range]) => card(key, range, true))}
      {Object.entries(disabledFilters).map(([key, range]) => card(key, range, false))}
      <WidgetControlCard>
        {
          addingFilter ?
            <CustomSelect
              data={numericColumns.filter(col => !Object.keys(filters).includes(col))}
              setChosenValue={val => {
                nestedUpdate({ filters: { [val]: [min(val), max(val)] } })
                setAddingFilter(false)
              }}
            />
            :
            <div className={classes.filterControlCell} >
              <IconButton onClick={() => setAddingFilter(true)} >
                <AddIcon
                  color='secondary'
                  fontSize='large'
                />
              </IconButton>
            </div >
        }
      </WidgetControlCard>
    </div>
  )
}

export default FilterControls
