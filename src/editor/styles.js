export default {
  container: {
    display: 'flex',
    flexDirection: 'column',
  },
  filterControlsContainer: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    marginLeft: '1rem',
  },
  hidden: {
    opacity: 0,
  },
  loaderContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  controlHeader: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  controlFooter: {
    display: 'flex',
    justifyContent: 'flex-end',
    margin: '1rem',
    flexDirection: 'row',
    justifySelf: 'flex-end',
  },
  controls: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    flex: 1,
  },
  linkedSelectPrimary: {
    flex: '2',
  },
  linkedSelectSub: {
    flex: '1',
  },
  controlDivider: {
    marginTop: '0.5rem',
    marginBottom: '0.5rem',
  },
  filterControls: {
    flex: 1,
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gridGap: '1rem',
    margin: '1rem',
  },
  filterControlCell: {
    display: 'flex',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
}
