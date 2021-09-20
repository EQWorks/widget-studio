import React, { useEffect, useState, useMemo } from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'

import CustomSelect from './custom-select'
import styles from '../../../styles'

const useStyles = makeStyles(styles)

const LinkedSelect = ({ update, data, init, subData, subInit, controlled }) => {

  const classes = useStyles()

  const [choice, setChoice] = useState(init)
  const [subChoice, setSubChoice] = useState(subInit)
  const subDisabled = useMemo(() => !choice || !subData.length, [choice, subData.length])

  useEffect(() => {
    if (choice && (subChoice || subDisabled)) {
      update({ [choice]: subChoice })
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
  update: PropTypes.func,
  data: PropTypes.array,
  init: PropTypes.string,
  subData: PropTypes.array,
  subInit: PropTypes.string,
  controlled: PropTypes.bool,
}

LinkedSelect.defaultProps = {
  controlled: true
}

export default LinkedSelect
