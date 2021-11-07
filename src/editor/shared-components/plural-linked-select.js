import React, { useMemo } from 'react'
import PropTypes from 'prop-types'

import LinkedSelect from './linked-select'



const PluralLinkedSelect = ({ titles, values, primaryKey, secondaryKey, data, subData, callback, deleteCallback }) => {

  const remainingValues = useMemo(() => data.filter((name) => !(values.map(v => v[primaryKey]).includes(name))), [data, primaryKey, values])
  return (
    <>
      {
        values.map((v, i) => {
          return (
            <div key={i} className='mb-2'>
              <LinkedSelect
                callback={([_k, _v]) => callback(i, { [primaryKey]: _k, [secondaryKey]: _v })}
                data={remainingValues}
                init={v[primaryKey]}
                subData={subData}
                subInit={v[secondaryKey]}
                deletable={values?.length > 1}
                deleteCallback={() => deleteCallback(i)}
                placeholders={titles}
              />
            </div>
          )
        })
      }
      {
        Boolean(remainingValues?.length) &&
        <LinkedSelect
          controlled={false}
          callback={([_k, _v]) => callback(values.length, { [primaryKey]: _k, [secondaryKey]: _v })}
          data={remainingValues}
          init={''}
          subData={subData}
          subInit={''}
          placeholders={titles}
        />
      }
    </>
  )
}

PluralLinkedSelect.propTypes = {
  data: PropTypes.arrayOf(PropTypes.string).isRequired,
  subData: PropTypes.arrayOf(PropTypes.string).isRequired,
  primaryKey: PropTypes.string.isRequired,
  secondaryKey: PropTypes.string.isRequired,
  titles: PropTypes.arrayOf(PropTypes.string),
  callback: PropTypes.func.isRequired,
  deleteCallback: PropTypes.func.isRequired,
  values: PropTypes.arrayOf(PropTypes.object).isRequired,
}

PluralLinkedSelect.defaultProps = {
  titles: [],
}

export default PluralLinkedSelect
