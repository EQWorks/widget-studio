import React from 'react'
import PropTypes from 'prop-types'

import { makeStyles } from '@material-ui/core/styles'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import InputLabel from '@material-ui/core/InputLabel'
import Input from '@material-ui/core/Input'
import Checkbox from '@material-ui/core/Checkbox'
import MenuItem from '@material-ui/core/MenuItem'
import ListItemText from '@material-ui/core/ListItemText'
import { Chip } from '@eqworks/lumen-ui'


const useStyles = makeStyles(() => ({
  form: {
    width: '50%',
    maxHeight: 200,
    overflowY: 'auto',
    overflowX: 'hidden'
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
  },
}))

const CustomSelect = (props) => {
  const { data, chosenValue, title, multi, setChosenValue, ...rest } = props
  const classes = useStyles()

  const handleChange = (fn) => ({ target: { value } }) => fn(value)

  if (!multi) {
    return (
      <FormControl className={classes.form}>
        <InputLabel id={`single-checkbox-key ${title}`}>{title}</InputLabel>
        <Select
          labelId={`single-checkbox-key ${title}`}
          value={chosenValue}
          onChange={handleChange(setChosenValue)}
          input={<Input />}
          renderValue={(selected) => (
            <div className={classes.chips}>
              <Chip key={selected} label={selected} margin={1} custom='#006DE9'/>
            </div>
          )}
          MenuProps={{ elevation: 1 }}
          {...rest}
        >
          {typeof data[0] === 'object' ?
            data.map(({ name: key, category }) => (
              <MenuItem key={key} value={key}>
                <Checkbox checked={chosenValue === key} />
                <ListItemText primary={`${key} (${category})`} />
              </MenuItem>
            )
            )
            : data.map((value) => (<MenuItem key={value} value={value}>{value}</MenuItem>))
          }
        </Select>
      </FormControl>
    )
  }

  return (
    <FormControl className={classes.form}>
      <InputLabel id={`mutiple-checkbox-key ${title}`}>{title}</InputLabel>
      <Select
        labelId={`mutiple-checkbox-key ${title}`}
        multiple
        value={chosenValue}
        onChange={handleChange(setChosenValue)}
        input={<Input />}
        renderValue={(selected) => (
          <div className={classes.chips}>
            {selected.map((value) => (
              <Chip key={value} label={value} margin={1} custom='#006DE9'/>
            ))}
          </div>
        )}
        MenuProps={{ elevation: 1 }}
        {...rest}
      >
        {typeof data[0] === 'object' ?
          data.map(({ name: key, category }) => {
            return (<MenuItem key={key} value={key}>
              <Checkbox checked={chosenValue.indexOf(key) > -1} />
              <ListItemText primary={`${key} (${category})`} />
            </MenuItem>)
          })
          : data.map((value) => (<MenuItem key={value} value={value}>{value}</MenuItem>))}
      </Select>
    </FormControl>
  )
}

CustomSelect.propTypes = {
  data: PropTypes.array,
  chosenValue: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.array,
  ]),
  setChosenValue: PropTypes.string.isRequired,
  title: PropTypes.string,
  multi: PropTypes.bool,
}
CustomSelect.default = {
  data: [],
  title: '',
  multi: false,
}

export default CustomSelect
