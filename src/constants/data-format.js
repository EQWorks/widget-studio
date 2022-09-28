import numeral from 'numeral'
import { quickNumericFormat } from '../util/numeric'
import { DATA_CATEGORIES } from './insights-data-categories'


export const DATA_KEY_FORMATTING = {
  // this list has to be on top as it has common keys with percentage list
  coxNumericA: {
    keyList: ['Dealer Market Area', 'Submitted Deals'],
    formatFunction: val => numeral(val).format('0.00a'),
  },
  coxNumericB: {
    keyList: ['Costco'],
    formatFunction: val => numeral(val).format('0,0'),
  },
  currency : {
    keyList: [
      'cost', 'spend', 'revenue', 'dealersaleprice', 'dealerreserveprice', 'dmasaleprice',
      'dmareserveprice',
    ],
    formatFunction: val => numeral(val).format('$0,0.00'),
  },
  percentage: {
    keyList: ['rate', 'Rate', 'ctr',
      ...DATA_CATEGORIES['Vehicle Type'],
      ...DATA_CATEGORIES['Vehicle Make'],
      ...DATA_CATEGORIES['Vehicle Age'],
      'Marketshare of vehicle age', 'OEM Auto Brand', 'Trend Difference', 'dealer', 'dma',
      'hh_income_0_50k', 'hh_income_50_100k', 'hh_income_100_150k', 'hh_income_150_200k', 'hh_income_200k+',
      'Unique Visitors', 'Repeat Visitors', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat',
      '9am', '10am', '11am', '12pm', '1pm', '2pm', '3pm', '4pm', '5pm', '6pm', '7pm',
    ],
    formatFunction: val => numeral(val/100).format('0.00%'),
  },
  coxNumericC: {
    keyList: [
      "Visitor's Living Area", 'City', 'city', 'Province', 'province', 'Country', 'country',
      'arts_aficionados', 'health_and_beauty', 'small_business_owners', 'readers', 'car_owner',
      'students', 'small_business_insights', 'online_savvy_shoppers', 'home_owners', 'movies_goers',
      'diyers', 'looking_for_love', 'big_grocery_spenders', 'online_cord', 'big_medical_spenders', 'sport_and_outdoor_enthusiasts', 'gamers', 'big_telco_spenders', 'value_conscious_shoppers',
      'gamblers', 'frequent_travellers', 'families_and_children', 'early_tech_adopters',
      'fashion_buyers', 'pet_owners', 'fitness_enthusiasts', 'dining_out',
    ],
    formatFunction: val => numeral(val).format('0.00a'),
  },
  money: {
    keyList: ['income'],
    formatFunction: val => numeral(val).format('$0,0'),
  },
  numericOthers: {
    keyList: [],
    formatFunction: quickNumericFormat,
  },
}
