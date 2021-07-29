export default (theme) => ({
  warning: { textAlign: 'center', marginTop: theme.spacing(6) },
  content: {
    display: 'flex',
    marginTop: 10,
    border: 'solid',
    borderRadius: '1rem',
    padding: '1rem',
    borderWidth: 'thin',
    borderColor: '#d6d6d6',
    flexDirection: 'column',
    height: '60vh'
  },
  container: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    height: '100%',
  },
  outerContainer: {
    height: '90%',
    overflow: 'auto',
  },
  chart: {
    flex: '1 1 0',
    minWidth: 0
  },
  control: {
  },
  table: {
    backgroundColor: '#fff',
  },
  buttonsContainer: {
    height: '10%',
    flexDirection: 'row'
  },
  widgetSelectorContainer: {
    height: '100%',
  },
})
