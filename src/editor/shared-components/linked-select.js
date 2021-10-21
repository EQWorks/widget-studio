import React, { useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import IconButton from '@material-ui/core/IconButton'
import { Delete } from '@material-ui/icons'
import { makeStyles } from '@material-ui/core/styles'

import CustomSelect from './custom-select'
import styles from '../styles'


const useStyles = makeStyles(styles)

const LinkedSelect = ({
  deletable,
  deleteCallback,
  callback,
  data,
  init,
  subData,
  subInit,
  controlled,
  type,
}) => {
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
      {deletable &&
        <IconButton onClick={type === 'map' ?
          () => {
            deleteCallback()
            setChoice('')
            setSubChoice('')
          } :
          deleteCallback}
        >
          <Delete />
        </IconButton>
      }
    </div>
  )
}

LinkedSelect.propTypes = {
  deletable: PropTypes.bool,
  deleteCallback: PropTypes.func,
  callback: PropTypes.func.isRequired,
  controlled: PropTypes.bool,
  data: PropTypes.arrayOf(PropTypes.string).isRequired,
  subData: PropTypes.arrayOf(PropTypes.string).isRequired,
  init: PropTypes.string,
  subInit: PropTypes.string,
  type: PropTypes.string,
}

LinkedSelect.defaultProps = {
  deletable: false,
  deleteCallback: () => console.error('Not implemented'),
  controlled: true,
  init: '',
  subInit: '',
  type: '',
}

export default LinkedSelect
