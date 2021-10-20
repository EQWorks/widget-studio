export default {
  widgetTitleBarItem: {
    marginRight: '1rem'
  },
  widgetTitleBar: {
    width: '100%',
    display: 'flex',
    gridColumn: '1 / 3',
    gridRow: '1',
    order: 1,
    background: '#e6e6e6',
    paddingLeft: '1.5rem',
    paddingRight: '1.5rem',
    paddingTop: '0.4rem',
    paddingBottom: '0.4rem',
    fontWeight: '400',
    borderTopLeftRadius: '1rem',
    alignItems: 'center'
  },
  warningContainer: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column'
  },
  loader: {
    margin: '1rem'
  },
  outerContainer: {
    maxWidth: '100%',
    width: '100%',
    height: '100%',
    display: 'grid',
    gridTemplateColumns: 'auto 1fr min-content',
    gridTemplateRows: 'auto 2fr auto',
    flex: 1,
    border: 'solid',
    borderRadius: '1rem',
    padding: '1rem',
    borderWidth: 'thin',
    borderColor: '#d6d6d6',
    background: '#f7f7f7',
    overflow: 'auto'
  },
  get outerContainerViewMode() {
    return {
      ...this.outerContainer,
      gridTemplateColumns: '1fr',
      gridTemplateRows: 'min-content auto',
    }
  },
  get outerContainerQLMode() {
    return {
      ...this.outerContainer,
      gridTemplateColumns: '1fr',
      gridTemplateRows: 'min-content 1fr',
    }
  },
  mainContainer: {
    display: 'flex',
    flexDirection: 'column',
    order: 3,
    flex: '1 1 0',
    minWidth: 0,
    gridRow: 2,
    overflow: 'auto'
  },
  table: {
    flex: 0,
    maxHeight: 0
  },
  widgetContainer: {
    display: 'flex',
    alignItems: 'center',
    flex: 1
  },
  widgetControlsSidebar: {
    display: 'flex',
    borderRadius: '1rem',
    background: '#e6e6e6',
    order: 4,
    gridRow: '1 / 4',
    gridColumn: 3
  },
  filterControlsBar: {
    display: 'flex',
    borderBottomLeftRadius: '1rem',
    flex: '1',
    flexDirection: 'column',
    alignContent: 'stretch',
    background: '#e6e6e6',
    order: 6,
    gridColumn: '1 / 3',
  },
  widgetControlsSidebarTab: {
    display: 'flex',
    alignItems: 'center',
    background: '#d6d6d6',
    borderTopRightRadius: '1rem',
    borderBottomRightRadius: '1rem',
  },
  filterControlsBarTab: {
    display: 'flex',
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    background: '#d6d6d6',
    borderBottomLeftRadius: '1rem',
  },
  filterControlsBarTabText: {
    marginLeft: '1rem',
    flex: 1,
  },
  tallButton: {
    height: '100%',
    width: '100%',
  },
  wideButton: {
    flex: 1
  },
  navigationSidebar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#e6e6e6',
    flexDirection: 'column',
    '& button': {
      marginLeft: '0.5rem',
      marginRight: '0.5rem'
    },
    order: 2,
    gridRow: 2
  },
  dataControlsAlt: {
    gridRow: 2,
    order: 2,
    display: 'flex',
    flex: 1
  },
  hidden: {
    display: 'none',
  },
  flex: {
    display: 'flex',
  },
  verticalDivider: {
    marginLeft: '1rem',
    marginRight: '1rem',
  }
}
