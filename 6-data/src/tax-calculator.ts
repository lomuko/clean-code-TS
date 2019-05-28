import { LOCAL_TAXES_TREE } from './config/local-taxes-tree';
import { CountryTaxNode } from './models/country-tax-node';
import { RegionTaxNode } from './models/region-tax-node';
import { TaxBaseInfo } from './models/tax-base-info';

export class TaxCalculator {
  private static readonly decimalPlaces = 2;
  private static readonly taxExemptRegion = 'St Pierre';
  private static readonly localTaxesTree : CountryTaxNode[] = LOCAL_TAXES_TREE;

  public static calculateTax( taxBaseInfo : TaxBaseInfo ) {
    if ( TaxCalculator.isTaxExempt( taxBaseInfo.isStudent, taxBaseInfo.region ) ) {
      return 0;
    } else {
      return TaxCalculator.calculateLocalTax( taxBaseInfo.base, taxBaseInfo.country, taxBaseInfo.region );
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
