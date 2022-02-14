import React, { createElement, useMemo } from 'react'
import PropTypes from 'prop-types'

import { Icons, makeStyles, getTailwindConfigColor } from '@eqworks/lumen-labs'
import CustomButton from '../components/custom-button'

import LinkedSelect from './linked-select'


const classes = makeStyles({
  addButton: {
    marginTop: '0.5rem',
    gridColumn: 'span 3 / span 3',
  },
  addButtonInterior: {
    display: 'flex',
    alignItems: 'center',
    '& svg': {
      marginLeft: '0.3rem',
    },
  },
  outerContainer: {
    width: '100%',
    display: 'grid',
    gridTemplateColumns: 'auto 1fr auto',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '0.714rem',
    fontWeight: 700,
    color: getTailwindConfigColor('secondary-500'),
    padding: '0.5rem',
    paddingTop: 0,
  },
  headerIcon: {
    height: '0.714rem !important',
    marginRight: '0.4rem',
  },
})

const PluralLinkedSelect = ({
  staticQuantity,
  headerIcons,
  titles,
  values,
  primaryKey,
  secondaryKey,
  data,
  subData,
  disableSubs,
  disableSubMessage,
  callback,
  deleteCallback,
  addMessage,
  customRenderPrimary,
  customRenderSecondary,
}) => {
  const renderValue = i => {
    const primary = values[i]?.[primaryKey]
    const secondary = values[i]?.[secondaryKey]
    return (
      <LinkedSelect
        key={i}
        className={`${i > 0 ? 'mt-2' : ''}`}
        callback={([_k, _v]) => callback(i, { [primaryKey]: _k, [secondaryKey]: _v })}
        data={data.filter(d => primary === d || !values.map(v => v[primaryKey]).includes(d))}
        init={primary}
        subData={subData}
        subInit={values[i]?.[secondaryKey]}
        deletable={!staticQuantity && values?.length > 1}
        deleteCallback={([_k, _v]) => deleteCallback(i, { [primaryKey]: _k, [secondaryKey]: _v })}
        placeholders={titles}
        disableSub={disableSubs}
        disableSubMessage={`${primary} ${disableSubMessage}`}
        {...(customRenderPrimary && {
          customRender: () => customRenderPrimary(i, primary, secondary),
        })}
        {...(customRenderSecondary && {
          customRenderSub: () => customRenderSecondary(i, primary, secondary),
        })}
      />
    )
  }

  const renderAddKeyButton = (
    <CustomButton
      classes={{
        button: classes.addButton,
      }}
      type='primary'
      variant='borderless'
      size='md'
      onClick={() => callback(values.length, { [primaryKey]: '', [secondaryKey]: '' })}
    >
      <div className={classes.addButtonInterior}>
        {addMessage}
        <Icons.Add size='sm' />
      </div>
    </CustomButton>
  )

  const quantity = useMemo(() => staticQuantity ? staticQuantity : Math.max(values?.length, 1), [staticQuantity, values])

  return (
    <>
      <div className={classes.outerContainer}>
        {Boolean(headerIcons.length) &&
          <>
            <span className={classes.header} >
              {createElement(headerIcons[1], { size: 'sm', className: classes.headerIcon })}
              {titles[1]}
            </span>
            <span className={classes.header} >
              {createElement(headerIcons[0], { size: 'sm', className: classes.headerIcon })}
              {titles[0]}
            </span>
            <span className={classes.header} />
          </>
        }
        {[...Array(quantity)].map((_, i) => renderValue(i))}
        {
          !staticQuantity && values.length < data.length &&
          renderAddKeyButton
        }
      </div >
    </>
  )
}

PluralLinkedSelect.propTypes = {
  staticQuantity: PropTypes.number,
  data: PropTypes.arrayOf(PropTypes.string).isRequired,
  subData: PropTypes.arrayOf(PropTypes.string).isRequired,
  primaryKey: PropTypes.string.isRequired,
  secondaryKey: PropTypes.string.isRequired,
  titles: PropTypes.arrayOf(PropTypes.string),
  headerIcons: PropTypes.arrayOf(PropTypes.node),
  callback: PropTypes.func.isRequired,
  deleteCallback: PropTypes.func,
  values: PropTypes.arrayOf(PropTypes.object).isRequired,
  disableSubs: PropTypes.bool,
  disableSubMessage: PropTypes.string,
  addMessage: PropTypes.string,
  customRenderPrimary: PropTypes.func,
  customRenderSecondary: PropTypes.func,
}

PluralLinkedSelect.defaultProps = {
  staticQuantity: null,
  titles: [],
  headerIcons: [],
  deleteCallback: () => {},
  disableSubs: false,
  disableSubMessage: '',
  addMessage: 'Add',
  customRenderPrimary: null,
  customRenderSecondary: null,
}

export default PluralLinkedSelect
