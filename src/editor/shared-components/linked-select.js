import React, { useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'

import { Trash } from '../../components/icons'
import _CustomSelect from '../../components/custom-select'
import CustomButton from '../../components/custom-button'


const LinkedSelect = ({ deletable, deleteCallback, callback, data, init, subData, subInit, controlled, placeholders }) => {

  const [choice, setChoice] = useState(init)
  const [subChoice, setSubChoice] = useState(subInit)
  const subDisabled = useMemo(() => !choice || !subData.length, [choice, subData.length])

  useEffect(() => {
    if (choice && (subChoice || subDisabled)) {
      callback([choice, subChoice])
      if (!controlled) {
        setChoice(init)
        setSubChoice(subInit)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [choice, controlled, init, subChoice, subInit])

  return (
    <div className='flex align-stretch'>
      <div className='flex-0'>
        <_CustomSelect
          data={subData}
          value={subChoice}
          onSelect={setSubChoice}
          disabled={subDisabled}
          placeholder={placeholders[1]}
        />
      </div>
      <div className='flex-1'>
        <_CustomSelect
          data={data}
          value={choice}
          onSelect={setChoice}
          placeholder={placeholders[0]}
        />
      </div>
      {deletable &&
        <CustomButton type='danger' className='rounded-md ml-2 m-0.5 flex align-center justify-center transition-width ease-in-out duration-300 w-5 hover:w-8 bg-secondary-100 hover:bg-error-200' onClick={deleteCallback}>
          <Trash className='fill-current text-secondary-400 transition-all ease-in-out duration-300 h-full' />
        </CustomButton>
      }
    </div>
  )
}
LinkedSelect.propTypes = {
  deletable: PropTypes.bool,
  deleteCallback: PropTypes.func,
  callback: PropTypes.func.isRequired,
  controlled: PropTypes.bool,
  data: PropTypes.arrayOf(PropTypes.string).isRequired,
  subData: PropTypes.arrayOf(PropTypes.string).isRequired,
  init: PropTypes.string,
  subInit: PropTypes.string,
  placeholders: PropTypes.arrayOf(PropTypes.string),
}

LinkedSelect.defaultProps = {
  deletable: false,
  deleteCallback: () => console.error('Not implemented'),
  controlled: true,
  init: '',
  subInit: '',
  placeholders: ['Select', 'Select'],
}

export default LinkedSelect
