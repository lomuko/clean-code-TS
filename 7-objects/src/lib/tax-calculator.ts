import { LOCAL_TAXES_TREE } from '../database/config/local-taxes-tree';
import { CountryTaxNode } from '../models/country-tax-node';
import { RegionTaxNode } from '../models/region-tax-node';
import { TaxBaseInfo } from '../models/tax-base-info';

export class TaxCalculator {
  private static readonly decimalPlaces : number = 2;
  private static readonly taxExemptRegion : string = 'St Pierre';
  private static readonly localTaxesTree : CountryTaxNode[] = LOCAL_TAXES_TREE;

  public static calculateTax( taxBaseInfo : TaxBaseInfo ) {
    if ( TaxCalculator.isTaxExempt( taxBaseInfo ) ) {
      return 0;
    } else {
      return TaxCalculator.calculateLocalTax( taxBaseInfo );
    }
  }

  private static isTaxExempt( taxBaseInfo : TaxBaseInfo ) {
    return (
      taxBaseInfo.isATaxFreeProduct === true ||
      taxBaseInfo.isStudent === true ||
      taxBaseInfo.region === TaxCalculator.taxExemptRegion
    );
  }

  private static calculateLocalTax( taxBaseInfo : TaxBaseInfo ) {
    const localTax = TaxCalculator.getLocalVAT( taxBaseInfo );
    const baseTax = ( taxBaseInfo.base * localTax ) / 100;
    const roundedTax = baseTax.toFixed( TaxCalculator.decimalPlaces );
    return Number( roundedTax );
  }

  private static getLocalVAT( taxBaseInfo : TaxBaseInfo ) {
    let countryTaxNode : CountryTaxNode | undefined = TaxCalculator.localTaxesTree.find(
      ( countryTaxNode : CountryTaxNode ) => countryTaxNode.countryName === taxBaseInfo.country
    );
    if ( countryTaxNode !== undefined ) {
      return TaxCalculator.getCountryVAT( countryTaxNode, taxBaseInfo.region );
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
