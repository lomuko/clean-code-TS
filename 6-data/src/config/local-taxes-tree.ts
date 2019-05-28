import { CountryTaxNode } from '../models/country-tax-node';

export const LOCAL_TAXES_TREE : CountryTaxNode[] = [
  {
    countryName: 'Spain',
    countryVAT: 21,
    regionTaxes: [
      {
        regionName: 'Canary Islands',
        regionVAT: 7
      }
    ]
  },
  {
    countryName: 'Portugal',
    countryVAT: 23,
    regionTaxes: [
      {
        regionName: 'Madeira',
        regionVAT: 22
      },
      {
        regionName: 'Azores',
        regionVAT: 18
      }
    ]
  },
  {
    countryName: 'France',
    countryVAT: 20,
    regionTaxes: []
  }
];
