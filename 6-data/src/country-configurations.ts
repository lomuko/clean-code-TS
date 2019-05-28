import { CountryConfiguration } from './country-configuration';
export const COUNTRY_CONFIGURATIONS : CountryConfiguration[] = [
  {
    contryName: '*default*',
    thresholdForDiscount: Infinity,
    shippingCost: [
      {
        upTo: 100,
        factor: 0.25,
        plus: 0
      },
      {
        upTo: 1000,
        factor: 0,
        plus: 25
      },
      {
        upTo: Infinity,
        factor: 0,
        plus: 20
      }
    ]
  },
  {
    contryName: 'Spain',
    thresholdForDiscount: 1000,
    shippingCost: [
      {
        upTo: 100,
        factor: 0.1,
        plus: 0
      },
      {
        upTo: 1000,
        factor: 0,
        plus: 10
      },
      {
        upTo: Infinity,
        factor: 0,
        plus: 0
      }
    ]
  },
  {
    contryName: 'Portugal',
    thresholdForDiscount: 3000,
    shippingCost: [
      {
        upTo: 100,
        factor: 0.15,
        plus: 0
      },
      {
        upTo: 1000,
        factor: 0,
        plus: 15
      },
      {
        upTo: Infinity,
        factor: 0,
        plus: 10
      }
    ]
  },
  {
    contryName: 'France',
    thresholdForDiscount: 2000,
    shippingCost: [
      {
        upTo: 100,
        factor: 0.2,
        plus: 0
      },
      {
        upTo: 1000,
        factor: 0,
        plus: 20
      },
      {
        upTo: Infinity,
        factor: 0,
        plus: 15
      }
    ]
  }
];
