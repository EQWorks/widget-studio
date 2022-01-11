import React, { useMemo } from 'react'
import PropTypes from 'prop-types'

import LinkedSelect from './linked-select'
import { getLongestString } from '../util'


const PluralLinkedSelect = ({
  staticQuantity,
  titles,
  values,
  primaryKey,
  secondaryKey,
  data,
  subData,
  disableSubFor,
  disableSubMessage,
  callback,
  deleteCallback,
}) => {
  const remainingValues = useMemo(() =>
    data.filter((name) => !(values.map(v => v[primaryKey]).includes(name)))
  ,[data, primaryKey, values])

  const renderValue = i => (
    <LinkedSelect
      key={i}
      className={`${i > 0 ? 'mt-2' : ''}`}
      callback={([_k, _v]) => callback(i, { [primaryKey]: _k, [secondaryKey]: _v })}
      data={remainingValues}
      init={values[i]?.[primaryKey]}
      subData={subData}
      subInit={values[i]?.[secondaryKey]}
      deletable={!staticQuantity && values?.length > 1}
      deleteCallback={() => deleteCallback(i)}
      placeholders={titles}
      disableSub={disableSubFor.includes(values[i]?.[primaryKey])}
      disableSubMessage={`${values[i]?.[primaryKey]} ${disableSubMessage}`}
    />
  )
  return (
    <>
      <div className='invisible h-0 grid grid-cols-min-min pointer-events-none'>
        <LinkedSelect
          data={[]}
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
          !staticQuantity && Boolean(remainingValues?.length) &&
          <LinkedSelect
            className='mt-2'
            controlled={false}
            callback={([_k, _v]) => callback(values.length, { [primaryKey]: _k, [secondaryKey]: _v })}
            data={remainingValues}
            subData={subData}
            placeholders={titles}
          />
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
  disableSubFor: PropTypes.arrayOf(PropTypes.string),
  disableSubMessage: PropTypes.string,
}

PluralLinkedSelect.defaultProps = {
  staticQuantity: null,
  titles: [],
  disableSubFor: [],
  disableSubMessage: '',
}

export default PluralLinkedSelect
