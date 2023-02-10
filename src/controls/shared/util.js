import React from 'react'

import { getTailwindConfigColor, makeStyles, Checkbox, RadioGroup, Radio } from '@eqworks/lumen-labs'

import CustomToggle from '../../components/custom-toggle'
import CustomSelect from '../../components/custom-select'


const classes = makeStyles({
  superSection: {
    '> *': {
      marginBottom: '1.2rem',
    },
    '> :last-child': {
      marginBottom: '0px !important',
    },
    width: '100%',
  },
  section: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    '> *': {
      marginBottom: '0.7rem',
    },
    '> :last-child': {
      marginBottom: '0px !important',
    },
  },
  sectionTitle: {
    color: getTailwindConfigColor('secondary-800'),
    fontWeight: 700,
    fontSize: '0.8rem',
    marginBottom: '0.4rem',
  },
  row: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: '0.625rem',
  },
  tightRow: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    '> *': {
      flex: 'auto !important',
    },
    justifyContent: 'space-between',
  },
  rowContainer: {
    width: '100%',
  },
  inlineItemContainer: {
    display: 'flex',
    flex: 1,
    alignItems: 'center',
  },
  itemContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',

    '& .radio-group__root-contaienr': {
      '& .radio__root-container': {
        width: '100%',
        marginRight: '0.75rem',

        '&:last-child': {
          marginRight: 0,
        },
      },
    },
  },
  itemContainerNoGrow: {
    flex: 0,
    minWidth: '33%',
    display: 'flex',
    flexDirection: 'column',
  },
  inlineItem: {
  },
  item: {
    display: 'flex',
  },
  inlineTitle: {
    color: getTailwindConfigColor('secondary-600'),
    fontSize: '0.786rem',
    marginLeft: '0.4rem',
    display: 'flex',
    alignItems: 'center',
  },
  title: {
    color: getTailwindConfigColor('secondary-600'),
    fontSize: '0.786rem',
    marginBottom: '0.2rem',
    display: 'flex',
    alignItems: 'center',
  },
  titleContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: '0.406rem',
  },
  flex1: {
    flex: 1,
  },
  flex0: {
    flex: 0,
  },
})

const customRadioClasses = makeStyles({
  container: {
    width: '100%',
    marginRight: '0.75rem',

    '&:last': {
      marginRight: 0,
    },
  },
})

export const renderSuperSection = (Component) => (
  Component &&
  <div className={`render-super-section__container ${classes.superSection}`}>
    {Component}
  </div>
)

export const renderSection = (title, Component) => (
  Component &&
  <div className={`render-section__container ${classes.section}`}>
    {title && <div className={classes.sectionTitle}> {`${title}:`} </div>}
    {Component}
  </div>
)

export const renderRow = (title, Component, titleExtra, tight = false) => (
  Component &&
  <div className={classes.rowContainer}>
    {(title || titleExtra) &&
      <div className={classes.title}>
        <span className={classes.flex1}> {title && `${title}:`} </span>
        {titleExtra && titleExtra}
      </div>
    }
    <div className={tight ? classes.tightRow : classes.row}>
      {Component}
    </div>
  </div>
)

export const renderItem = (title, Component, titleExtra, grow = true) => (
  Component &&
  <div className={grow ? classes.itemContainer : classes.itemContainerNoGrow}>
    <div className={classes.title}>
      <span className={classes.flex1}> {title && `${title}:`} </span>
      {titleExtra && titleExtra}
    </div>
    <div className={classes.item}>
      {Component}
    </div>
  </div>
)

export const renderCheckbox = (title, value, update, disabled = false, key) => (
  <div
    {...(key && { key })}
    className={classes.inlineItemContainer}
  >
    <div className={classes.inlineItem}>
      <Checkbox
        label=''
        checked={value}
        onChange={({ checked }) => update(checked)}
        disabled={disabled}
      /></div>
    {title && <div className={classes.inlineTitle} > {`${title}`} </div>}
  </div>
)

export const renderToggle = (title, value, update, disabled = false, tooltip) => (
  <div className={`toggle__root-container ${classes.itemContainer}`}>
    <div className={classes.titleContainer}>
      <div className={classes.title} > {title && `${title}:`} </div>
      {tooltip}
    </div>
    <CustomToggle
      value={value}
      onChange={update}
      disabled={disabled}
    />
  </div>
)

export const renderMultiSelect = (title, data, value, update, disabled = false) => (
  <div className={`${classes.itemContainer} multi-select__root-container`}>
    <div className={classes.titleContainer}>
      <div className={classes.title} > {title && `${title}:`} </div>
    </div>
    <CustomSelect
      fullWidth
      multiSelect
      data={data}
      value={value}
      onSelect={update}
      disabled={disabled}
    />
  </div>
)

export const renderRadioSelect = (title, data, value, update, disabled = false) => (
  <div className={`${classes.itemContainer} radio-select__root-container`}>
    <div className={classes.titleContainer}>
      <div className={classes.title} > {title && `${title}:`} </div>
    </div>
    <RadioGroup name={title} selected={value} align='horizontal'>
      {data.map((type, index) =>
        <Radio
          key={`radio-item-${index}`}
          classes={{
            container: customRadioClasses.container,
          }}
          label={type}
          value={type}
          handleChange={update}
          disabled={disabled}
        />
      )}
    </RadioGroup>
  </div>
)
