import React from 'react'
import { storiesOf } from '@storybook/react'

import { AuthWidgetStudioWithWlCu } from './widget-studio.stories'
import { Widget } from '../src'
import dummyData from './dummy-data'

storiesOf('Widget', module)
  .add('Preloaded data source 1', () => (
    <AuthWidgetStudioWithWlCu preloadData={dummyData}>
      <Widget />
    </AuthWidgetStudioWithWlCu>
  ))
