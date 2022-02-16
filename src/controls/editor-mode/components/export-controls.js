import React, { useEffect, useRef, useState } from 'react'

import { makeStyles, Icons } from '@eqworks/lumen-labs'

import { useStoreActions, useStoreState } from '../../../store'
import CustomSelect from '../../../components/custom-select'
import WidgetControlCard from '../../shared/components/widget-control-card'
import { renderRow } from '../../shared/util'
import CustomButton from '../../../components/custom-button'
import { EXPORT_TYPES } from '../../../constants/export'
import { screenshot } from '../../../util/export'


const classes = makeStyles({
  screenshotDummy: {
    position: 'absolute',
    display: 'none',
  },
})

const ExportControls = () => {
  const update = useStoreActions((actions) => actions.update)
  const title = useStoreState((state) => state.title)
  const exportType = useStoreState((state) => state.ui.exportType)
  const screenshotRef = useStoreState((state) => state.ui.screenshotRef)

  const dummyRef = useRef(null)
  const [image, setImage] = useState(null)
  useEffect(() => {
    if (image) {
      dummyRef?.current?.click()
      setImage(null)
    }
  }, [image])
  return (
    <WidgetControlCard title='Export Options'>
      <a
        ref={dummyRef}
        download={`${title}.${exportType?.extension}`}
        href={image}
        className={classes.screenshotDummy}
      />
      {renderRow(
        null,
        <>
          <CustomSelect
            fullWidth
            allowClear={false}
            value={exportType?.label}
            data={EXPORT_TYPES.map(({ label }) => label)}
            onSelect={v => update({ ui: { exportType: EXPORT_TYPES[EXPORT_TYPES.map(({ label }) => label).indexOf(v)] } })}
          />
          <CustomButton
            variant='filled'
            endIcon={<Icons.DownloadBold size='sm' />}
            onClick={async () => {
              const { mime, extension } = exportType || {}
              mime && extension && setImage(await screenshot(screenshotRef, mime))
            }}
          >
            export
          </CustomButton>
        </>
      )}
    </WidgetControlCard >
  )
}

export default ExportControls
