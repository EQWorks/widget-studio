import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

// import { makeStyles } from '@material-ui/core/styles'

import ResultsTable from '../components/table'
import WidgetSelector from './modal'
import EditMode from './edit-mode'
import { Button } from '@eqworks/lumen-ui'
import { Typography } from '@material-ui/core'

import { columns } from './columns.json'
import { results } from './results.json'

// const useStyles = makeStyles((theme) => ({
// }))

// const Widgets = () => {
const Widgets = ({ mlModel }) => {
  // const classes = useStyles()

  // const { resultState: { results, columns } } = mlModel
  const [type, setType] = useState('')
  const [xAxis, setXAxis] = useState('address_city')
  const [yAxis, setYAxis] = useState('converted_visits')
  const [isOpen, setIsOpen] = useState(true)

  useEffect(() => {
    return () => {
      confirm('you are going to lose these changes')
    }
  }, [])

  const isDone = Boolean(xAxis && yAxis && type && !isOpen)

  if(!results.length) {
    return ( <Typography>Run or select a query first</Typography>)
  }
  return (
    <div style={{ overflow: 'auto', padding: 18, maxHeight: 'calc(100vh - 100px' }}>
      <WidgetSelector
        {...{ xAxis, setXAxis, yAxis, setYAxis, type, setType, columns, isOpen, setIsOpen }}
      />
      <div style={{ minHeight: isDone ? '100%' : 500 }}>
        <Button onClick={() => setIsOpen(true)}> + Chart</Button>
      </div>
      { isDone &&
      <EditMode
        {...{ xAxis, setXAxis, yAxis, setYAxis, type, setType, columns, results }}
      />
      }
      <ResultsTable {...{ results }}/>
    </div>
  )
}

Widgets.propTypes = {
  mlModel: PropTypes.object,
}

export default Widgets
