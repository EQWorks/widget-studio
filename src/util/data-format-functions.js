import { DATA_KEY_FORMATTING } from '../constants/data-format'


/**
 * getKeyFormatFunction - returns format function for the given key type
 * @param { numeric } key - numeric key param
 * @returns { function } - formatting function
 */
export const getKeyFormatFunction = (key) => {
  const dataType = Object.keys(DATA_KEY_FORMATTING)
    .find(dataType => DATA_KEY_FORMATTING[dataType].keyList.find(listKey =>
      key.toLowerCase().includes(listKey)))
  return dataType ?
    DATA_KEY_FORMATTING[dataType].formatFunction :
    DATA_KEY_FORMATTING.numericOthers.formatFunction
}
