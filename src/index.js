import React from 'react'

import PropTypes from 'prop-types'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { DndProvider } from 'react-dnd'
import { StoreProvider } from 'easy-peasy'

import WidgetConfig from './widgets'
import { store } from './store'

const WidgetStudio = props => {
  return (
    <DndProvider backend={HTML5Backend}>
      <StoreProvider store={store}>
        <WidgetConfig {...props}>
          {props.children}
        </WidgetConfig>
      </StoreProvider>
    </DndProvider>
  )
}

WidgetStudio.propTypes = {
  columns: PropTypes.array,
  rows: PropTypes.array,
  children: PropTypes.object
}

export default WidgetStudio
