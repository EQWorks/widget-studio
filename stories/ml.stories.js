import React, { useState, forwardRef } from 'react'

import Dialog from '@material-ui/core/Dialog'
import CloseIcon from '@material-ui/icons/Close'
import Slide from '@material-ui/core/Slide'

import { action } from '@storybook/addon-actions'
import axios from 'axios'

import ML, { FO } from '../src'

const api = axios.create({
  baseURL: [
    process.env.API_HOST || 'http://localhost:3000',
    process.env.API_STAGE,
  ].filter(v => v).join('/'),
  headers: { 'eq-api-jwt': process.env.JWT },
})
const actions = Object.entries(FO(api)).reduce((acc, [name, fn]) => {
  // inject storybook action call to all actions
  acc[name] = (...args) => {
    action(name)
    return fn(...args)
  }
  return acc
}, {})

export default {
  title: 'LOCUS ML',
  component: ML,
}

export const normal = () => (
  <ML actions={actions} />
)

export const InDialog = () => {
  /* eslint-disable-next-line */
  const Transition = forwardRef((props, ref) => <Slide direction='up' ref={ref} {...props} />)
  const [open, setOpen] = useState(false)
  if (open) return (
    <Dialog fullScreen open={open} TransitionComponent={Transition}>
      <ML actions={actions} navIcon={<CloseIcon />} navIconOnClick={() => setOpen(false)} />
    </Dialog>
  )
  return (
    <button onClick={() => setOpen(true)}>Open Locus ML</button>
  )
}
