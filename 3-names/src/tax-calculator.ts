export class TaxCalculator {
  private static readonly decimalPlaces = 2;
  private static readonly taxExemptRegion = 'St Pierre';

  public static calculateLine( line : any, country : string, region : string, isStudent : boolean ) {
    return isStudent || region === TaxCalculator.taxExemptRegion
      ? 0
      : Number(
          ( ( line.totalAmount * TaxCalculator.getCountryVAT( country, region ) ) / 100 ).toFixed(
            TaxCalculator.decimalPlaces
          )
        );
  }

  public static calculateTotal(
    base : number,
    country : string,
    region : string,
    isStudent : boolean
  ) {
    return isStudent || region === TaxCalculator.taxExemptRegion
      ? 0
      : Number(
          ( ( base * TaxCalculator.getCountryVAT( country, region ) ) / 100 ).toFixed(
            TaxCalculator.decimalPlaces
          )
        );
  }

  private static getCountryVAT( country : string, region : string ) {
    let countryVAT = 0;
    switch ( country ) {
      case 'Spain':
        if ( region === 'Canary Islands' ) {
          countryVAT = 7;
        } else {
          countryVAT = 21;
        }
        break;
      case 'Portugal':
        if ( region === 'Madeira' ) {
          countryVAT = 22;
        } else if ( region === 'Azores' ) {
          countryVAT = 18;
        }
        countryVAT = 23;
        break;
      case 'France':
        countryVAT = 20;
        break;
      default:
        break;
    }
    return countryVAT;
  }
}
