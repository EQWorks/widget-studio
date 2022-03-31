import React, { useEffect, useState, useMemo } from 'react'
import PropTypes from 'prop-types'

import { useQuery } from 'react-query'
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en.json'
import ReactTimeAgo from 'react-time-ago'
import { Icons, Chip, Loader, makeStyles, getTailwindConfigColor } from '@eqworks/lumen-labs'

import Widget from './widget'
import withQueryClient from './util/with-query-client'
import CustomSelect from './components/custom-select'
import CustomButton from './components/custom-button'
import { deleteWidget, api } from './util/api'
import CustomModal from './components/custom-modal'


TimeAgo.setDefaultLocale(en.locale)
TimeAgo.addLocale(en)

const useStyles = ({ widgetPreviewExpanded }) => makeStyles({
  outerContainer: {
    width: '100vw',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    background: getTailwindConfigColor('secondary-100'),
    padding: '1.4rem 1rem',
    borderRadius: '0.2rem',
    display: 'flex',
    alignItems: 'center',
    height: '1rem',
    '> *': {
      marginRight: '0.5rem',
    },
    ':last-child': {
      marginRight: '0 !important',
    },
  },
  headerTitle: {
    color: getTailwindConfigColor('primary-600'),
    fontWeight: 700,
    flex: 1,
    display: 'flex',
  },
  subHeader: {
    margin: '0.75rem',
    marginTop: '0.4rem',
    padding: '0 0.75rem',
    display: 'flex',
    alignItems: 'center',
  },
  subHeaderText: {
    flex: 1,
    fontStyle: 'italic',
    color: getTailwindConfigColor('secondary-600'),
    fontSize: '0.75rem',
  },
  sortControls: {
    display: 'flex',
    height: '100%',
    padding: '1rem',
    ':last-child': {
      marginRight: '0 !important',
    },
  },
  control: {
    marginRight: '1rem',
    alignItems: 'center',
    display: 'flex',
    color: getTailwindConfigColor('secondary-600'),
    fontSize: '0.875rem',
    '> *': {
      marginRight: '0.5rem',
    },
    ':last-child': {
      marginRight: '0 !important',
    },
  },
  widgetCardGrid: {
    padding: '1rem',
    flex: 1,
    width: '100%',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(13rem, 1fr))',
    gridAutoRows: 'min-content',
    gridGap: '1rem',
    overflow: 'auto',
  },
  selectedWidgetCard: {
    borderColor: `${getTailwindConfigColor('primary-500')} !important`,
    borderWidth: '2px !important',
  },
  widgetCard: {
    width: '100%',
    padding: '1rem',
    borderRadius: '1rem',
    borderColor: getTailwindConfigColor('secondary-200'),
    borderWidth: '1px',
    transition: 'all 0.5s',
    '&:hover': {
      background: getTailwindConfigColor('secondary-200'),
    },
    display: 'flex',
    flexDirection: 'column',
  },
  addWidgetCard: {
    justifyContent: 'center',
    alignItems: 'center',
    background: getTailwindConfigColor('secondary-100'),
    '&:hover': {
      background: getTailwindConfigColor('secondary-200'),
    },
  },
  widgetCardImage: {
    background: getTailwindConfigColor('secondary-200'),
    width: '100%',
    height: '100%',
    aspectRatio: 1,
    borderColor: getTailwindConfigColor('secondary-200'),
    borderWidth: '1px',
    borderRadius: '1rem',
    objectFit: 'cover',
    marginRight: '0.5rem',
  },
  widgetCardHeader: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '0.5rem',
  },
  widgetCardTitle: {
    flex: 1,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: 'flex',
    fontWeight: 600,
    alignItems: 'center',
    color: getTailwindConfigColor('secondary-700'),
    fontSize: '0.875rem',
  },
  widgetCardContent: {
    display: 'flex',
  },
  widgetCardDetails: {
    fontSize: '0.65rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'end',
    fontStyle: 'italic',
    color: getTailwindConfigColor('secondary-700'),
    margin: '0.5rem 0',
    '> *': {
      textAlign: 'right',
      marginBottom: '0.5rem',
    },
    ':last-child': {
      marginBottom: '0 !important',
    },
  },
  widgetPreviewContainer: {
    borderColor: getTailwindConfigColor('secondary-200'),
    borderWidth: '1px',
    overflow: 'hidden',
    width: '100%',
  },
  widgetPreviewPrompt: {
    borderRadius: '1rem',
    background: getTailwindConfigColor('secondary-100'),
    color: getTailwindConfigColor('secondary-600'),
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  newWidget: {
    width: '100% !important',
  },
  content: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
  widgetPreviewInnerContainer: {
    width: '100%',
    borderTopLeftRadius: '0.5rem',
    borderTopRightRadius: '0.5rem',
    height: widgetPreviewExpanded ? '30rem' : '2.85rem',
    transition: 'all 0.3s',
    background: getTailwindConfigColor('secondary-50'),
  },
  widgetPreview: {
    height: '2.85rem',
    padding: '1.25rem',
    display: 'flex',
    alignItems: 'center',
    flex: 1,
    fontWeight: 700,
    color: getTailwindConfigColor('secondary-800'),
    border: `1px solid ${getTailwindConfigColor('secondary-300')}`,
    ':not(:first-child)': {
      marginLeft: '0.2rem',
    },
  },
  widgetPreviewTitle: {
    flex: 1,
  },
  widgetPreviewButton: {
    background: `${getTailwindConfigColor('secondary-300')} !important`,
    '& svg': {
      fill: `${getTailwindConfigColor('secondary-800')} !important`,
    },
    '&:hover': {
      '& svg': {
        fill: `${getTailwindConfigColor('secondary-900')} !important`,
      },
      background: `${getTailwindConfigColor('secondary-400')} !important`,
    },
    width: '1.5rem',
    height: '1.5rem',
    fontSize: '1.6rem !important',
    lineHeight: '1.2rem !important',
    fontWeight: 700,
    display: 'flex !important',
    justifyContent: 'center !important',
    alignItems: 'center !important',
  },
})

const SORTING = {
  'Date modified': (a, b) => new Date(a.updated_at) - new Date(b.updated_at),
  'Date created': (a, b) => new Date(a.created_at) - new Date(b.created_at),
  'ID': (a, b) => a.id - b.id,
}

const useWidgets = (wlID, cuID) => {
  const _key = `Get Widgets for ${wlID} and ${cuID}`
  const { isError, error, isLoading, refetch, data = [] } = useQuery(
    _key,
    () => api.get('/widget-studio/widgets', { params: { wlID } }).then(({ data = [] }) => data),
    { manual: true, refetchOnWindowFocus: false }
  )
  useEffect(() => {
    if (isError) {
      console.error(`${_key}: ${error.message}`)
    }
  }, [isError, error, _key])
  return [isLoading, data, refetch]
}


const ListDemo = ({ wl, cu, className }) => {
  const [loading, widgets = [], refetch] = useWidgets(wl, cu)
  const [currentlyViewing, setCurrentlyViewing] = useState(null)
  const [editMode, setEditMode] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [widgetPreviewExpanded, setWidgetPreviewExpanded] = useState(false)
  const [sortDescending, setSortDescending] = useState(true)
  const [sortBy, setSortBy] = useState(Object.keys(SORTING)[0])
  const [newWidget, setNewWidget] = useState()

  const classes = useStyles({ widgetPreviewExpanded })

  const sortedWidgets = useMemo(() => {
    if (widgets?.length) {
      const sorted = widgets?.sort(SORTING[sortBy])
      return sortDescending ? sorted.reverse() : sorted
    }
    return []
  }, [sortBy, sortDescending, widgets])

  const widgetsDescription = useMemo(() => {
    let res = ''
    if (!loading) {
      if (!widgets?.length) {
        res += 'No widgets found'
      } else {
        res += `${widgets.length} widget${widgets.length === 1 ? '' : 's'} found`
      }
      if (wl === -1) {
        res += ' under all whitelabels'
      } else {
        res += ` belonging to whitelabel ${wl}`
        if (cu !== -1) {
          res += `, customer ${cu}`
        }
      }
    }
    return res
  }, [cu, loading, widgets.length, wl])

  const renderWidgets = (
    sortedWidgets.map(w => {
      const { id, created_at, updated_at, config: { title }, snapshot } = w || {}
      return id && (
        <button
          className={`${classes.widgetCard} ${currentlyViewing === id ? classes.selectedWidgetCard : ''}`}
          onClick={() => {
            setCurrentlyViewing(id)
            setWidgetPreviewExpanded(true)
          }}>
          <div className={classes.widgetCardHeader}>
            <h1 className={classes.widgetCardTitle}>{title}</h1>
            {
              editMode &&
              <CustomButton
                variant='outlined'
                type='error'
                onClick={() => {
                  if (deleteConfirm === id) {
                    setDeleteConfirm(null)
                    deleteWidget(id).then(refetch)
                  } else {
                    setDeleteConfirm(id)
                  }
                }}
                onBlur={() => setDeleteConfirm(null)}
              >
                {
                  deleteConfirm === id
                    ? 'SURE?'
                    : <Icons.Trash size='sm' />
                }
              </CustomButton>
            }
          </div>
          <div className={classes.widgetCardContent}>
            <img
              className={classes.widgetCardImage}
              src={snapshot}
            />
            <div className={classes.widgetCardDetails}>
              <Chip selectable={false} color='secondary'>{`ID: ${id}`}</Chip>
              <Chip selectable={false} color='secondary'> Modified <ReactTimeAgo date={new Date(updated_at)} locale='en-US' /> </Chip>
              <Chip selectable={false} color='secondary'>{`Created ${new Date(created_at).toLocaleString()}`}</Chip>
            </div>
          </div>
        </button>
      )
    })
  )

  return (
    <>
      {
        newWidget && (
          <CustomModal
            title='New widget'
            onClose={() => {
              refetch()
              setNewWidget(false)
            }}
          >
            <Widget
              className={classes.newWidget}
              mode='editor'
              wl={wl}
              cu={cu}
            />
          </CustomModal>
        )
      }
      <div className={`${classes.outerContainer} ${className}`}>
        <div className={classes.header}>
          <div className={classes.headerTitle}>
            Available widgets
          </div>
          <div className={classes.sortControls}>
            <div className={classes.control}>
              <div>
                Sort by
              </div>
              <CustomSelect
                data={Object.keys(SORTING)}
                value={sortBy}
                onSelect={setSortBy}
              />
            </div>
            <div className={classes.control}>
              <CustomButton
                variant='elevated'
                type="secondary"
                onClick={() => setSortDescending(!sortDescending)}
              >
                {sortDescending
                  ? <Icons.ArrowDown size='md' />
                  : <Icons.ArrowUp size='md' />}
              </CustomButton>
            </div>
          </div>
        </div>
        <div className={classes.subHeader}>
          <div className={classes.subHeaderText}>
            {widgetsDescription}
          </div>
          <CustomButton
            horizontalMargin
            disabled={loading}
            variant='outlined'
            onClick={refetch}
            endIcon={<Icons.Cycle size='sm' />}
          >
            REFRESH
          </CustomButton>
          <CustomButton
            disabled={!widgets?.length}
            variant='outlined'
            type={editMode ? 'error' : 'primary'}
            onClick={() => setEditMode(!editMode)}
            endIcon={<Icons.Edit size='sm' />}
          >
            {editMode ? 'DONE' : 'EDIT'}
          </CustomButton>
        </div>
        <div className={classes.content}>
          <div className={classes.widgetPreviewContainer}>
            <div
              className={classes.widgetPreviewInnerContainer}
            >
              <div className={classes.widgetPreview}>
                <span className={classes.widgetPreviewTitle}>
                  Widget Preview
                </span>
                <CustomButton
                  classes={{
                    button: classes.widgetPreviewButton,
                  }}
                  type='secondary'
                  onClick={() => setWidgetPreviewExpanded(!widgetPreviewExpanded)}
                >
                  {
                    widgetPreviewExpanded
                      ? <Icons.Remove size='sm' />
                      : <Icons.Add size='sm' />
                  }
                </CustomButton>
              </div>
              {
                currentlyViewing
                  ? <Widget
                    key={currentlyViewing}
                    id={currentlyViewing}
                    mode='view_only'
                  />
                  : <div className={classes.widgetPreviewPrompt} >
                    Select a widget to view it.
                  </div>
              }
            </div>
          </div>
          <div className={classes.widgetCardGrid}>
            {
              loading
                ? <Loader open backdrop />
                : <>
                  {renderWidgets}
                  <button
                    className={`${classes.widgetCard} ${classes.addWidgetCard}`}
                    onClick={() => setNewWidget(true)}>
                    <Icons.Add size='lg' />
                  </button>
                </>
            }
          </div>
        </div>
      </div>
    </>
  )
}

ListDemo.propTypes = {
  wl: PropTypes.number,
  cu: PropTypes.number,
  className: PropTypes.string,
}
ListDemo.defaultProps = {
  wl: -1,
  cu: -1,
  className: '',
}


export default withQueryClient(ListDemo)
