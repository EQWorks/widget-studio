export default (theme) => ({
  warning: { textAlign: 'center', marginTop: theme.spacing(6) },
  content: {
    display: 'flex',
    marginTop: 10,
    width: '100%',
  },
  container: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    overflow: 'auto'
  },
  outerContainer: {
    flexGrow:1
  },
  chart: {
  },
  control: {
    flexGrow: 1,
  },
  get hiddenControl() {
    return {
      ...this.control,
      display: 'none'
    }
  },
  table: {
    backgroundColor: '#fff',
    width:'60%',
  },
  buttonsContainer: {
    flexDirection: 'row'
  },
  modal: {
    display: 'flex',
    justifyContent:'center',
    alignItems:'center'
  }
})
