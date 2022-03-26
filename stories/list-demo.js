import React, { useEffect, useState, useMemo } from 'react'
import PropTypes from 'prop-types'
import { ReactQueryDevtools } from 'react-query/devtools'

import { useQuery } from 'react-query'
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en.json'
import ReactTimeAgo from 'react-time-ago'
import { Icons, Chip, Loader, makeStyles, getTailwindConfigColor } from '@eqworks/lumen-labs'

import Widget from '../src'
import withQueryClient from '../src/util/with-query-client'
import CustomSelect from '../src/components/custom-select'
import CustomButton from '../src/components/custom-button'
import { deleteWidget, api, createWidget } from '../src/util/fetch'


TimeAgo.setDefaultLocale(en.locale)
TimeAgo.addLocale(en)

const classes = makeStyles({
  outerContainer: {
    width: '100vw',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    background: getTailwindConfigColor('secondary-100'),
    padding: '1rem',
    borderRadius: '1rem',
    display: 'flex',
    alignItems: 'center',
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
    background: getTailwindConfigColor('secondary-50'),
    display: 'flex',
    padding: '0.5rem 0.75rem',
    borderRadius: '0.5rem',
    borderWidth: '1px',
    borderColor: getTailwindConfigColor('secondary-400'),
    '> *': {
      marginRight: '0.5rem',
    },
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
  widgetCardGridContainer: {
    padding: '1rem',
    flex: 1,
    display: 'flex',
    maxHeight: '60%',
    flexDirection: 'column',
  },
  widgetCardGrid: {
    padding: '1rem',
    flex: 1,
    width: '100%',
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
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
    height: '100%',
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
  openWidgetContainer: {
    minHeight: '40%',
    padding: '1rem',
  },
  openWidgetPrompt: {
    borderRadius: '1rem',
    background: getTailwindConfigColor('secondary-100'),
    color: getTailwindConfigColor('secondary-600'),
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  newWidget: {
    width: '100%',
  },
})

const SORTING = {
  'Date created': (a, b) => new Date(a.created_at) - new Date(b.created_at),
  'Date modified': (a, b) => new Date(a.updated_at) - new Date(b.updated_at),
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


const ListDemo = ({ wl, cu }) => {
  const [loading, widgets = [], refetch] = useWidgets(wl, cu)
  const [currentlyViewing, setCurrentlyViewing] = useState(null)
  const [editMode, setEditMode] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  const [sortBy, setSortBy] = useState(Object.keys(SORTING)[0])
  const [sortDescending, setSortDescending] = useState(false)

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
          onClick={() => setCurrentlyViewing(id)}>
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
      <ReactQueryDevtools initialIsOpen={false} />
      <div className={classes.outerContainer}>
        <div className={classes.widgetCardGridContainer}>
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
                    ? <Icons.ArrowDown />
                    : <Icons.ArrowUp />}
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
          <div className={classes.widgetCardGrid}>
            {
              loading
                ? <Loader open backdrop />
                : <>
                  {renderWidgets}
                  <button
                    className={`${classes.widgetCard} ${classes.addWidgetCard}`}
                    onClick={() => (
                      createWidget({
                        config: {
                          title: 'Untitled Widget',
                          wl,
                          cu,
                        },
                        whitelabel: wl,
                        customer: cu,
                      }).then(refetch)
                    )}>
                    <Icons.Add size='lg' />
                  </button>
                </>
            }
          </div>
        </div>
        <div className={classes.openWidgetContainer}>
          {
            currentlyViewing
              ? <Widget
                key={currentlyViewing}
                id={currentlyViewing}
                mode='view_only'
              />
              : <div className={classes.openWidgetPrompt} >
                Select a widget to view it.
              </div>
          }
        </div>
      </div>
    </>
  )
}

ListDemo.propTypes = {
  wl: PropTypes.number,
  cu: PropTypes.number,
}
ListDemo.defaultProps = {
  wl: -1,
  cu: -1,
}


export default withQueryClient(ListDemo)
