import React, { useState } from 'react'

import { HexColorPicker } from 'react-colorful'

import { useStoreState, useStoreActions } from '../../store'
import { makeStyles, Button, getTailwindConfigColor, TextField } from '@eqworks/lumen-labs'
import { validateHex } from '../../util/colors'
import CustomSelect from '../../components/custom-select'


const useStyles = ({ baseColor, showPicker }) => makeStyles({
  outerContainer: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    alignItems: 'stretch',
  },
  row: {
    display: 'flex',
    marginBottom: '1rem',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  swatchContainer: {
    position: 'relative',
    width: '1.4rem',
    height: '1.4rem',
    borderRadius: '1.4rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  swatch: {
    position: 'relative',
    width: '100%',
    height: '100%',
    borderRadius: '0.3rem',
  },
  selectedSwatchIndicator: {
    position: 'absolute',
    borderRadius: '0.2rem',
    height: '0.68rem',
    width: '0.68rem',
    background: 'white',
    transition: 'width 0.5s ease, height 0.5s ease',
    pointerEvents: 'none',
  },
  hiddenSelectedSwatchIndicator: {
    position: 'absolute',
    borderRadius: '0.8rem',
    height: '0rem',
    width: '0rem',
    background: 'white',
    transition: 'width 0.5s ease, height 0.5s ease',
    pointerEvents: 'none',
  },
  selectedSwatch: {
    width: '1.4rem',
    borderRadius: '1.4rem',
    outline: 'solid',
    outlineWidth: '0.28rem',
    outlineOffset: '-0.28rem',
  },
  baseSwatch: {
    transition: 'background 1s',
    background: baseColor,
    borderRadius: '0.3rem',
    width: '1.1rem',
    height: '1.1rem',
  },
  baseSwatchContainer: {
    transition: 'box-shadow 1s',
    boxShadow: `0 0 0.2rem ${getTailwindConfigColor('primary-200')}`,
    '&:hover': {
      boxShadow: `0 0 0.2rem ${getTailwindConfigColor('primary-300')}`,
    },
    borderRadius: '0.4rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '1.6rem',
    height: '1.6rem',
  },
  colorPicker: {
    transition: 'height 0.2s, opacity 0.8s',
    overflow: 'hidden',
    height: showPicker ? '10rem' : 0,
    display: 'flex',
    flexDirection: 'column',
    opacity: + showPicker,
    '> .react-colorful': {
      width: '100%',
      marginBottom: '1rem',
    },
  },
  textInputContainer: {
    marginLeft: '1rem',
    marginRight: '0.5rem',
    flex: 1,
  },
  textInput: {
    width: 'auto',
    borderColor: getTailwindConfigColor('secondary-200'),
  },
})


const ColorSchemeControls = () => {

  // common actions
  const update = useStoreActions((state) => state.update)
  const nestedUpdate = useStoreActions((state) => state.nestedUpdate)

  // common state
  const presetColors = useStoreState((state) => state.presetColors)
  const baseColor = useStoreState((state) => state.genericOptions.baseColor)

  // local state
  const [selectedColorIndex, setSelectedColorIndex] = useState(presetColors.indexOf(baseColor) === -1 ? presetColors.length - 1 : presetColors.indexOf(baseColor))
  // local UI state
  const [inputError, setInputError] = useState(false)
  const [inputFocus, setInputFocus] = useState(false)
  const [showPicker, setShowPicker] = useState(true)
  const [showInputHelper, setShowInputHelper] = useState(false)

  const updatePresetColors = () => update({ presetColors: presetColors.map((_c, i) => i === selectedColorIndex ? baseColor : _c) })

  const styles = useStyles({ baseColor, showPicker })

  return (
    <div className={styles.outerContainer}>
      <div className={styles.row}>
        <Button
          type='secondary'
          variant='borderless'
          onClick={() => setShowPicker(!showPicker)}
        >
          <div className={styles.baseSwatchContainer}>
            <div className={styles.baseSwatch} />
          </div>
        </Button>
        <div className={styles.textInputContainer}>
          <TextField
            classes={{
              root: styles.textInput,
              container: styles.textInput,
            }}
            deleteButton={false}
            error={inputError}
            helperText={showInputHelper ? 'Invalid color' : undefined}
            placeholder='#ABCDEF'
            value={inputFocus ? undefined : baseColor.toUpperCase()}
            onBlur={() => {
              setInputFocus(false)
              setInputError(false)
              setShowInputHelper(false)
            }}
            onClick={() => setInputFocus(true)}
            onChange={(v) => {
              const valid = validateHex(v)
              if (valid) {
                nestedUpdate({ genericOptions: { baseColor: v } })
                updatePresetColors()
                setShowInputHelper(false)
              }
              setInputError(!valid)
            }}
            onSubmit={(e) => {
              e.nativeEvent.preventDefault()
              setShowInputHelper(inputError)
            }}
          />
        </div>
        <CustomSelect
          classes={{
            root: 'bg-secondary-100 shadow-light-10 rounded-md',
            menu: 'w-full',
            content: 'children:overflow-hidden children:overflow-ellipsis children:fill-current children:text-secondary-600',
            selectedOptionTitle: 'normal-case',
            listContainer: 'normal-case',
          }}
          data={['HEX', 'RGBA', 'RGB']}
          value='HEX'
          allowClear={false}
        />
      </div>

      <div className={styles.colorPicker}>
        <HexColorPicker
          // className={styles.colorPicker}
          color={baseColor}
          onChange={baseColor => {
            updatePresetColors()
            nestedUpdate({ genericOptions: { baseColor } })
          }}
        />
        <div className={styles.row}>
          {
            presetColors.map((c, i) => (
              <div key={i} className={styles.swatchContainer}>
                <Button
                  className={styles.swatch}
                  style={{ background: c }}
                  onClick={() => {
                    setSelectedColorIndex(i)
                    nestedUpdate({ genericOptions: { baseColor: c } })
                  }}
                />
                <div
                  className={
                    i === selectedColorIndex
                      ? styles.selectedSwatchIndicator
                      : styles.hiddenSelectedSwatchIndicator
                  }
                />
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}

export default ColorSchemeControls
