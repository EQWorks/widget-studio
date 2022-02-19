import React from 'react'
import { getTailwindConfigColor, makeStyles, Checkbox } from '@eqworks/lumen-labs'
import CustomToggle from '../../components/custom-toggle'


const classes = makeStyles({
  superSection: {
    '> *': {
      marginBottom: '1.2rem',
    },
    '> :last-child': {
      marginBottom: '0px !important',
    },
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
    '> *': {
      marginRight: '0.8rem',
    },
    '> :last-child': {
      marginRight: '0px !important',
    },
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
  flex1: {
    flex: 1,
  },
  flex0: {
    flex: 0,
  },
})

export const renderSuperSection = (Component) => (
  Component &&
  <div className={classes.superSection}>
    {Component}
  </div>
)

export const renderSection = (title, Component) => (
  Component &&
  <div className={classes.section}>
    {title && <div className={classes.sectionTitle}> {`${title}:`} </div>}
    {Component}
  </div>
)

export const renderRow = (title, Component, titleExtra) => (
  Component &&
  <div className={classes.rowContainer}>
    {(title || titleExtra) &&
      <div className={classes.title}>
        <span className={classes.flex1}> {title && `${title}:`} </span>
        {titleExtra && titleExtra}
      </div>
    }
    <div className={classes.row}>
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

export const renderToggle = (title, value, update, disabled = false) => (
  <div className={classes.itemContainer}>
    <div className={classes.title} > {title && `${title}:`} </div>
    <CustomToggle
      value={value}
      onChange={update}
      disabled={disabled}
    />
  </div>
)
