import { DATA_KEY_FORMATTING } from '../constants/data-format'


/**
 * getKeyFormatFunction - returns format function for the given key type
 * @param { numeric } key - numeric key param
 * @returns { function } - formatting function
 */
export const getKeyFormatFunction = (key) => Object.values(DATA_KEY_FORMATTING)
  .find(({ keyList }) => keyList.find(listKey => key.toLowerCase() === listKey || key === listKey))?.formatFunction ||
  DATA_KEY_FORMATTING.numericOthers.formatFunction
