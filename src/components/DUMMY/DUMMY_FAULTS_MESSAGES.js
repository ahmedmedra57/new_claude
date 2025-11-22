export const ELECTRIC_FAULTS_TYPES = [
  'ground fault',
  'ssr fault',
  'thermocouple failure',
  'ssr load exceed',
];

export const GAS_FAULTS_TYPES = [
  'timeout fault',
  'hp/lp fault',
  'thermocouple failure',
  'bms fault',
];

export const GAS_FAULTS_MESSAGES = [
  {
    faultType: 'timeout fault',
    number: [],
    locationPre: 'mbta',
    location: '10914958924155140',
    machine: `100000009e851421`,
    address: 'yard BOSTON, MASSACHUSETTS',
    date: '4:50am - 02/06/2022',
  },
  {
    faultType: 'hp/lp fault',
    number: [],
    locationPre: 'mbta',
    location: '10914958924155140',
    machine: `100000009e851421`,
    address: 'yard BOSTON, MASSACHUSETTS',
    date: '4:50am - 02/06/2022',
  },
  {
    faultType: 'bms fault',
    number: [],
    locationPre: 'mbta',
    location: '10914958924155140',
    machine: `100000009e851421`,
    address: 'yard BOSTON, MASSACHUSETTS',
    date: '4:50am - 02/06/2022',
  },
];

export const ELECTRIC_FAULTS_MESSAGES = [
  {
    faultType: 'ground fault',
    number: [],
    locationPre: 'mbta',
    location: '8dc4af98-b278-4f47-824a-5c1a5012482a',
    machine: `100000006c927bd9`,
    address: 'yard BOSTON, MASSACHUSETTS',
    date: '4:50am - 02/06/2022',
  },
  {
    faultType: 'thermocouple failure',
    number: [3, 4],
    locationPre: 'mbta',
    location: '8dc4af98-b278-4f47-824a-5c1a5012482a',
    machine: '100000006c927bd9',
    address: 'yard BOSTON, MASSACHUSETTS',
    date: '4:50am - 02/06/2022',
  },
  {
    faultType: 'ssr fault',
    number: [1],
    locationPre: 'mbta',
    location: '8dc4af98-b278-4f47-824a-5c1a5012482a',
    machine: '100000006c927bd9',
    address: 'yard BOSTON, MASSACHUSETTS',
    date: '4:50am - 02/06/2022',
  },
  {
    faultType: 'ssr load exceed',
    number: [1, 2, 3, 4, 5, 6, 7, 8],
    locationPre: 'mbta',
    location: '8dc4af98-b278-4f47-824a-5c1a5012482a',
    machine: `100000006c927bd9`,
    address: 'yard BOSTON, MASSACHUSETTS',
    date: '4:50am - 02/06/2022',
  },
];

export const TES_FAULTS_MESSAGES = [
  {
    faultType: 'ground fault',
    number: [],
    locationPre: 'mbta',
    location: '10914958924155140',
    machine: `100000009e851421`,
    address: 'yard BOSTON, MASSACHUSETTS',
    date: '4:50am - 02/06/2022',
  },
  {
    faultType: 'thermocouple failure',
    number: [3, 4],
    locationPre: 'mbta',
    location: '10914958924155140',
    machine: '100000009e851421',
    address: 'yard BOSTON, MASSACHUSETTS',
    date: '4:50am - 02/06/2022',
  },
  {
    faultType: 'ssr load exceed',
    number: [1, 2, 3, 4, 5, 6, 7, 8],
    locationPre: 'mbta',
    location: '10914958924155140',
    machine: `100000009e851421`,
    address: 'yard BOSTON, MASSACHUSETTS',
    date: '4:50am - 02/06/2022',
  },
  {
    faultType: 'ssr fault',
    number: [1],
    locationPre: 'mbta',
    location: '10914958924155140',
    machine: '100000009e851421',
    address: 'yard BOSTON, MASSACHUSETTS',
    date: '4:50am - 02/06/2022',
  },
];
