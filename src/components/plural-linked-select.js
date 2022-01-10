import React from 'react'
import PropTypes from 'prop-types'

import { Icons, Button } from '@eqworks/lumen-labs'

import LinkedSelect from './linked-select'
import clsx from 'clsx'
import { getLongestString } from '../util'


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
}) => {
  const renderValue = i => {
    const val = values[i]?.[primaryKey]
    return (
      <LinkedSelect
        key={i}
        className={`${i > 0 ? 'mt-2' : ''}`}
        callback={([_k, _v]) => callback(i, { [primaryKey]: _k, [secondaryKey]: _v })}
        data={data.filter(d => val === d || !values.map(v => v[primaryKey]).includes(d))}
        init={val}
        subData={subData}
        subInit={values[i]?.[secondaryKey]}
        deletable={!staticQuantity && values?.length > 1}
        deleteCallback={() => deleteCallback(i)}
        placeholders={titles}
        disableSub={disableSubs}
        disableSubMessage={`${val} ${disableSubMessage}`}
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
        <span className='flex-1 text-left mr-1'>Add Key</span>
        <Icons.Add size='sm' />
      </div>
    </Button>
  )

  return (
    <>
      <div className='invisible h-0 grid grid-cols-min-min pointer-events-none'>
        <LinkedSelect
          data={[]}
          callback={() => { }}
          subData={[]}
          deletable
          placeholders={[getLongestString([titles[0], ...data]), getLongestString([titles[1], ...subData])]}
        />
      </div>
      <div className='grid grid-cols-min-1fr'>
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
}

PluralLinkedSelect.defaultProps = {
  staticQuantity: null,
  titles: [],
  disableSubs: false,
  disableSubMessage: '',
}

export default PluralLinkedSelect
