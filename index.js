import React, { useEffect } from 'react'

import SplitPane  from 'react-split-pane'

import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Collapse from '@material-ui/core/Collapse'
import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'
import FormLabel from '@material-ui/core/FormLabel'
import Container from '@material-ui/core/Container'
import Button from '@material-ui/core/Button'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import Card from '@material-ui/core/Card'
import ToggleButton from '@material-ui/lab/ToggleButton'
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup'
import TextField from '@material-ui/core/TextField'
import InputAdornment from '@material-ui/core/InputAdornment'
import Search from '@material-ui/icons/Search'
import LinearProgress from '@material-ui/core/LinearProgress'

import { makeStyles } from '@material-ui/core/styles'


import { useML } from './hooks'
import Views from './views'

function ML () {
  const [views, loading] = useML()
  
  console.log(views, loading)
  

  return (
    <SplitPane split="vertical" minSize={50} defaultSize={100} style={{ height: 'inherit' }}>
      <Views views={views} />
      <div>345</div>
    </SplitPane>
  )
}

export default ML