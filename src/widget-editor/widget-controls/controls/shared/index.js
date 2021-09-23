import React, { useState } from 'react'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormControl from '@material-ui/core/FormControl'
import Switch from '@material-ui/core/Switch'
import MuiSlider from '@material-ui/core/Slider'
import Divider from '@material-ui/core/Divider'
import { makeStyles } from '@material-ui/core/styles'
import { Typography } from '@eqworks/lumen-ui'

import styles from '../../styles'
import CustomSelect from './util/custom-select'
import LinkedSelect from './util/linked-select'
import WidgetControlCard from './util/control-card'
import aggOps from './util/agg-ops'
export { aggOps, CustomSelect, WidgetControlCard, LinkedSelect }

const useStyles = makeStyles(styles)

export const PluralLinkedSelect = ({ valuePairs, titles, data, subData, update }) => {

  const classes = useStyles()
  return (
    <>
      <div className={classes.controlRow}>
        <Typography
          className={classes.linkedSelectPrimary}
          color='textSecondary'
          variant='body1'
        >
          {titles[0]}
        </Typography>
        <Typography
          className={classes.linkedSelectSub}
          color='textSecondary'
          variant='body1'
        >
          {titles[1]}
        </Typography>
      </div>
      <Divider className={classes.controlDivider} />
      {
        valuePairs.map((obj, i) => {
          const [k, v] = Object.values(obj)
          return (
            <LinkedSelect
              key={k}
              update={(kv) => {
                const [k, v] = Object.entries(kv)[0]
                let keysCopy = [...valuePairs]
                keysCopy[i] = {
                  name: k,
                  agg: v
                }
                update(keysCopy)
              }}
              data={data}
              init={k}
              subData={subData}
              subInit={v}
            />
          )
        })
      }
      < LinkedSelect
        controlled={false}
        update={(kv) => {
          const [k, v] = Object.entries(kv)[0]
          update([...valuePairs, {
            name: k,
            agg: v
          }])
        }}
        data={data}
        init={''}
        subData={subData}
        subInit={''}
      />
    </>
  )
}

export const Toggle = ({ label, value, update }) =>
  <FormControl>
    <FormControlLabel
      control={
        <Switch
          checked={value}
          onChange={event => update(event.target.checked)}
          color="primary"
        />
      }
      label={label}
    />
  </FormControl>

export const Dropdown = ({ data, value, update }) =>
  <CustomSelect
    data={data}
    chosenValue={value || ''}
    setChosenValue={update}
  />

export const Slider = ({ min, max, value, update }) =>
  <MuiSlider
    valueLabelDisplay='auto'
    defaultValue={value || [min, max]}
    min={min}
    max={max}
    onChange={(event, val) => update(val)}
  />



export const ToggleableCard = ({ init, update, title, children }) => {
  const [toggle, setToggle] = useState(init)
  const classes = useStyles()
  return (
    <>
      <WidgetControlCard>
        <div className={classes.controlRow}>
          <Typography
            className={classes.controlCardHeader}
            color='textSecondary'
            variant='subtitle1'
          >
            {title}
          </Typography>
          <Toggle
            value={toggle}
            update={(val) => {
              update(val)
              setToggle(val)
            }}
          />
        </div>
        {
          toggle &&
          children
        }
      </WidgetControlCard>
    </>
  )
}
