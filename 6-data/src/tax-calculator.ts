import { CountryTaxNode } from './country-tax-node';
import { LOCAL_TAXES_TREE } from './local-taxes-tree';
import { RegionTaxNode } from './region-tax-node';

export class TaxCalculator {
  private static readonly decimalPlaces = 2;
  private static readonly taxExemptRegion = 'St Pierre';
  private static readonly localTaxesTree : CountryTaxNode[] = LOCAL_TAXES_TREE;

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
      return TaxCalculator.calculateLocalTax( base, country, region );
    }
  }

  private static isTaxExempt( isStudent : boolean, region : string ) {
    return isStudent || region === TaxCalculator.taxExemptRegion;
  }

  private static calculateLocalTax( base : number, country : string, region : string ) {
    const localTax = TaxCalculator.getLocalVAT( country, region );
    const baseTax = ( base * localTax ) / 100;
    const roundedTax = baseTax.toFixed( TaxCalculator.decimalPlaces );
    return Number( roundedTax );
  }

  private static getLocalVAT( countryName : string, regionName : string ) {
    let countryTaxNode : CountryTaxNode | undefined = TaxCalculator.localTaxesTree.find(
      ( countryTaxNode : CountryTaxNode ) => countryTaxNode.countryName === countryName
    );
    if ( countryTaxNode !== undefined ) {
      return TaxCalculator.getCountryVAT( countryTaxNode, regionName );
    } else {
      return 0;
    }
  }

  private static getCountryVAT( countryTaxNode : CountryTaxNode, regionName : string ) {
    let regionTaxNode : RegionTaxNode | undefined = countryTaxNode.regionTaxes.find(
      ( regionTaxNode : RegionTaxNode ) => regionTaxNode.regionName === regionName
    );
    if ( regionTaxNode !== undefined ) {
      return regionTaxNode.regionVAT;
    } else {
      return countryTaxNode.countryVAT;
    }
  }
}
