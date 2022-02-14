import React from 'react'
import { getTailwindConfigColor, makeStyles } from '@eqworks/lumen-labs'
import CustomToggle from '../../components/custom-toggle'


const classes = makeStyles({
  section: {
    marginTop: '0.2rem',
    // TEMPORARY adjustment
    // marginBottom: '0.7rem',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
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
  //   margin: '0.2rem 0',
  },
  rowContainer: {
    width: '100%',
    margin: '0.2rem 0',
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
    padding: '0.2rem',
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

export const renderSection = (title, Component) => (
  Component &&
  <div className={classes.section}>
    <div className={classes.sectionTitle}>
      {title && `${title}:`}
    </div>
    {Component}
  </div>
)

export const renderRow = (title, Component, titleExtra) => (
  Component &&
  <div className={classes.rowContainer}>
    {(title || titleExtra) &&
      <div className={classes.title}>
        <span className={classes.flex1}> {`${title}:`} </span>
        {titleExtra && titleExtra}
      </div>
    }
    <div className={classes.row}>
      {Component}
    </div>
  </div>
)

export const renderItem = (title, Component) => (
  Component &&
  <div className={classes.itemContainer}>
    <div className={classes.title} > {`${title}:`} </div>
    <div className={classes.item}>
      {Component}
    </div>
  </div>
)

export const renderCheckbox = (title, value, update, disabled = false) => (
  <div className={classes.inlineItemContainer}>
    <div className={classes.inlineItem}>
      <CustomToggle
        value={value}
        onChange={update}
        disabled={disabled}
      />
    </div>
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
