export const DATA_CATEGORIES = {
  families: [
    'census_fam_lone_parent',
    'census_fam_couple_with_no_children',
    'census_fam_couple_with_children',
    'census_fam_person_not_in_census_family',
  ],
  education: [
    'no_education',
    'secondary_education',
    'apprenticeship_trades',
    'college_uni_below_bachelor',
    'uni_bachelor',
    'uni_advanced',
  ],
}

export const DATA_CATEGORIES_KEYS = Object.keys(DATA_CATEGORIES)

export const DATA_CATEGORIES_VALUES = Object.values(DATA_CATEGORIES).flat()
