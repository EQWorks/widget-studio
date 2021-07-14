import React from 'react'

import PropTypes from 'prop-types'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { DndProvider } from 'react-dnd'
import { StoreProvider } from 'easy-peasy'

import Widgets from './widgets'
// import { FO } from './actions'
import { store } from './store'


const WidgetStudio = (props) => {
  return (
    <DndProvider backend={HTML5Backend}>
      <StoreProvider store={store}>
        <Widgets {...props}/>
      </StoreProvider>
    </DndProvider>
  )
}

WidgetStudio.propTypes = { qlModel: PropTypes.object }

export default WidgetStudio
