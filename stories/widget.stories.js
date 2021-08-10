import React from 'react'
import { storiesOf } from '@storybook/react'

import AuthWidgetStudioWithWlCu from './util/auth-widget-studio-with-data-select'
import { Widget } from '../src'

import styles from '../src/studio/styles'

storiesOf('Widget without ID')
  .add('Blank widget with Studio + data select', () => (
    <AuthWidgetStudioWithWlCu >
      <Widget />
    </AuthWidgetStudioWithWlCu>
  ))
  .add('Blank standalone widget (not allowed)', () => (
    <Widget />
  ))

storiesOf('Widget with ID in studio', module)
  // .add('Preloaded data source 1', () => (
  //   <AuthWidgetStudioWithWlCu preloadData={sampleData}>
  //     <Widget />
  //   </AuthWidgetStudioWithWlCu>
  // ))
  .add('Bar widget with Studio', () => (
    <AuthWidgetStudioWithWlCu >
      <Widget id="bar-1" />
    </AuthWidgetStudioWithWlCu >
  ))
  .add('Pie widget with Studio', () => (
    <AuthWidgetStudioWithWlCu >
      <Widget id="pie-1" />
    </AuthWidgetStudioWithWlCu >
  ))

storiesOf('Widget with ID')
  .add('Bar widget', () => (
    <div style={styles.content} >
      <Widget id="bar-1" />
    </div>
  ))
