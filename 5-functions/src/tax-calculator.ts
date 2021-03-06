export class TaxCalculator {
  private static readonly decimalPlaces = 2;
  private static readonly taxExemptRegion = 'St Pierre';

  public static calculateLine( line : any, country : string, region : string, isStudent : boolean ) {
    return TaxCalculator.calculateTax( line.totalAmount, country, region, isStudent );
  }

  public static calculateTotal( base : number, country : string, region : string, isStudent : boolean ) {
    return TaxCalculator.calculateTax( base, country, region, isStudent );
  }

  private static calculateTax( base : number, country : string, region : string, isStudent : boolean ) {
    if ( TaxCalculator.isTaxExempt( isStudent, region ) ) {
      return 0;
    } else {
      return TaxCalculator.calculateCountryTax( base, country, region );
    }
  }

  private static isTaxExempt( isStudent : boolean, region : string ) {
    return isStudent || region === TaxCalculator.taxExemptRegion;
  }

  private static calculateCountryTax( base : number, country : string, region : string ) {
    const countryVAT = TaxCalculator.getCountryVAT( country, region );
    const baseTax = ( base * countryVAT ) / 100;
    const roundedTax = baseTax.toFixed( TaxCalculator.decimalPlaces );
    return Number( roundedTax );
  }

  private static getCountryVAT( country : string, region : string ) {
    let countryVAT = 0;
    switch ( country ) {
      case 'Spain':
        countryVAT = TaxCalculator.getSpainVAT( region, countryVAT );
        break;
      case 'Portugal':
        countryVAT = TaxCalculator.getPortugalVAT( region, countryVAT );
        break;
      case 'France':
        countryVAT = TaxCalculator.getFranceVAT( countryVAT );
        break;
      default:
        break;
    }
    return countryVAT;
  }

  private static getSpainVAT( region : string, countryVAT : number ) {
    if ( region === 'Canary Islands' ) {
      countryVAT = 7;
    } else {
      countryVAT = 21;
    }
    return countryVAT;
  }

  private static getPortugalVAT( region : string, countryVAT : number ) {
    if ( region === 'Madeira' ) {
      countryVAT = 22;
    } else if ( region === 'Azores' ) {
      countryVAT = 18;
    }
    countryVAT = 23;
    return countryVAT;
  }

  private static getFranceVAT( countryVAT : number ) {
    countryVAT = 20;
    return countryVAT;
  }
}
