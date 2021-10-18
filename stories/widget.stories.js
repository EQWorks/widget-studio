import React, { useState } from 'react'
import { storiesOf } from '@storybook/react'

import sampleConfigs from './sample-configs'
import Widget from '../src'
import WidgetControlCard from '../src/editor/shared-components/custom-toggle'
import CustomToggle from '../src/editor/shared-components/widget-control-card'


storiesOf('Dashboard-esque example')
  .add('Dashboard-esque example', () => {
    const [fullscreen, setFullscreen] = useState(false)
    return <>
      <WidgetControlCard title={'Story controls'}>
        <CustomToggle label={'Fullscreen widgets'} value={fullscreen} callback={v => setFullscreen(v)} />
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
              <Widget editor {...{ id }} staticData />
            </div>
          )
        }
      </div >
    </>
  })

// showcase behaviour without explicit widget ID
storiesOf('Widget with no ID (editor enabled)')
  .add('Data control enabled (default)', () => (
    <Widget editor />
  ))
  .add('Data control disabled [DISALLOWED]', () => (
    <Widget editor staticData />
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

    // generate an editor story
    storiesOf('Widget with ID (editor enabled)', module)
      .add(label, () => (
        <Widget editor {...{ id }} />
      ))

    // and a standalone story
    storiesOf('Widget with ID (standalone)')
      .add(label, () => (
        <Widget {...{ id }} />
      ))
  }
})
