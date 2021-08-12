import React from 'react'
import { storiesOf } from '@storybook/react'

import AuthWidgetStudio from './util/auth-widget-studio'
import { Widget } from '../src'

import styles from '../src/studio/styles'
import sampleConfigs from './sample-configs'

storiesOf('Undefined widget')
  .add('In studio', () => (
    <AuthWidgetStudio>
      <Widget />
    </AuthWidgetStudio>
  ))
  .add('Standalone (not allowed)', () => (
    <Widget />
  ))

Object.entries(sampleConfigs).forEach(([id, config]) => {
  if (config && Object.keys(config).length) {
    const type = config.type.charAt(0).toUpperCase() + config.type.slice(1)
    const index = id.split('-')[1]
    const label = `${type} ${index > 1 ? '(' + index + ')' : ''}`
    storiesOf('WidgetStudio with defined widget', module)
      .add(label, () => (
        <AuthWidgetStudio>
          <Widget {...{ id }} />
        </AuthWidgetStudio >
      ))

    storiesOf('Defined widget')
      .add(label, () => (
        <div style={styles.content} >
          <Widget {...{ id }} />
        </div>
      ))
  }
})
