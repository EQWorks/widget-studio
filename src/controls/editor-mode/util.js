import React from 'react'
import { getTailwindConfigColor, makeStyles } from '@eqworks/lumen-labs'
import CustomToggle from '../../components/custom-toggle'


const classes = makeStyles({
  section: {
    marginBottom: '0.6rem',
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
    fontSize: '0.8rem',
    marginLeft: '0.4rem',
    display: 'flex',
    alignItems: 'center',
  },
  title: {
    color: getTailwindConfigColor('secondary-600'),
    fontSize: '0.8rem',
    marginBottom: '0.2rem',
    display: 'flex',
    alignItems: 'center',
  },
})

export const renderSection = (title, Component) => (
  Component &&
  <div className={classes.section}>
    {title && <div className={classes.sectionTitle}> {`${title}:`} </div>}
    {Component}
  </div>
)

export const renderRow = (title, Component) => (
  Component &&
  <>
    {title && <div className={classes.title} > {`${title}:`} </div>}
    <div className={classes.row}>
      {Component}
    </div>
  </>
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

export const renderBool = (title, value, update, disabled = false) => (
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
