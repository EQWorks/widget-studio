import React, { useState } from 'react'
import { storiesOf } from '@storybook/react'
import { Resizable } from 're-resizable'

import { Authenticated } from '@eqworks/common-login'

import modes from '../src/constants/modes'
import sampleData from './sample-data'
import sampleConfigs from './sample-configs'
import Widget from '../src'
import CustomToggle from '../src/components/custom-toggle'


const DEFAULT_WL = 4
const DEFAULT_CU = 9533

const devProps = {
  sampleData,
  sampleConfigs,
}

Object.values(modes).forEach(mode => {
  // for each non-empty sample config,
  Object.entries(sampleConfigs).forEach(([id, config]) => {
    if (config && Object.keys(config).length) {
      const renderWidget = (
        <Widget {...devProps}
          mode={mode}
          id={id}
        />
      )
      // generate an editor story and QL preview story
      storiesOf(`${mode.toUpperCase()} mode`, module)
        .add(id, () => (
          mode === modes.EDITOR
            ? <div style={{ width: '100vw', height: '100vh', background: 'blue' }}>
              {renderWidget}
            </div>
            : <Resizable
              style={{ margin: '1rem' }}
              defaultSize={mode === modes.VIEW ? { height: '500' } : {}}
            >
              {renderWidget}
            </Resizable >
        ))
    }
  })

})

storiesOf('Multiple widgets (dashboard)')
  .add(modes.VIEW, () => {
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
              <Widget {...devProps}
                mode={modes.VIEW}
                id={id}
                staticData
              />
            </div>
          )
        }
      </div>
    </>
  })

// add blank widget
storiesOf('Blank Widget (data source control)', module)
  .add('Blank Widget (data source control)', () => (
    <Authenticated product='locus'>
      <div style={{
        width: '100vw',
        height: '100vh',
      }}>
        <Widget
          wl={DEFAULT_WL}
          cu={DEFAULT_CU}
          mode='editor'
        />
      </div>
    </Authenticated>
  ))
