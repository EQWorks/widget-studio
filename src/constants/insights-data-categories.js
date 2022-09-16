export const DATA_CATEGORIES = {
  population: [
    'pop',
    'pop_male',
    'pop_female',
  ],
  families: [
    'census_fam_lone_parent',
    'census_fam_couple_with_no_children',
    'census_fam_couple_with_children',
    'census_fam_person_not_in_census_family',
  ],
  education: [
    'highest_education_no_education',
    'highest_education_secondary_education',
    'highest_education_apprenticeship_trades',
    'highest_education_college_uni_below_bachelor',
    'highest_education_uni_bachelor',
    'highest_education_uni_advanced',
  ],
  income: [
    'income_sources_total_income_recipients',
    'income_sources_total_income_avg',
  ],
  'Vehicle Type': [
    'Sedan', 'Coupe', 'Pickup', 'SUV', 'Wagon', 'Luxury', 'Minivan',
  ],
  'Vehicle Make': [
    'Acura', 'Alfa Romeo', 'Aston Martin', 'Audi', 'Bentley', 'BMW', 'Bugatti', 'Cadillac', 'Chevrolet',
    'Dodge', 'Ferrari', 'Fiat', 'Ford', 'GMC', 'Honda', 'Hyundai', 'Infiniti', 'Jaguar', 'Kia', 'Lamborghini',
    'Land Rover', 'Lexus', 'Lincoln', 'Lotus', 'Maseratti', 'Mazda', 'Mercedes Benz', 'Mini', 'Mitsu',
    'Nissan', 'Porsche', 'Rolls Royce', 'Subaru', 'Toyota', 'Tesla', 'Volkswagen', 'Volvo',
  ],
  'Vehicle Age': [
    '<3 Years', '3 Years', '4 Years', '5 Years', '6 Years', '7 Years', '7+ Years',
  ],
  'Share of Visits': [
    'Unique Visits', 'Repeat Visits',
  ],
  'Day of Week': [
    'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat',
  ],
  'Local Brands Visitation': [
    'Costco', 'Walmart', 'Loblaws', 'Tim Hortons', 'Gap Inc',
  ],
}

export const DATA_CATEGORIES_KEYS = Object.keys(DATA_CATEGORIES)

export const DATA_CATEGORIES_VALUES = Object.values(DATA_CATEGORIES).flat()
