import React from 'react'
import PropTypes from 'prop-types'

import { Icons, Button, makeStyles } from '@eqworks/lumen-labs'

import LinkedSelect from './linked-select'
import clsx from 'clsx'


const classes = makeStyles({
  outerContainer: {
    width: '100%',
    display: 'grid',
    gridTemplateColumns: 'repeat(2, auto)',
  },
})

const PluralLinkedSelect = ({
  staticQuantity,
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
    <Button
      classes={{
        button: clsx('col-span-2 w-full outline-none focus:outline-none px-3 py-1.5 tracking-widest flex flex-col items-stretch', {
          'mt-2': values.length,
        }),
      }}
      type='primary'
      variant='borderless'
      size='md'
      onClick={() => callback(values.length, { [primaryKey]: '', [secondaryKey]: '' })}
    >
      <div className='w-full flex items-center'>
        <span className='flex-1 text-left mr-1'>{addMessage}</span>
        <Icons.Add size='sm' />
      </div>
    </Button>
  )

  return (
    <>
      <div className={classes.outerContainer}>
        {
          staticQuantity
            ? [...Array(staticQuantity)].map((_, i) => renderValue(i))
            : values.map((_, i) => renderValue(i))
        }
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
  callback: PropTypes.func.isRequired,
  deleteCallback: PropTypes.func.isRequired,
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
  disableSubs: false,
  disableSubMessage: '',
  addMessage: 'Add',
  customRenderPrimary: null,
  customRenderSecondary: null,
}

export default PluralLinkedSelect
