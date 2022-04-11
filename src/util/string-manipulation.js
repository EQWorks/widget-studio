const STRING_REPLACE_DICT = {
  'pop_male': 'Male',
  'pop_female': 'Female',
  'hh_income_0_50': '0-50k',
  'hh_income_50_100': '50-100k',
  'hh_income_100_150': '100-150k',
  'hh_income_150_200': '150-200k',
  'hh_income_200_over': '200k+',
  'income_sources_market_num': 'Market income',
  'income_sources_gov_transfer_num': 'Gov transfer income',
  'income_sources_employment_num': 'Employment income',
  'income_sources_market_avg': 'Market income',
  'income_sources_gov_transfer_avg': 'Gov transfer income',
  'income_sources_employment_avg': 'Employment income',
  'highest_education_none': 'No education',
  'highest_education_secondary': 'Secondary education',
  'highest_education_apprenticeship_trades': 'Apprenticeship trades',
  'highest_education_college_uni_below_bachelor': 'College uni below bachelor',
  'highest_education_uni_bachelor': 'Uni bachelor',
  'highest_education_uni_advanced': 'Uni advanced',
  'census_fam_lone_parent': 'Lone parent',
  'census_fam_couple_no_children': 'Couple - no children',
  'census_fam_couple_children': 'Couple - children',
  'census_fam_person_not_in_fam': 'Not in fam',
  'hh_tenure_owner': 'Owner',
  'hh_tenure_renter': 'Renter',
  'commute_time_0_15': '0-15 min',
  'commute_time_15_30': '15-30 min',
  'commute_time_30_45': '30-45 min',
  'commute_time_45_60': '45-60 min',
  'commute_time_60_over': '> 60 min',
  'commute_mode_car': 'Car',
  'commute_mode_transit': 'Transit',
  'commute_mode_walk': 'Walk',
  'commute_mode_bike': 'Bike',
  'commute_mode_other': 'Other',
}
export const cleanUp = s => (
  s in STRING_REPLACE_DICT
    ? STRING_REPLACE_DICT[s]
    : s.replace(/_/g, ' ').replace(/./, v => v.toUpperCase())
)
export const getLongestString = arr => arr.reduce((a, b) => (a.length > b.length ? a : b))
export const isString = v => typeof v === 'string' || v instanceof String
