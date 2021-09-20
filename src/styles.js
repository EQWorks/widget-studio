export default {
  widgetTitle: {
    // paddingLeft: '3rem',
    display: 'flex',
    gridColumn: '1 / 3',
    gridRow: '1',
    order: 1,
    background: '#e6e6e6',
    paddingLeft: '1.5rem',
    paddingRight: '1.5rem',
    paddingTop: '0.4rem',
    paddingBottom: '0.4rem',
    borderRadius: '1rem',
    fontWeight: '400',
    alignItems: 'center'
  },
  warning: {
    textAlign: 'center',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  outerContainer: {
    display: 'grid',
    gridTemplateColumns: 'auto 2fr auto',
    gridTemplateRows: 'auto 2fr auto',
    gridGap: '1rem',
    flex: 1,
    border: 'solid',
    borderRadius: '1rem',
    padding: '1rem',
    borderWidth: 'thin',
    borderColor: '#d6d6d6',
    background: '#f7f7f7',
  },
  mainContainer: {
    display: 'flex',
    flexDirection: 'column',
    // height: '100%',
    order: 3,
    flex: '1 1 0',
    minWidth: 0,
    justifyContent: 'center',
    gridRow: 2
  },
  widgetContainer: {
    width: '100%',
    paddingLeft: '1rem',
    paddingRight: '1rem',
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
    borderRadius: '1rem',
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
    borderRadius: '1rem',
    background: '#d6d6d6',
  },
  filterControlsBarTab: {
    display: 'flex',
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    borderRadius: '1rem',
    background: '#d6d6d6',
  },
  filterControlsBarTabText: {
    marginLeft: '1rem',
    flex: 1,
  },
  tallButton: {
    height: '100%',
    width: '100%',
    borderRadius: '1rem'
  },
  wideButton: {
    flex: 1
  },
  navigationSidebar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '1rem',
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
    display: 'flex',
    height: '100%'
  },
  hidden: {
    display: 'none',
  },
  flex: {
    display: 'flex',
  },
  extras: {
    overflow: 'auto',
    flex: 1,
    order: 3
  },
  verticalDivider: {
    marginLeft: '1rem',
    marginRight: '1rem',
  }
}
