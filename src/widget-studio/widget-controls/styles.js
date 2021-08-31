export default {
  container: {
    flexDirection: 'column',
    marginLeft: '1rem'
  },
  controlContainer: {
  },
  get hiddenControlContainer() {
    return {
      ...this.controlContainer,
      opacity: 0
    }
  },
  loaderContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%'
  },
  controlHeader: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
}
