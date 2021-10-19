import React, { useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'

import CustomSelect from './custom-select'
import styles from '../styles'


const useStyles = makeStyles(styles)
const LinkedSelect = ({ callback, data, init, subData, subInit, controlled }) => {

  const classes = useStyles()

  const [choice, setChoice] = useState(init)
  const [subChoice, setSubChoice] = useState(subInit)
  const subDisabled = useMemo(() => !choice || !subData.length, [choice, subData.length])

  useEffect(() => {
    if (choice && (subChoice || subDisabled)) {
      callback([choice, subChoice])
      if (!controlled) {
        setChoice(init)
        setSubChoice(subInit)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [choice, controlled, init, subChoice, subInit])

  return (
    <div className={classes.controlRow}>
      <div className={classes.linkedSelectPrimary} >
        <CustomSelect
          data={data}
          chosenValue={choice}
          setChosenValue={setChoice}
        />
      </div>
      <div className={classes.linkedSelectSub}>
        <CustomSelect
          data={subData}
          chosenValue={subChoice}
          setChosenValue={setSubChoice}
          disabled={subDisabled}
        />
      </div>
    </div>
  )
}
LinkedSelect.propTypes = {
  callback: PropTypes.func.isRequired,
  controlled: PropTypes.bool,
  data: PropTypes.arrayOf(PropTypes.string).isRequired,
  subData: PropTypes.arrayOf(PropTypes.string).isRequired,
  init: PropTypes.string,
  subInit: PropTypes.string
}

LinkedSelect.defaultProps = {
  controlled: true,
  init: '',
  subInit: ''
}

export default LinkedSelect
