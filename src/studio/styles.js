export default {
  warning: {
    textAlign: 'center',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  content: {
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
  container: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    height: '100%',
  },
  get hiddenContainer() {
    return {
      ...this.container,
      display: 'none'
    }
  },
  outerContainer: {
    height: '100%',
    display: 'flex'
  },
  chart: {
    flex: '1 1 0',
    minWidth: 0
  },
  control: {
    display: 'flex',
    borderRadius: '1rem',
    padding: '1rem',
    background: '#e6e6e6',
  },
  controlTab: {
    display: 'flex',
    alignItems: 'center',
    height: '100%',
    borderRadius: '1rem',
    background: '#d6d6d6',
  },
  table: {
    // backgroundColor: '#fff',
  },
  tallButton: {
    height: '100%',
    width: '100%',
    borderRadius: '1rem'
  },
  buttonsContainer: {
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
  widgetSelectorContainer: {
    height: '100%',
  },
  alternateView: {
    display: 'flex',
    height: '100%'
  },
  get hiddenAlternateView() {
    return {
      ...this.alternateView,
      display: 'none'
    }
  }
}
