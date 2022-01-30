import React from 'react'

import { makeStyles, getTailwindConfigColor } from '@eqworks/lumen-labs'

import { useStoreState } from '../../store'
import Icons from '../shared/widget-type-icons'
import WidgetControlCard from '../shared/widget-control-card'
import EditorRightSidebar from './right-sidebar'


const classes = makeStyles({
  outerContainer: {
    width: '20rem',
    display: 'flex',
    flexDirection: 'column',
    border: `1px solid ${getTailwindConfigColor('neutral-100')}`,
  },
})

const EditorModeControls = () => {
  const dataReady = useStoreState((state) => state.dataReady)

  return (
    <div className={classes.outerContainer}>
      <WidgetControlCard
        title='Select Widget Type'
        clearable
      >
        <Icons disabled={!dataReady} />
      </WidgetControlCard>
      <EditorRightSidebar />
    </div>
  )
}

export default EditorModeControls
