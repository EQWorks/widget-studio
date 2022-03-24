export const mapDataIsValid = ({ dataSample, mapGroupKeyTitle, renderableValueKeys }) => {
  return Boolean(dataSample?.[mapGroupKeyTitle] && renderableValueKeys?.length &&
    renderableValueKeys.every(key => Object.keys(dataSample || {}).includes(key.title)))
}
