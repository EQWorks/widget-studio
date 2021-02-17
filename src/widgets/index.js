import React, { useState } from 'react'
import PropTypes from 'prop-types'

// import { makeStyles } from '@material-ui/core/styles'

import ResultsTable from '../components/table'
import WidgetSelector from './modal'
import EditMode from './edit-mode'
import { Button } from '@eqworks/lumen-ui'
import { Typography } from '@material-ui/core'


// const useStyles = makeStyles((theme) => ({
// }))

const Widgets = ({ mlModel }) => {
  // const classes = useStyles()

  const { columns, resultState: { results } } = mlModel
  const [type, setType] = useState('')
  const [xAxis, setXAxis] = useState('')
  const [yAxis, setYAxis] = useState('')
  const [isOpen, setIsOpen] = useState(true)
  const isDone = Boolean(xAxis && yAxis && type)

  if(!results.length) {
    return ( <Typography>run a query first</Typography>)
  }
  return (
    <div style={{ overflow: 'auto', padding: 18, maxHeight: 'calc(100vh - 100px' }}>
      <WidgetSelector
        {...{ xAxis, setXAxis, yAxis, setYAxis, type, setType, columns, isOpen, setIsOpen }}
      />

      { isDone ?
        <EditMode
          {...{ xAxis, setXAxis, yAxis, setYAxis, type, setType, columns, results }}
        />
        :
        <div style={{ width: '100%', height: 500 }}>
          <Button onClick={() => setIsOpen(true)}> + Add Chart</Button>
        </div>
      }
      <ResultsTable {...{ results }}/>
    </div>
  )
}

Widgets.propTypes = {
  mlModel: PropTypes.object,
}

export default Widgets
