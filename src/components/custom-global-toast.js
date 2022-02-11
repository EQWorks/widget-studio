import React from 'react'
import { Toast } from '@eqworks/lumen-labs'

import { useStoreState, useStoreActions } from '../store'
import clsx from 'clsx'


const CustomGlobalToast = (props) => {
  const update = useStoreActions(({ update }) => update)
  const showToast = useStoreState(({ ui: { showToast } }) => showToast)
  const toastConfig = useStoreState(({ ui: { toastConfig } }) => toastConfig)

  return (
    <div className={clsx('pointer-events-none transition-opacity ease-in-out duration-500 mt-2 absolute flex w-full justify-center', {
      'opacity-0': !showToast,
      'opacity-1': showToast,
    })}>
      <Toast
        classes={{
          root: clsx({
            'pointer-events-auto': showToast,
          }),
        }}
        type='semantic-light'
        {...toastConfig}
        {...props}
        onClose={() => update({ ui: { showToast: false } })}
      />
    </div >
  )
}

export default CustomGlobalToast
