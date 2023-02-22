/**
 * getKeyFormatFunction - returns format function for the given key type
 * @param { numeric } key - numeric key param
 * @param { object } dataFormatObject = object of data formatting functions for data keys
 * @returns { function } - formatting function
 */
export const getKeyFormatFunction = (key, dataFormatObject) =>
  Object.values(dataFormatObject).find(({ keyList }) =>
    keyList.find(listKey => key?.toLowerCase().includes(listKey) || key?.includes(listKey)))
    ?.formatFunction ||
    dataFormatObject.numericOthers.formatFunction ||
    (() => {})
