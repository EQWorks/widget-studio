export default (theme) => ({
  warning: { textAlign: 'center', marginTop: theme.spacing(6) },
  content: {
    display: 'flex',
    marginTop: 10,
    width: '100%',
    alignItems: 'stretch',
    height: '600px' // test determinate height
  },
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'stretch',
    width: '100%',
    // height: '100%',
    overflow: 'auto'
  },
  chart: {
    // maxHeight: '100%',
    flexGrow: 1,
    // minHeight: 500,
    // margin: '0 16px 16px 0',
    // width: '75%',
    padding: theme.spacing()
  },
  get hiddenChart() {
    return {
      ...this.chart,
      display: 'none'
    }
  },
  control: {
    flexGrow: 1,
    // width: '25%',
    padding: 16
  },
  get hiddenControl() {
    return {
      ...this.control,
      display: 'none'
    }
  },
})