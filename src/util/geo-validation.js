import { CENSUS_REGEX } from '../constants/map'


export const latIsValid = (lat) => !Number.isNaN(lat) && lat >=-90 && lat <= 90

export const lonIsValid = (lon) => !Number.isNaN(lon) && lon >=-180 && lon <= 180

export const geoKeyIsValid = ({ geoKey, d }) => d.match(CENSUS_REGEX[geoKey])
