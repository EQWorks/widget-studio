import numeral from 'numeral'
import { quickNumericFormat } from '../util/numeric'
import { DATA_CATEGORIES } from './insights-data-categories'


export const DATA_KEY_FORMATTING = {

  currency : {
    keyList: ['cost', 'spend', 'revenue'],
    formatFunction: val => numeral(val).format('$0,0.00'),
  },
  money: {
    keyList: ['income'],
    formatFunction: val => numeral(val).format('$0,0'),
  },
  percentage: {
    keyList: ['rate', 'ctr',
      ...DATA_CATEGORIES['Vehicle Type'],
      ...DATA_CATEGORIES['Vehicle Make'],
      ...DATA_CATEGORIES['Vehicle Age'],
      'Marketshare of vehicle age', 'OEM Auto Brand',
      'Dealer Market Area', 'Market area', 'City', 'Province', 'Country', 'Trend Difference',
      'Submitted Deals', 'Avg Submitted Deals in the DMA', 'Approval Rate', 'Avg Approval Rate in the DMA', 'Funding Rate', 'Avg Funding Rate in the DMA', 'dealer', 'dma',
      'hh_income_0_50k', 'hh_income_50_100k', 'hh_income_100_150k', 'hh_income_150_200k', 'hh_income_200k+', 'male', 'female',
    ],
    formatFunction: val => numeral(val/100).format('0.00%'),
  },
  topCox: {
    keyList: [
      'arts_aficionados', 'health_and_beauty', 'small_business_owners', 'readers', 'car_owner', 'students',
      'small_business_insights', 'online_savvy_shoppers', 'home_owners', 'movies_goers', 'diyers',
      'looking_for_love', 'big_grocery_spenders', 'online_cord', 'big_medical_spenders', 'sport_and_outdoor_enthusiasts',
      'gamers', 'big_telco_spenders', 'value_conscious_shoppers', 'gamblers', 'frequent_travellers',
      'families_and_children', 'early_tech_adopters', 'fashion_buyers', 'pet_owners', 'fitness_enthusiasts',
      'dining_out',
    ],
    formatFunction: val => numeral(val / 100).format('%'),
  },
  others: {
    keyList: ['transit', 'approved', 'degree', 'value', 'minivans', 'honda', 'public transit'],
    formatFunction: val => val * 100 + '%',
  },
  distance_others: {
    keyList: ['distance'],
    formatFunction: val =>  val + 'km',
  },
  numericOthers: {
    keyList: [],
    formatFunction: quickNumericFormat,
  },
}
