import React, { useState, cloneElement } from 'react'
import { storiesOf } from '@storybook/react'
import { Resizable } from 're-resizable'

import { Authenticated } from '@eqworks/common-login'

import modes from '../src/constants/modes'
import sampleData from './sample-data'
import sampleConfigs from './sample-configs'
import Widget from '../src'
import CustomToggle from '../src/components/custom-toggle'
import CustomSelect from '../src/components/custom-select'
import WlCuSelector from './wl-cu-selector'
import withQueryClient from '../src/util/with-query-client'
import ListDemo from './list-demo'


const DEFAULT_WL = 2456
const DEFAULT_CU = 27848

const devProps = {
  sampleData,
  sampleConfigs,
  wl: DEFAULT_WL,
  cu: DEFAULT_CU,
}

const WlCuControlsProvider = withQueryClient(({ children }) => {
  const [controls, setControls] = useState({ isDevStage: true, showSelector: true })
  const wlState = useState({ index: DEFAULT_WL, value: 'Cox (internal)' })
  const cuState = useState({ index: DEFAULT_CU, value: '27848 - Cox' })
  return (
    <>
      {controls.isDevStage && controls.showSelector && <WlCuSelector {...{ wlState, cuState }} />}
      {
        cloneElement(children, {
          devStageControls: { ...controls, update: setControls },
          wl: wlState[0].index,
          cu: cuState[0].index,
        })
      }
    </>
  )
})


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
      const renderWidgetAuth = (
        <Authenticated product='locus'>
          <div style={{
            width: '100vw',
            height: '100vh',
          }}>
            <Widget {...devProps}
              mode={mode}
              id={id}
            />
          </div>
        </Authenticated>
      )
      // generate an editor story and QL preview story
      storiesOf(`${mode.toUpperCase()} mode`, module)
        .add(id, () => (
          mode === modes.EDITOR
            ? <div style={{ width: '100vw', height: '100vh', background: 'blue' }}>
              {id === 'map-2' ? renderWidgetAuth : renderWidget}
            </div>
            : <Resizable
              style={{ margin: '1rem' }}
              defaultSize={{ width: '50vw', height: '50vh' }}
            >
              {id === 'map-2' && mode !== modes.VIEW ? renderWidgetAuth : renderWidget}
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

// "dashboard" demo to test CRUD
storiesOf('List', module)
  .add('List', () => (
    <Authenticated product='locus'>
      <WlCuControlsProvider>
        <ListDemo />
      </WlCuControlsProvider>
    </Authenticated>
  ))

// tmp filter prop demo
storiesOf('TMP filter prop demo', module)
  .add('TMP filter prop demo', () => {
    const RADII = {
      '500m': 500,
      '1km': 1000,
      '5km': 5000,
      '10km': 10000,
      '20km': 20000,
    }
    const [radius, setRadius] = useState(Object.keys(RADII)[0])
    return (
      <Authenticated product='locus'>
        <div style={{
          width: '100px',
          margin: '1rem',
        }}>
          Radius
          <CustomSelect
            data={Object.keys(RADII)}
            value={radius}
            onSelect={setRadius}
          />
        </div>
        <div style={{
          width: '600px',
          height: '500px',
        }}>
          <Widget
            config={sampleConfigs['filter-test-1']}
            mode='view_only'
            filters={[
              {
                key: 'resolution',
                filter: [RADII[radius]],
              },
            ]}
          />
        </div>
      </Authenticated>
    )
  })
