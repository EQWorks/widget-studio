// this file should be removed in the future if WidgetManager is to be removed from Widget Studio
import numeral from 'numeral'
import { quickNumericFormat } from '../src/util/numeric'


export const DATA_CATEGORIES = {
  population: [
    'Total Population',
    'Male+ Population',
    'Female+ Population',
  ],
  families: [
    'Lone Parent',
    'Couple - no Children',
    'Couple - with Children',
    'Other',
  ],
  education: [
    'No Education',
    'Secondary Education',
    'Apprenticeship Trades',
    'Degree - Below Bachelor',
    'Degree - Bachelors',
    'Degree - Masters or Higher',
    'highest_education_no_education',
    'highest_education_secondary_education',
    'highest_education_apprenticeship_trades',
    'highest_education_college_uni_below_bachelor',
    'highest_education_uni_bachelor',
    'highest_education_uni_advanced',
  ],
  income: [
    'Average Income',
  ],
  'Vehicle Type': [
    'Sedan', 'Coupe', 'Pickup', 'SUV', 'Wagon', 'Luxury', 'Minivan', 'Hybrid/Electric', 'Not Described',
  ],
  'Vehicle Make': [
    'Acura', 'Alfa Romeo', 'Aston Martin', 'Audi', 'Bentley', 'BMW', 'Bugatti', 'Buick', 'Cadillac',
    'Chevrolet', 'Dodge', 'Ferrari', 'Fiat', 'Ford', 'GMC', 'Honda', 'Hyundai', 'Infiniti', 'Jaguar',
    'Kia', 'Lamborghini', 'Land Rover', 'Lexus', 'Lincoln', 'Lotus', 'Maseratti', 'Mazda',
    'Mercedes Benz', 'Mini', 'Mitsu', 'Nissan', 'Porsche', 'Rolls Royce', 'Subaru', 'Toyota', 'Tesla',
    'Volkswagen', 'Volvo',
  ],
  'Vehicle Age': [
    '<3 Years', '3 Years', '4 Years', '5 Years', '6 Years', '7 Years', '7+ Years',
  ],
  'Share of Visits': [
    'Unique Visitors', 'Repeat Visitors',
  ],
  'Day of Week': [
    'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat',
  ],
  'Local Brands Visitation': [
    'Costco', 'Canadian Superstore', 'Walmart', 'Winners', 'Loblaws', 'Lowes', 'Tim Hortons',
    'Toysrus', 'Gap Inc', 'Home Depot', 'Starbucks', 'The Bay',
  ],
}

export const DATA_KEY_FORMATTING = {
  // this list has to be on top as it has common keys with percentage list
  coxScore: {
    keyList: [
      'Dealer Market Area', 'market_area', "Visitor's Living Area", 'city', 'province', 'country',
    ],
    formatFunction: (val) => numeral(val).format('0.00a'),
  },
  coxNumericA: {
    keyList: [...DATA_CATEGORIES.population],
    formatFunction: quickNumericFormat,
  },
  coxNumericB: {
    keyList: [
      'Submitted Deals', 'Arts Aficionados', 'Health and Beauty',
      'Small Business Owners', 'Readers', 'Car Owner', 'Students', 'Small Business Insights',
      'Online Savvy Shoppers', 'Home Owners', 'Movies Goers', 'Diyers', 'Looking For Love',
      'Big Grocery Spenders', 'Online Cord', 'Big Medical Spenders', 'Sport and Outdoor Enthusiasts',
      'Gamers', 'Big Telco Spenders', 'Value Conscious Shoppers', 'Gamblers', 'Frequent Travellers',
      'Families and Children', 'Early Tech Adopters', 'Fashion Buyers', 'Pet Owners',
      'Fitness Enthusiasts', 'Dining Out',
    ],
    formatFunction: (val) => numeral(val).format('0.00a'),
  },
  coxNumericC: {
    keyList: ['Costco'],
    formatFunction: (val) => numeral(val).format('0,0'),
  },
  coxPercentage: {
    keyList: [
      'Consumer Spending Categories', 'Frequently Transacted Categories',
      ...DATA_CATEGORIES['Vehicle Type'],
      ...DATA_CATEGORIES['Vehicle Make'],
      ...DATA_CATEGORIES['Vehicle Age'],
      'Marketshare of vehicle age', 'OEM Auto Brand', 'dealer', 'dma',
      'hh_income_0_50k', 'hh_income_50_100k', 'hh_income_100_150k', 'hh_income_150_200k', 'hh_income_200k+',
      'Unique Visitors', 'Repeat Visitors', 'Cross Visits',
      'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat',
      '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00',
      'Male+', 'Female+', 'No Education Pct', 'Secondary Education Pct', 'Apprenticeship Trades Pct',
      'Degree - Below Bachelor Pct', 'Degree - Bachelors Pct', 'Degree - Masters or Higher Pct',
    ],
    formatFunction: (val) => numeral(val / 100).format('0.00%'),
  },
  coxCurrency: {
    keyList: ['dealersaleprice', 'dealerreserveprice', 'dmasaleprice', 'dmareserveprice'],
    formatFunction: (val) => numeral(val).format('$0,0'),
  },
}
