import { HotObservableOnce, ColdObservableOnce, Coord } from '../types';
import {SearchResponse, SearchQuery, SearchFacetResponse, PositionFactor} from './types';


export interface SearchAdapter<E = any> {
  clearCache?(): void;
  search(query: SearchQuery): ColdObservableOnce<SearchResponse<E>>;
  searchForFacetValues?(
    facetName: string, facetQuery: string, query?: SearchQuery<E>
  ): ColdObservableOnce<SearchFacetResponse>;
  listByGeolocation?(boundingBox: number[], query?: SearchQuery): ColdObservableOnce<SearchResponse<E>>;
  aroundLatLng?(coord: Coord, query?: SearchQuery): ColdObservableOnce<SearchResponse<E>>;
  get?(idOrIds: string | string[]): ColdObservableOnce<E | E[]>;
  add?(entityOrEntities: E | E[]): HotObservableOnce<string | string[]>;
  update?(entity: Partial<E>): HotObservableOnce<string>;
  update?(entities: Partial<E>[]): HotObservableOnce<string[]>;
  upsert?(entity: E): HotObservableOnce<string>;
  upsert?(entities: E[]): HotObservableOnce<string[]>;
  delete?(idOrIds: string | string[]): HotObservableOnce<any>;
  nearPoistion(position: PositionFactor, query?: SearchQuery<E>): ColdObservableOnce<SearchResponse<E>>
}
