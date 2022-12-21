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
  // this list has to be above currency which contains spend & it would be picked up first for formatting
  coxPercentage: {
    keyList: ['Consumer Spending Categories', 'Frequently Transacted Categories'],
    formatFunction: val => numeral(val/100).format('0.00%'),
  },
  currency : {
    keyList: [
      'cost', 'spend', 'revenue', 'dealersaleprice', 'dealerreserveprice', 'dmasaleprice',
      'dmareserveprice',
    ],
    formatFunction: val => numeral(val).format('$0,0'),
  },
  percentage: {
    keyList: ['rate', 'Rate', 'ctr',
      ...DATA_CATEGORIES['Vehicle Type'],
      ...DATA_CATEGORIES['Vehicle Make'],
      ...DATA_CATEGORIES['Vehicle Age'],
      'Marketshare of vehicle age', 'OEM Auto Brand', 'dealer', 'dma',
      'hh_income_0_50k', 'hh_income_50_100k', 'hh_income_100_150k', 'hh_income_150_200k', 'hh_income_200k+',
      'Unique Visitors', 'Repeat Visitors', 'Cross Visits', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat',
      '9am', '10am', '11am', '12pm', '1pm', '2pm', '3pm', '4pm', '5pm', '6pm', '7pm',
    ],
    formatFunction: val => numeral(val/100).format('0.00%'),
  },
  coxNumericC: {
    keyList: [
      "Visitor's Living Area", 'City', 'city', 'Province', 'province', 'Country', 'country',
      'Arts Aficionados', 'Health and Beauty', 'Small Business Owners', 'Readers', 'Car Owner',
      'Students', 'Small Business Insights', 'Online Savvy Shoppers', 'Home Owners', 'Movies Goers',
      'Diyers', 'Looking For Love', 'Big Grocery Spenders', 'Online Cord', 'Big Medical Spenders', 'Sport and Outdoor Enthusiasts', 'Gamers', 'Big Telco Spenders', 'Value Conscious Shoppers',
      'Gamblers', 'Frequent Travellers', 'Families and Children', 'Early Tech Adopters',
      'Fashion Buyers', 'Pet Owners', 'Fitness Enthusiasts', 'Dining Out',
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
