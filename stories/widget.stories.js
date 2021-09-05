import React from 'react'
import { storiesOf } from '@storybook/react'

import sampleConfigs from './sample-configs'
import Widget from '../src'
import styles from '../src/styles'

storiesOf('Dashboard-esque example')
  .add('Dashboard-esque example', () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '50% 50%'
      }} >
      {
        Object.keys(sampleConfigs).map(id =>
          <div key={id}>
            <Widget studio {...{ id }} staticData />
          </div>
        )
      }
    </div >
  ))

// showcase behaviour without explicit widget ID
storiesOf('Widget with no ID (studio enabled)')
  .add('Data control enabled (default)', () => (
    <Widget studio />
  ))
  .add('Data control disabled [DISALLOWED]', () => (
    <Widget studio staticData />
  ))

// showcase behaviour without explicit widget ID
storiesOf('Widget with no ID (standalone)')
  .add('Data control enabled (default) [DISALLOWED]', () => (
    <Widget />
  ))
  .add('Data control disabled [DISALLOWED]', () => (
    <Widget staticData />
  ))

// for each non-empty sample config,
Object.entries(sampleConfigs).forEach(([id, config]) => {
  if (config && Object.keys(config).length) {

    const type = config.type.charAt(0).toUpperCase() + config.type.slice(1)
    const index = id.split('-')[1]
    const label = `${type} ${index > 1 ? '(' + index + ')' : ''}`

    // generate a studio story
    storiesOf('Widget with ID (studio enabled)', module)
      .add(label, () => (
        <Widget studio {...{ id }} />
      ))

    // and a standalone story
    storiesOf('Widget with ID (standalone)')
      .add(label, () => (
        <div style={styles.outerContainer} >
          <Widget {...{ id }} />
        </div>
      ))
  }
})
