import React, { useState } from 'react'
import { storiesOf } from '@storybook/react'
import { Resizable } from 're-resizable'

import modes from '../src/constants/modes'
import sampleConfigs from './sample-configs'
import Widget from '../src'
import WidgetControlCard from '../src/editor/shared-components/widget-control-card'
import CustomToggle from '../src/editor/shared-components/custom-toggle'


Object.values(modes).forEach(mode => {
  // for each non-empty sample config,
  Object.entries(sampleConfigs).forEach(([id, config]) => {
    if (config && Object.keys(config).length) {

      const type = config.type.charAt(0).toUpperCase() + config.type.slice(1)
      const index = id.split('-')[1]
      const label = `${type} ${index > 1 ? '(' + index + ')' : ''}`

      // generate an editor story
      storiesOf(`${mode.toUpperCase()} mode`, module)
        .add(label, () => (
          <Resizable style={{ margin: '1rem' }} >
            <Widget
              mode={mode}
              id={id}
            />
          </Resizable>
        ))
    }
  })

  storiesOf('Multiple widgets (dashboard)')
    .add(mode, () => {
      const [fullscreen, setFullscreen] = useState(false)
      return <>
        <WidgetControlCard title={'Story controls'}>
          <CustomToggle
            label='Fullscreen widgets'
            value={fullscreen}
            callback={v => setFullscreen(v)}
          />
        </WidgetControlCard>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: fullscreen ? 'auto' : '1fr 1fr',
            gridAutoRows: fullscreen ? '100vh' : 'min-content'
          }} >
          {

            Object.keys(sampleConfigs).map(id =>
              <div key={id} style={{ margin: '2rem' }}>
                <Widget
                  mode={mode}
                  id={id}
                  staticData
                />
              </div>
            )
          }
        </div>
      </>
    })
})

// add blank widget
storiesOf('Blank widget (no ID)', module)
  .add('Blank widget (no ID)', () => (
    <Resizable style={{ margin: '1rem' }} >
      <Widget
        mode='editor'
      />
    </Resizable>
  ))

// showcase behaviour without explicit widget ID
storiesOf('Incorrect usage')
  .add('Editor-mode widget with data control disabled and no widget ID', () => (
    <Widget
      mode='editor'
      staticData
    />
  ))

  .add('View-mode widget without ID', () => (
    <Widget
      mode='view_only'
    />
  ))
