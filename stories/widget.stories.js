import React, { useState, cloneElement } from 'react'
import { storiesOf } from '@storybook/react'
import { Resizable } from 're-resizable'

import { ReactQueryDevtools } from 'react-query/devtools'
import { QueryClient, QueryClientProvider } from 'react-query'
import { Authenticated } from '@eqworks/common-login'
import { makeStyles } from '@eqworks/lumen-labs'

import modes from '../src/constants/modes'
import sampleData from './sample-data'
import sampleConfigs from './sample-configs'
import Widget, { WidgetManager } from '../src'
import CustomSelect from '../src/components/custom-select'
import WlCuSelector from './wl-cu-selector'
import withQueryClient from '../src/util/with-query-client'
import InsightsDataProvider from '../src/insights-data-provider'


const DEFAULT_WL = 2456
const DEFAULT_CU = 27848
const DEFAULT_DEALER = 1

const BLANK_WIDGET_WL = 101
const BLANK_WIDGET_CU = 13147

const devProps = {
  sampleData,
  sampleConfigs,
  wl: DEFAULT_WL,
  cu: DEFAULT_CU,
}

const classes = makeStyles({
  dashboardGrid: {
    padding: '1rem',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(20rem, 1fr))',
    gap: '0.8rem',
  },
  dashboardWidget: {
    aspectRatio: 2,
    borderRadius: '0.6rem !important',
  },
})

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
              {id === 'dev-map-2' ? renderWidgetAuth : renderWidget}
            </div>
            : <Resizable
              style={{ margin: '1rem' }}
              defaultSize={{ width: '50vw', height: '50vh' }}
            >
              {id === 'dev-map-2' && mode !== modes.VIEW ? renderWidgetAuth : renderWidget}
            </Resizable >
        ))
    }
  })

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
          wl={BLANK_WIDGET_WL}
          cu={BLANK_WIDGET_CU}
          mode='editor'
        />
      </div>
    </Authenticated>
  ))

// "dashboard" demo to test CRUD
storiesOf('Widget Management', module)
  .add('Widget Management', () => {
    const queryClient = new QueryClient()
    return <Authenticated product='locus'>
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen={false} />
        <WlCuControlsProvider>
          <WidgetManager
            wl={DEFAULT_WL}
            cu={DEFAULT_CU}
            dealer={DEFAULT_DEALER}
          />
        </WlCuControlsProvider>
      </QueryClientProvider>
    </Authenticated>
  })

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

const YEAR = 2021
const MONTH = 1

// InsightsDataProvider demonstration
storiesOf('InsightsDataProvider', module)
  .add('InsightsDataProvider', () => {
    const WIDGET_IDS = ['100056', '100057', '100058', '100084']
    return (
      <Authenticated product='locus'>
        <div className={classes.dashboardGrid}>
          <InsightsDataProvider year={YEAR} month={MONTH}>
            {WIDGET_IDS.map(id => (
              <div className={classes.dashboardWidget} key={id}>
                <Widget
                  wl={DEFAULT_WL}
                  cu={DEFAULT_CU}
                  id={id}
                  mode='compact_view_only'
                  filters={[{ key: 'resolution', filter: [5000] }]} // just for demonstration, some of these widgets require a resolution filter
                />
              </div>
            ))
            }
          </InsightsDataProvider>
        </div>
      </Authenticated >
    )
  })

// Temporary solution for dashboar widget management for Cox
storiesOf('Widget Management with Insights Data saved configuration', module)
  .add('Widget Management with Insights Data saved configuration', () => {
    const queryClient = new QueryClient()
    return <Authenticated product='locus'>
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen={false} />
        <WlCuControlsProvider>
          <WidgetManager
            wl={DEFAULT_WL}
            cu={DEFAULT_CU}
            dealer={DEFAULT_DEALER}
            saveWithInsightsData
            filters={[{ key: 'resolution', filter: [20000] }]}
            //{ key: 'OEM', filter: ['Acura'] }]
            year={YEAR}
            month={MONTH}
          />
        </WlCuControlsProvider>
      </QueryClientProvider>
    </Authenticated>
  })
