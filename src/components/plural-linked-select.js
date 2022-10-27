import React, { createElement, useMemo } from 'react'
import PropTypes from 'prop-types'

import { Icons, makeStyles, getTailwindConfigColor } from '@eqworks/lumen-labs'
import CustomButton from '../components/custom-button'
import LinkedSelect from './linked-select'
import { hasDevAccess  } from '../util/access'


const classes = makeStyles({
  outerContainer: {
    width: '100%',
  },
  addButton: {
    marginTop: '0.5rem',
    flex: 1,
  },
  addButtonInterior: {
    display: 'flex',
    alignItems: 'center',
    '& svg': {
      marginLeft: '0.3rem',
    },
  },
  grid: {
    width: '100%',
    display: 'grid',
    gridTemplateColumns: 'auto 1fr auto',
  },
  gridColumnEdit : {
    gridTemplateColumns: '1fr 1fr 1fr 1fr auto',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '0.714rem',
    fontWeight: 700,
    color: getTailwindConfigColor('secondary-500'),
    paddingBottom: '0.5rem',
    paddingRight: '0.7rem',
    paddingTop: 0,
    paddingLeft: '0.2rem',
  },
  gridTwoColumns: {
    gridColumn: 'span 2 / span 2',
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
  valueIcons,
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
  editMode,
}) => {
  const quantity = useMemo(() => staticQuantity ? staticQuantity : Math.max(values?.length, 1),
    [staticQuantity, values])

  const renderValue = i => {
    const primary = values[i]?.[primaryKey]
    const secondary = values[i]?.[secondaryKey]
    const remainingData = data
      .map((d, i) => ({ d, i }))
      .filter((({ d }) => primary === d || !values.map(v => v[primaryKey]).includes(d)))

    return (
      <LinkedSelect
        key={i}
        className={`${i > 0 ? 'mt-2' : ''}`}
        callback={([_k, _v]) => callback(i, { [primaryKey]: _k, [secondaryKey]: _v })}
        data={remainingData.map(({ d }) => d)}
        {...(valueIcons && { icons: remainingData.map(({ i }) => valueIcons[i]) })}
        init={primary}
        subData={subData}
        subInit={values[i]?.[secondaryKey]}
        deletable={!staticQuantity && values?.length > 1}
        deleteCallback={([_k, _v]) => deleteCallback(i, { [primaryKey]: _k, [secondaryKey]: _v })}
        showDelete={editMode}
        placeholders={titles}
        disableSub={disableSubs}
        disableSubMessage={`${primary} ${disableSubMessage}`}
        {...(customRenderPrimary && {
          customRender: () => customRenderPrimary(i, primary, secondary),
        })}
        {...(customRenderSecondary && {
          customRenderSub: () => customRenderSecondary(i, primary, secondary),
        })}
        {...{ editMode }}
      />
    )
  }

  return (
    <div className={classes.outerContainer}>
      <div className={`${classes.grid} ${(hasDevAccess() && editMode) ? classes.gridColumnEdit : ''}`}>
        {Boolean(headerIcons.length) &&
          <>
            {!editMode &&
              <span className={classes.header}>
                {createElement(headerIcons[1], { size: 'sm', className: classes.headerIcon })}
                {titles[1]}
              </span>
            }
            <span className={`${classes.header} ${classes.gridTwoColumns}`}>
              {createElement(headerIcons[0], { size: 'sm', className: classes.headerIcon })}
              {titles[0]}
            </span>
            {hasDevAccess && editMode &&
              <span className={`${classes.header} ${classes.gridTwoColumns}`}>
                {createElement(headerIcons[2], { size: 'sm', className: classes.headerIcon })}
                {titles[2]}
              </span>
            }
          </>
        }
        {[...Array(quantity)].map((_, i) => renderValue(i))}
      </div >
      {!staticQuantity &&
        <div className='flex'>
          {
            values.length < data.length &&
            <CustomButton
              classes={{ button: classes.addButton }}
              type='primary'
              variant='borderless'
              size='md'
              onClick={() => callback(values.length, { [primaryKey]: '', [secondaryKey]: '' })}
              disabled={editMode}
            >
              <div className={classes.addButtonInterior}>
                {addMessage}
                <Icons.Add size='sm' />
              </div>
            </CustomButton>
          }
        </div>
      }
    </div >
  )
}

PluralLinkedSelect.propTypes = {
  staticQuantity: PropTypes.number,
  data: PropTypes.arrayOf(PropTypes.string).isRequired,
  subData: PropTypes.arrayOf(PropTypes.string).isRequired,
  primaryKey: PropTypes.string.isRequired,
  secondaryKey: PropTypes.string.isRequired,
  titles: PropTypes.arrayOf(PropTypes.string),
  headerIcons: PropTypes.array,
  callback: PropTypes.func.isRequired,
  deleteCallback: PropTypes.func,
  values: PropTypes.arrayOf(PropTypes.object).isRequired,
  valueIcons: PropTypes.arrayOf(PropTypes.elementType),
  disableSubs: PropTypes.bool,
  disableSubMessage: PropTypes.string,
  editMode: PropTypes.bool,
  addMessage: PropTypes.string,
  customRenderPrimary: PropTypes.func,
  customRenderSecondary: PropTypes.func,
}

PluralLinkedSelect.defaultProps = {
  staticQuantity: null,
  titles: [],
  headerIcons: [],
  deleteCallback: () => { },
  valueIcons: null,
  disableSubs: false,
  disableSubMessage: '',
  editMode: false,
  addMessage: 'Add',
  customRenderPrimary: null,
  customRenderSecondary: null,
}

export default PluralLinkedSelect
