import React from 'react'

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
