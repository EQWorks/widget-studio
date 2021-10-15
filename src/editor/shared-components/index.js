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
  controlled: PropTypes.bool,
  data: PropTypes.arrayOf(PropTypes.string),
  init: PropTypes.string,
  subData: PropTypes.arrayOf(PropTypes.string),
  subInit: PropTypes.string
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

WidgetControlCard.propTypes = {
  children: PropTypes.oneOfType([PropTypes.elementType, PropTypes.array]),
  title: PropTypes.string,
  titleExtra: PropTypes.elementType
}

export const PluralLinkedSelect = ({ titles, values, primaryKey, secondaryKey, data, subData, update }) => {

  const classes = useStyles()
  const remainingValues = useMemo(() => data.filter((name) => !(values.map(v => v[primaryKey]).includes(name))), [data, primaryKey, values])
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
        values.map((v, i) => {
          return (
            <LinkedSelect
              key={i}
              callback={([_k, _v]) => update(i, { [primaryKey]: _k, [secondaryKey]: _v })}
              data={remainingValues}
              init={v[primaryKey]}
              subData={subData}
              subInit={v[secondaryKey]}
            />
          )
        })
      }
      <LinkedSelect
        controlled={false}
        callback={([_k, _v]) => update(values.length, { [primaryKey]: _k, [secondaryKey]: _v })}
        data={remainingValues}
        init={''}
        subData={subData}
        subInit={''}
      />
    </>
  )
}

PluralLinkedSelect.propTypes = {
  data: PropTypes.arrayOf(PropTypes.string),
  subData: PropTypes.arrayOf(PropTypes.string),
  primaryKey: PropTypes.string,
  secondaryKey: PropTypes.string,
  titles: PropTypes.arrayOf(PropTypes.string),
  update: PropTypes.func,
  values: PropTypes.object
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

Toggle.propTypes = {
  disabled: PropTypes.bool,
  label: PropTypes.string,
  update: PropTypes.func,
  value: PropTypes.bool
}

export const Dropdown = ({ data, value, update }) =>
  <CustomSelect
    data={data}
    chosenValue={value || ''}
    setChosenValue={update}
  />

Dropdown.propTypes = {
  data: PropTypes.arrayOf(PropTypes.string),
  update: PropTypes.func,
  value: PropTypes.string
}

export const Slider = ({ min, max, value, update }) =>
  <MuiSlider
    valueLabelDisplay='auto'
    defaultValue={value || [min, max]}
    min={min}
    max={max}
    onChange={(event, val) => update(val)}
  />

Slider.propTypes = {
  max: PropTypes.number,
  min: PropTypes.number,
  update: PropTypes.func,
  value: PropTypes.arrayOf(PropTypes.number)
}

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

ToggleableCard.propTypes = {
  altTitle: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.elementType, PropTypes.array]),
  init: PropTypes.bool,
  title: PropTypes.string,
  update: PropTypes.func
}
