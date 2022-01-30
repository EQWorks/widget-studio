import React, { useState } from 'react'
import { storiesOf } from '@storybook/react'
import { Resizable } from 're-resizable'

import modes from '../src/constants/modes'
import sampleConfigs from './sample-configs'
import Widget from '../src'
import CustomToggle from '../src/components/custom-toggle'


Object.values(modes).forEach(mode => {
  // for each non-empty sample config,
  Object.entries(sampleConfigs).forEach(([id, config]) => {
    if (config && Object.keys(config).length) {

      const type = config.type.charAt(0).toUpperCase() + config.type.slice(1)
      const index = id.split('-')[1]
      const label = `${type} ${index > 1 ? '(' + index + ')' : ''}`

      const renderWidget = (
        <Widget
          mode={mode}
          id={id}
        />
      )

      // generate an editor story
      storiesOf(`${mode.toUpperCase()} mode`, module)
        .add(label, () => (
          mode === modes.EDITOR
            ? renderWidget
            : <Resizable
              style={{ margin: '1rem' }}
              defaultSize={mode === modes.VIEW ? { height: '500' } : {}}
            >
              {renderWidget}
            </Resizable >
        ))
    }
  })

  storiesOf('Multiple widgets (dashboard)')
    .add(mode, () => {
      const [fullscreen, setFullscreen] = useState(false)
      return <>
        <div className='bg-secondary-300 p-3'>
          <CustomToggle
            label='Fullscreen widgets'
            value={fullscreen}
            onChange={v => setFullscreen(v)}
          />
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: fullscreen ? 'auto' : '1fr 1fr',
            gridAutoRows: fullscreen ? '100vh' : '60vh',
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
