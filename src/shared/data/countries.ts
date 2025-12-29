// shared/data/countries.ts
export type LocationOption = {
  value: string
  label: string
}

export const COUNTRIES: LocationOption[] = [
  { value: 'US', label: 'United States' },
  { value: 'GB', label: 'United Kingdom' },
  { value: 'DE', label: 'Germany' },
  { value: 'FR', label: 'France' },
  { value: 'RU', label: 'Russia' },
  { value: 'JP', label: 'Japan' },
  { value: 'IT', label: 'Italy' },
  { value: 'ES', label: 'Spain' },
  { value: 'CA', label: 'Canada' },
  { value: 'AU', label: 'Australia' }
]

export const CITIES_BY_COUNTRY: Record<string, LocationOption[]> = {
  US: [
    { value: 'new_york', label: 'New York' },
    { value: 'los_angeles', label: 'Los Angeles' },
    { value: 'chicago', label: 'Chicago' },
    { value: 'houston', label: 'Houston' },
    { value: 'miami', label: 'Miami' }
  ],
  GB: [
    { value: 'london', label: 'London' },
    { value: 'manchester', label: 'Manchester' },
    { value: 'birmingham', label: 'Birmingham' },
    { value: 'liverpool', label: 'Liverpool' },
    { value: 'edinburgh', label: 'Edinburgh' }
  ],
  DE: [
    { value: 'berlin', label: 'Berlin' },
    { value: 'hamburg', label: 'Hamburg' },
    { value: 'munich', label: 'Munich' },
    { value: 'cologne', label: 'Cologne' },
    { value: 'frankfurt', label: 'Frankfurt' }
  ],
  FR: [
    { value: 'paris', label: 'Paris' },
    { value: 'marseille', label: 'Marseille' },
    { value: 'lyon', label: 'Lyon' },
    { value: 'toulouse', label: 'Toulouse' },
    { value: 'nice', label: 'Nice' }
  ],
  RU: [
    { value: 'moscow', label: 'Moscow' },
    { value: 'saint_petersburg', label: 'Saint Petersburg' },
    { value: 'kazan', label: 'Kazan' },
    { value: 'novosibirsk', label: 'Novosibirsk' },
    { value: 'yekaterinburg', label: 'Yekaterinburg' }
  ],
  JP: [
    { value: 'tokyo', label: 'Tokyo' },
    { value: 'yokohama', label: 'Yokohama' },
    { value: 'osaka', label: 'Osaka' },
    { value: 'nagoya', label: 'Nagoya' },
    { value: 'sapporo', label: 'Sapporo' }
  ],
  IT: [
    { value: 'rome', label: 'Rome' },
    { value: 'milan', label: 'Milan' },
    { value: 'naples', label: 'Naples' },
    { value: 'turin', label: 'Turin' },
    { value: 'palermo', label: 'Palermo' }
  ],
  ES: [
    { value: 'madrid', label: 'Madrid' },
    { value: 'barcelona', label: 'Barcelona' },
    { value: 'valencia', label: 'Valencia' },
    { value: 'sevilla', label: 'Sevilla' },
    { value: 'zaragoza', label: 'Zaragoza' }
  ],
  CA: [
    { value: 'toronto', label: 'Toronto' },
    { value: 'montreal', label: 'Montreal' },
    { value: 'vancouver', label: 'Vancouver' },
    { value: 'calgary', label: 'Calgary' },
    { value: 'edmonton', label: 'Edmonton' }
  ],
  AU: [
    { value: 'sydney', label: 'Sydney' },
    { value: 'melbourne', label: 'Melbourne' },
    { value: 'brisbane', label: 'Brisbane' },
    { value: 'perth', label: 'Perth' },
    { value: 'adelaide', label: 'Adelaide' }
  ]
}

export const getCitiesByCountry = (countryCode: string): LocationOption[] => {
  if (!countryCode) return []
  return CITIES_BY_COUNTRY[countryCode] || []
}
