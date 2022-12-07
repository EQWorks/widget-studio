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

export const DATA_CATEGORIES_KEYS = Object.keys(DATA_CATEGORIES)

export const DATA_CATEGORIES_VALUES = Object.values(DATA_CATEGORIES).flat()
