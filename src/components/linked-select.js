import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'

import clsx from 'clsx'
import { Icons, Tooltip } from '@eqworks/lumen-labs'

import { Trash } from '../components/icons'
import CustomSelect from '../components/custom-select'
import CustomButton from '../components/custom-button'


const LinkedSelect = ({ className,
  deletable,
  deleteCallback,
  callback,
  data,
  init,
  subData,
  subInit,
  placeholders,
  disableSub,
  disableSubMessage,
}) => {
  const [choice, setChoice] = useState(init)
  const [subChoice, setSubChoice] = useState(subInit)

  useEffect(() => {
    setChoice(init)
    setSubChoice(subInit)
  }, [subInit, init])

  useEffect(() => {
    if (callback) {
      callback([choice, subChoice])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [choice, subChoice])

  const renderSub =
    <CustomSelect
      classes={{
        root: 'shadow-light-10 border-2 border-r-0 border-secondary-200 rounded-md rounded-r-none',
      }}
      data={subData}
      value={disableSub ? '' : subChoice}
      onSelect={setSubChoice}
      disabled={disableSub}
      onClear={() => setSubChoice('')}
      placeholder={disableSub ? 'N/A' : placeholders[1]}
      endIcon={disableSub ? null : <Icons.ArrowDown size='md' />}
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
        onClear={() => setChoice('')}
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
      <div className={`children:block max-w-xs col-span-1 ${className}`}> {
        disableSub
          ? <Tooltip position='left' arrow={false} description={disableSubMessage}>
            {renderSub}
          </Tooltip>
          : renderSub
      } </div>
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
  data: PropTypes.arrayOf(PropTypes.string).isRequired,
  subData: PropTypes.arrayOf(PropTypes.string).isRequired,
  init: PropTypes.string,
  subInit: PropTypes.string,
  placeholders: PropTypes.arrayOf(PropTypes.string),
  disableSub: PropTypes.bool,
  disableSubMessage: PropTypes.string,
}

LinkedSelect.defaultProps = {
  className: '',
  deletable: false,
  deleteCallback: () => console.error('Not implemented'),
  init: '',
  subInit: '',
  placeholders: ['Select', 'Select'],
  disableSub: false,
  disableSubMessage: '',
}

export default LinkedSelect
