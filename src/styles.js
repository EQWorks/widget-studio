export default {
  widgetTitle: {
    paddingLeft: '3rem',
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
    display: 'flex',
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
    height: '100%',
    order: 2,
    flex: '1 1 0',
    minWidth: 0,
    justifyContent: 'center'
  },
  widgetContainer: {
    width: '100%',
    paddingLeft: '1rem',
    paddingRight: '1rem'
  },
  widgetControlsSidebar: {
    display: 'flex',
    borderRadius: '1rem',
    padding: '1rem',
    background: '#e6e6e6',
    order: 3,
  },
  widgetControlsSidebarTab: {
    display: 'flex',
    alignItems: 'center',
    height: '100%',
    borderRadius: '1rem',
    background: '#d6d6d6',
  },
  tallButton: {
    height: '100%',
    width: '100%',
    borderRadius: '1rem'
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
    order: 1
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
    order: 2
  }
}
