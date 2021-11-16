import React, { useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'

import { Trash } from '../../components/icons'
import CustomSelect from '../../components/custom-select'
import CustomButton from '../../components/custom-button'
import clsx from 'clsx'


const LinkedSelect = ({ className, deletable, deleteCallback, callback, data, init, subData, subInit, controlled, placeholders }) => {

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

  const renderSub =
    <CustomSelect
      classes={{
        root: 'shadow-light-10 border-2 border-r-0 border-secondary-200 rounded-md rounded-r-none',
      }}
      data={subData}
      value={subChoice}
      onSelect={setSubChoice}
      disabled={subDisabled}
      placeholder={placeholders[1]}
    />

  const renderPrimary =
    <div className='border-l border-secondary-50'>
      <CustomSelect
        classes={{
          root: 'shadow-light-10 border-2 border-secondary-200 border-l-0 rounded-md rounded-l-none',
        }}
        data={data}
        value={choice}
        onSelect={setChoice}
        placeholder={placeholders[0]}
      />
    </div>

  const renderDelete =
    <CustomButton
      type='danger'
      onClick={deleteCallback}
      className={clsx('rounded-md flex align-center justify-center my-0.5',
        'transition-width ease-in-out duration-300',
        'w-5 hover:w-7 ml-3 hover:ml-1',
        'bg-secondary-100 hover:bg-error-200'
      )}
    >
      <Trash className='fill-current text-secondary-400 transition-all ease-in-out duration-300 h-full' />
    </CustomButton>

  return (
    <>
      <div className={`max-w-xs col-span-1 ${className}`}> {renderSub} </div>
      <div className={clsx(`max-w-xs col-span-1 ${className}`, { 'flex justify-end': deletable })}>
        <div className='flex-1'>
          {renderPrimary}
        </div>
        {deletable && renderDelete}
      </div>
    </>
  )
}
LinkedSelect.propTypes = {
  className: PropTypes.string,
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
  className: '',
  deletable: false,
  deleteCallback: () => console.error('Not implemented'),
  controlled: true,
  init: '',
  subInit: '',
  placeholders: ['Select', 'Select'],
}

export default LinkedSelect
