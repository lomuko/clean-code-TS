export class TaxCalculator {
  private static readonly decimalPlaces = 2;

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
    return baseTax.toFixed( TaxCalculator.decimalPlaces );
  }

  private static getCountryTax( country : string, region : string ) {
    let countryTax = 0;
    switch ( country ) {
      case 'Spain':
        if ( region === 'Canary Islands' ) {
          countryTax = 7;
        } else {
          countryTax = 21;
        }
        break;
      case 'Portugal':
        if ( region === 'Madeira' ) {
          countryTax = 22;
        } else if ( region === 'Azores' ) {
          countryTax = 18;
        }
        countryTax = 23;
        break;
      case 'France':
        countryTax = 20;
        break;
      default:
        break;
    }
    return countryTax;
  }
}
