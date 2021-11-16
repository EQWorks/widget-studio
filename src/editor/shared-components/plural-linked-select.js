import React, { useMemo } from 'react'
import PropTypes from 'prop-types'

import LinkedSelect from './linked-select'


const PluralLinkedSelect = ({ titles, values, primaryKey, secondaryKey, data, subData, callback, deleteCallback }) => {
  const getLongest = (arr) => arr.reduce((a, b) => (a.length > b.length ? a : b))
  const remainingValues = useMemo(() => data.filter((name) => !(values.map(v => v[primaryKey]).includes(name))), [data, primaryKey, values])

  return (
    <>
      <div className='invisible h-0 bg-red-200 grid grid-cols-min-min pointer-events-none'>
        <LinkedSelect
          data={[]}
          subData={[]}
          deletable
          placeholders={[getLongest([titles[0], ...data]), getLongest([titles[1], ...subData])]}
        />
      </div>
      <div className='grid grid-cols-min-1fr'>
        {
          values.map((v, i) => {
            return (
              <LinkedSelect
                key={i}
                className={`${i > 0 ? 'mt-2' : ''}`}
                callback={([_k, _v]) => callback(i, { [primaryKey]: _k, [secondaryKey]: _v })}
                data={remainingValues}
                init={v[primaryKey]}
                subData={subData}
                subInit={v[secondaryKey]}
                deletable={values?.length > 1}
                deleteCallback={() => deleteCallback(i)}
                placeholders={titles}
              />
            )
          })
        }
        {
          Boolean(remainingValues?.length) &&
          <LinkedSelect
            className='mt-2'
            controlled={false}
            callback={([_k, _v]) => callback(values.length, { [primaryKey]: _k, [secondaryKey]: _v })}
            data={remainingValues}
            init={''}
            subData={subData}
            subInit={''}
            placeholders={titles}
          />
        }
      </div >
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
