export class TaxCalculator {
  private static readonly decimalPlaces = 2;

  private static readonly countryRegionTaxesTree = [
    {
      countryName: 'Spain',
      countryTax: 21,
      regionTaxes: [
        {
          regionName: 'Canary Islands',
          regionTax: 7
        }
      ]
    },
    {
      countryName: 'Portugal',
      countryTax: 23,
      regionTaxes: [
        {
          regionName: 'Madeira',
          regionTax: 22
        },
        {
          regionName: 'Azores',
          regionTax: 18
        }
      ]
    },
    {
      countryName: 'France',
      countryTax: 20,
      regionTaxes: []
    }
  ];

  public static calculateLine( line : any, country : string, region : string, isStudent : boolean ) {
    return TaxCalculator.calculateTax( line.totalAmount, country, region, isStudent );
  }

  public static calculateTotal(
    base : number,
    country : string,
    region : string,
    isStudent : boolean
  ) {
    return TaxCalculator.calculateTax( base, country, region, isStudent );
  }

  private static calculateTax(
    base : number,
    country : string,
    region : string,
    isStudent : boolean
  ) {
    if ( TaxCalculator.isTaxFree( isStudent, region ) ) {
      return 0;
    } else {
      return TaxCalculator.calculateCountryTax( base, country, region );
    }
  }

  private static isTaxFree( isStudent : boolean, region : string ) {
    return isStudent || region === 'St Pierre';
  }

  private static calculateCountryTax( base : number, country : string, region : string ) {
    const countryTax = TaxCalculator.getCountryTax( country, region );
    const baseTax = ( base * countryTax ) / 100;
    const roundedString = baseTax.toFixed( TaxCalculator.decimalPlaces );
    return Number( roundedString );
  }

  private static getCountryTax( countryName : string, regionName : string ) {
    TaxCalculator.countryRegionTaxesTree.forEach( countryRegionTaxNode => {
      if ( countryRegionTaxNode.countryName === countryName ) {
        countryRegionTaxNode.regionTaxes.forEach( regionTaxNode => {
          if ( regionTaxNode.regionName === regionName ) {
            return regionTaxNode.regionTax;
          }
        } );
        return countryRegionTaxNode.countryTax;
      }
    } );

    // const countryTaxes = TaxCalculator.countryRegionTaxesTree.find(
    //   countryRegionTaxNode => countryRegionTaxNode.countryName === countryName
    // );
    // if ( countryTaxes !== undefined ) {
    //   const regionTaxes = countryTaxes.regionTaxes.find(
    //     regionTaxNode => regionTaxNode.regionName === regionName
    //   );
    //   if ( regionTaxes !== undefined ) {
    //     return regionTaxes.regionTax;
    //   } else {
    //     return countryTaxes.countryTax;
    //   }
    // }

    return 0;
  }
}
