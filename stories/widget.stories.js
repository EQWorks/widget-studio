import React from 'react'
import { storiesOf } from '@storybook/react'

import AuthWidgetStudio from './util/auth-widget-studio'
import { Widget } from '../src'

import styles from '../src/studio/styles'

storiesOf('Widget without ID')
  .add('Blank widget with Studio + data select', () => (
    <AuthWidgetStudio>
      <Widget />
    </AuthWidgetStudio>
  ))
  .add('Blank standalone widget (not allowed)', () => (
    <Widget />
  ))

storiesOf('Widget with ID in studio', module)
  .add('Bar widget with Studio', () => (
    <AuthWidgetStudio>
      <Widget id="bar-1" />
    </AuthWidgetStudio >
  ))
  .add('Pie widget with Studio', () => (
    <AuthWidgetStudio>
      <Widget id="pie-1" />
    </AuthWidgetStudio >
  ))

storiesOf('Widget with ID')
  .add('Bar widget', () => (
    <div style={styles.content} >
      <Widget id="bar-1" />
    </div>
  ))
