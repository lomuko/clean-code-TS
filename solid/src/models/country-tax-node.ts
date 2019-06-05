import { LocalTaxnode } from './local-tax-node';
import { RegionTaxNode } from './region-tax-node';
export interface CountryTaxNode extends LocalTaxnode {
  regionTaxes : RegionTaxNode[];
}
