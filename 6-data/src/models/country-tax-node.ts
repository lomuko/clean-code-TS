import { RegionTaxNode } from './region-tax-node';
export interface CountryTaxNode {
  countryName : string;
  countryVAT : number;
  regionTaxes : RegionTaxNode[];
}
