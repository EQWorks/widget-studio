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
            <Widget studio {...{ id }} />
          </div>
        )
      }
    </div >
  ))

storiesOf('Undefined widget')
  // showcase behaviour without explicit widget ID
  .add('In studio', () => (
    <Widget studio />
  ))
  // demonstrate incorrect component usage
  .add('Standalone (not allowed)', () => (
    <Widget />
  ))

// for each non-empty sample config,
Object.entries(sampleConfigs).forEach(([id, config]) => {
  if (config && Object.keys(config).length) {

    const type = config.type.charAt(0).toUpperCase() + config.type.slice(1)
    const index = id.split('-')[1]
    const label = `${type} ${index > 1 ? '(' + index + ')' : ''}`

    // generate a studio story
    storiesOf('Defined widget wrapped in studio', module)
      .add(label, () => (
        <Widget studio {...{ id }} />
      ))

    // and a standalone story
    storiesOf('Defined widget')
      .add(label, () => (
        <div style={styles.outerContainer} >
          <Widget {...{ id }} />
        </div>
      ))
  }
})
