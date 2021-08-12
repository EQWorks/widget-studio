export default {
  container: {
    padding: '2rem',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  title: {
    padding: '1rem'
  },
  dataSelectorContainer: {
    border: 'solid',
    borderRadius: '1rem',
    borderColor: '#d6d6d6'
    // borderWidth: 'thin'
  },
  dataSelector: {
    display: 'flex',
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: '1rem',
    justifyContent: 'center'
  },
  get hiddenDataSelector() {
    return {
      ...this.dataSelector,
      opacity: '0'
    }
  }
}
