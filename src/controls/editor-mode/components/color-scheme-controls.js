import React, { useEffect, createElement, useState, useMemo } from 'react'

import { useDebouncedCallback } from 'use-debounce'
import { colord } from 'colord'
import { makeStyles, Button, getTailwindConfigColor, TextField } from '@eqworks/lumen-labs'

import { useStoreState, useStoreActions } from '../../../store'
import CustomSelect from '../../../components/custom-select'
import CustomRadio from '../../../components/custom-radio'
import { COLOR_REPRESENTATIONS, COLOR_RADIO_LABELS } from '../../../constants/color'
import types from '../../../constants/types'
import { renderRow } from '../../shared/util'


const useStyles = ({ color, showPicker, type }) => makeStyles({
  outerContainer: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    alignItems: 'stretch',
    ...(type !== types.MAP && {
      marginTop: '0.8rem',
    }),
  },
  radioContainer: {
    display: 'flex',
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '0.6rem',
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
    background: color,
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
  const userUpdate = useStoreActions((state) => state.userUpdate)

  // common state
  const presetColors = useStoreState((state) => state.presetColors)
  const baseColor = useStoreState((state) => state.genericOptions.baseColor)
  const widgetBaseColor1Selection = useStoreState((state) => state.ui.widgetBaseColor1Selection)
  const colorRepresentation = useStoreState((state) => state.ui.colorRepresentation)
  const type = useStoreState((state) => state.type)

  const [color, selectedColor] = useMemo(() => widgetBaseColor1Selection
    ? [baseColor.color1, Object.keys(baseColor)[0]]
    : [baseColor.color2, Object.keys(baseColor)[1]]
  ,[widgetBaseColor1Selection, baseColor])

  // local state
  const [selectedColorIndex, setSelectedColorIndex] = useState(
    presetColors.indexOf(color) === -1
      ? presetColors.length - 1
      : presetColors.indexOf(color)
  )
  const [inputError, setInputError] = useState(false)
  const [showPicker, setShowPicker] = useState(false)
  const [showInputHelper, setShowInputHelper] = useState(false)

  const styles = useStyles({ color, showPicker, type })

  const updateBaseColor = useDebouncedCallback(v => userUpdate({
    genericOptions: { baseColor: { [selectedColor]: colord(v).toHex() } },
  }), 100)

  useEffect(() => {
    update({ presetColors: presetColors.map((_c, i) => i === selectedColorIndex ? color : _c) })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [color, selectedColorIndex, update])

  return (
    <div className={styles.outerContainer}>
      {type === types.BARLINE && renderRow(null,
        <CustomRadio
          labels={COLOR_RADIO_LABELS[type]}
          value={widgetBaseColor1Selection}
          update={() => userUpdate({ ui: { widgetBaseColor1Selection: !widgetBaseColor1Selection } })}
        />
      )}
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
            value={colorRepresentation?.display(color)}
            onBlur={() => {
              setInputError(false)
              setShowInputHelper(false)
            }}
            onChange={(v) => {
              const validated = colord(v)
              const valid = validated.parsed
              if (valid) {
                updateBaseColor(validated.toHex())
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
          data={COLOR_REPRESENTATIONS.map(({ label }) => label)}
          onSelect={v => userUpdate({ ui: { colorRepresentation: COLOR_REPRESENTATIONS.find(({ label }) => label === v) } })}
          value={colorRepresentation.label}
          allowClear={false}
        />
      </div>

      <div className={styles.colorPicker}>
        {
          createElement(colorRepresentation.picker, {
            color: colorRepresentation.set(color),
            onChange: v => updateBaseColor(v),
          })
        }
        <div className={styles.row}>
          {
            presetColors.map((c, i) => (
              <div key={i} className={styles.swatchContainer}>
                <Button
                  className={styles.swatch}
                  style={{ background: c }}
                  onClick={() => {
                    setSelectedColorIndex(i)
                    userUpdate({ genericOptions: { baseColor: { [selectedColor]: c } } })
                  }}
                >
                  <span />
                </Button>
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
