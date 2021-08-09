import React from 'react'
import { storiesOf } from '@storybook/react'

import { AuthWidgetStudioWithWlCu } from './widget-studio.stories'
import { Widget } from '../src'
import { sampleData } from './sample-data'

storiesOf('Widget', module)
  .add('Dynamic data source', () => (
    <AuthWidgetStudioWithWlCu >
      <Widget />
    </AuthWidgetStudioWithWlCu>
  ))
  .add('Preloaded data source 1', () => (
    <AuthWidgetStudioWithWlCu preloadData={sampleData}>
      <Widget />
    </AuthWidgetStudioWithWlCu>
  ))
