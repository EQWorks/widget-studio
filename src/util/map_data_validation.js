export const mapDataIsValid = ({ dataSample, mapGroupKey, renderableValueKeys }) =>
  Boolean(dataSample?.[mapGroupKey] && renderableValueKeys?.length &&
    renderableValueKeys.every(({ key })=> Object.keys(dataSample || {}).includes(key)))
