import React, { useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormControl from '@material-ui/core/FormControl'
import Switch from '@material-ui/core/Switch'
import MuiSlider from '@material-ui/core/Slider'
import Divider from '@material-ui/core/Divider'
import { makeStyles } from '@material-ui/core/styles'
import { Typography } from '@eqworks/lumen-ui'
import CustomSelect from './custom-select'

import styles from '../styles'
const useStyles = makeStyles(styles)

export const LinkedSelect = ({ callback, data, init, subData, subInit, controlled }) => {

  const classes = useStyles()

  const [choice, setChoice] = useState(init)
  const [subChoice, setSubChoice] = useState(subInit)
  const subDisabled = useMemo(() => !choice || !subData.length, [choice, subData.length])

  useEffect(() => {
    if (choice && (subChoice || subDisabled)) {
      // update({ [choice]: subChoice })
      callback([choice, subChoice])
      if (!controlled) {
        setChoice(init)
        setSubChoice(subInit)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [choice, controlled, init, subChoice, subInit])

  return (
    <div className={classes.controlRow}>
      <div className={classes.linkedSelectPrimary} >
        <CustomSelect
          data={data}
          chosenValue={choice}
          setChosenValue={setChoice}
        />
      </div>
      <div className={classes.linkedSelectSub}>
        <CustomSelect
          data={subData}
          chosenValue={subChoice}
          setChosenValue={setSubChoice}
          disabled={subDisabled}
        />
      </div>
    </div>
  )
}
LinkedSelect.propTypes = {
  callback: PropTypes.func,
  data: PropTypes.array,
  init: PropTypes.string,
  subData: PropTypes.array,
  subInit: PropTypes.string,
  controlled: PropTypes.bool,
}

LinkedSelect.defaultProps = {
  controlled: true
}

export const WidgetControlCard = ({ title, titleExtra, children }) => {

  const classes = useStyles()
  return (
    <div className={classes.controlCard}>
      <div className={classes.controlRow}>
        {
          title &&
          <Typography
            className={classes.controlCardHeader}
            color='textSecondary'
            variant='subtitle1'
          >
            {title}
          </Typography>
        }
        {titleExtra}
      </div>
      {children}
    </ div>
  )
}

export const PluralSelect = ({ values, data, update }) => {

  const dataRemaining = useMemo(() => data.filter((name) => !(name in values)), [data, values])
  return (
    <>
      {
        Object.keys(values).map(k => {
          return (
            <CustomSelect
              key={k}
              data={dataRemaining}
              chosenValue={k}
              setChosenValue={update}
            />
          )
        })
      }
      {
        dataRemaining.length ?
          <CustomSelect
            data={dataRemaining}
            chosenValue={''}
            setChosenValue={update}
          />
          :
          null
      }
    </>
  )
}

export const PluralLinkedSelect = ({ titles, values, subKey, data, subData, update }) => {

  const classes = useStyles()
  const remainingValues = useMemo(() => data.filter((name) => !(name in values)), [data, values])
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
        Object.entries(values).map(([k, v]) => {
          return (
            <LinkedSelect
              key={k}
              callback={([, _v]) => update({ [k]: { [subKey]: _v } })}
              data={remainingValues}
              init={k}
              subData={subData}
              subInit={v[subKey]}
            />
          )
        })
      }
      < LinkedSelect
        controlled={false}
        callback={([_k, _v]) => update({ [_k]: { [subKey]: _v } })}
        data={remainingValues}
        init={''}
        subData={subData}
        subInit={''}
      />
    </>
  )
}

export const Toggle = ({ label, value, update, disabled }) =>
  <FormControl>
    <FormControlLabel
      control={
        <Switch
          checked={value}
          onChange={event => update(event.target.checked)}
          color="primary"
          disabled={disabled ?? false}
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



export const ToggleableCard = ({ init, update, title, altTitle, children }) => {
  const [toggle, setToggle] = useState(init)
  return (
    <>
      <WidgetControlCard
        title={toggle ? title : altTitle ?? title}
        titleExtra={
          <Toggle
            value={toggle}
            update={(val) => {
              update(val)
              setToggle(val)
            }}
          />
        }
      >
        {
          Array.isArray(children) ?
            (
              toggle ?
                children[0]
                :
                children.slice(1)

            )
            :
            (
              toggle &&
              children
            )

        }
      </WidgetControlCard>
    </>
  )
}
