import React, { useState } from 'react'
import PropTypes from 'prop-types'

// import { makeStyles } from '@material-ui/core/styles'

import ResultsTable from '../components/table'
import WidgetSelector from './modal'
import EditMode from './edit-mode'
// import { columns, results } from './data'


// const useStyles = makeStyles((theme) => ({
// }))

const Widgets = ({ mlModel }) => {
  // const classes = useStyles()

  const { columns, resultState: { results } } = mlModel
  const [type, setType] = useState('')
  const [grouped, setGrouped] = useState(false)
  const [xAxis, setXAxis] = useState('')
  const [yAxis, setYAxis] = useState([])

  return (
    <div style={{ overflow: 'auto', padding: 18, maxHeight: 'calc(100vh - 100px' }}>
      <WidgetSelector
        {...{ xAxis, setXAxis, yAxis, setYAxis, type, setType, columns, open: true }}
      />
      <EditMode
        {...{ xAxis, setXAxis, yAxis, setYAxis, grouped, setGrouped, type, setType, columns, results }}
      />
      <ResultsTable {...{ results }}/>
    </div>
  )
}

Widgets.propTypes = {
  mlModel: PropTypes.object,
}

export default Widgets
