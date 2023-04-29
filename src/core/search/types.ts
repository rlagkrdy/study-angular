import { DbSort } from '../db/types';


export interface SearchEntity {
  objectID: string;
  createdAt: number;
  modifiedAt: number;
  deletedAt?: number;
}

export interface SearchResponse<E> {
  hits: E[];
  totalCount: number;
  count: number;
  page: number;
  perPage: number;
}

export interface SearchQuery<E = any> {
  query?: string;
  filters?: SearchFilter<E>[];
  sorts?: DbSort<E>[];
  page?: number;
  limit?: number;
  perPage?: number;
}

export interface SearchFilter<E = any> {
  field?: SearchField<E>;
  comparison?: SearchFilterComparison;
  logical?: 'and' | 'or';
  value?: any;
  parenthesis?: 'start' | 'end';
  lowerValue?: number;
  higherValue?: number;
}

export type SearchField<E> = keyof E & string;

export type SearchFilterComparison = '>' | '>=' | '==' | '<=' | '<' | '!=' | 'text';

export interface SearchFacetResponse {
  exhaustiveFacetsCount: boolean;
  facetHits: SearchFacetHit[];
  processingTimeMS?: number;
}

export interface SearchFacetHit {
  value: string;
  highlighted: string;
  count: number;
}

export interface PositionFactor {
  latitude: number;
  longitude: number;
  radius?: number
}