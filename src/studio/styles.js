export default {
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
    marginTop: 10,
    border: 'solid',
    borderRadius: '1rem',
    padding: '1rem',
    borderWidth: 'thin',
    borderColor: '#d6d6d6',
    background: '#f7f7f7',
    flexDirection: 'column',
    height: '60vh'
  },
  mainContainer: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    height: '100%',
  },
  innerContainer: {
    height: '100%',
    display: 'flex'
  },
  widgetContainer: {
    flex: '1 1 0',
    minWidth: 0
  },
  widgetControlsSidebar: {
    display: 'flex',
    borderRadius: '1rem',
    padding: '1rem',
    background: '#e6e6e6',
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
    height: '100%',
    borderRadius: '1rem',
    background: '#e6e6e6',
    flexDirection: 'column',
    '& button': {
      marginLeft: '0.5rem',
      marginRight: '0.5rem'
    },
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
    overflow: 'auto'
  }
}
