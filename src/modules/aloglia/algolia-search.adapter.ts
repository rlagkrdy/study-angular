import { from } from 'rxjs';
import { map } from 'rxjs/operators';
import { SearchAdapter } from '../../core/search/search.adapter';
import {PositionFactor, SearchFacetResponse, SearchQuery, SearchResponse} from '../../core/search/types';
import { HotObservableOnce, ColdObservableOnce } from '../../core/types';
import * as algoliasearch from 'algoliasearch';


export class AlgoliaSearchAdapter<E extends { objectID?: string, id?: string } = any> implements SearchAdapter<E> {
  index: algoliasearch.SearchIndex = this.client.initIndex(this.name);

  constructor(
      private client: algoliasearch.SearchClient,
      private name: string,
      private dateFields?: string[]
  ) {}

  clearCache(): void {
    this.client.clearCache();
  }

  search(query: SearchQuery<E>): ColdObservableOnce<SearchResponse<E>> {
    return from(this.index.search(query.query, this.convertQueryToFilters(query))).pipe(
        map(this.makeSearchResponse.bind(this))
    );
  }

  nearPoistion(position: PositionFactor, query?: SearchQuery<E>): ColdObservableOnce<SearchResponse<E>>{

    let positionFilters = {
      aroundLatLng:position.latitude + ', ' +position.longitude
    }
    if(position.radius){
      positionFilters = {
        aroundLatLng:position.latitude + ', ' +position.longitude,
        aroundRadius: position.radius
      } as any
    }
    return from( this.index.search(query.query ,positionFilters)).pipe(
        map(this.makeSearchResponse.bind(this))
    );
  }


  listByGeolocation(boundingBox: number[], query?: SearchQuery): ColdObservableOnce<SearchResponse<E>> {
    return from(this.index.search(
        ''
        ,
        {
          ...this.convertQueryToFilters(query),
          insideBoundingBox: [boundingBox]
        }
    )).pipe(
        map(this.makeSearchResponse.bind(this))
    );
  }

  searchForFacetValues(
      facetName: string, facetQuery: string, query: SearchQuery<E> = {}
  ): ColdObservableOnce<SearchFacetResponse> {
    return from(
        this.index.searchForFacetValues(
            facetName,
            facetQuery,
            { ...this.convertQueryToFilters(query) }
        )
    );
  }

  get(idOrIds: string | string[]): ColdObservableOnce<E | E[]> {
    if (Array.isArray(idOrIds)) {
      return from(this.index.getObjects(idOrIds)).pipe(
          map(response => response.results.map(hit => this.convertHitToEntity(hit)) as E[])
      );
    } else {
      return from(this.index.getObject(idOrIds)).pipe(
          map(hit => this.convertHitToEntity(hit))
      ) as ColdObservableOnce<E>;
    }
  }

  add(entityOrEntities: E | E[]): HotObservableOnce<string | string[]> {
    if (Array.isArray(entityOrEntities)) {
      return from(this.index.saveObjects(entityOrEntities)).pipe(
          map(response => [...response.objectIDs])
      );
    } else {
      return from(this.index.saveObject(entityOrEntities)).pipe(map(response => response.objectID));
    }
  }

  update(entity: Partial<E>): HotObservableOnce<string>;
  update(entities: Partial<E>[]): HotObservableOnce<string[]>;
  update(entityOrEntities: Partial<E> | Partial<E>[]): HotObservableOnce<string | string[]> {
    if (Array.isArray(entityOrEntities)) {
      return from(this.index.partialUpdateObjects(entityOrEntities)).pipe(
          map(response => (response as any).objectIDs)
      );
    } else {
      return from(this.index.partialUpdateObject(entityOrEntities)).pipe(
          map(response => response.objectID)
      );
    }
  }

  upsert(entity: E): HotObservableOnce<string>;
  upsert(entities: E[]): HotObservableOnce<string[]>;
  upsert(entityOrEntities: Partial<E> | Partial<E>[]): HotObservableOnce<string | string[]> {
    if (Array.isArray(entityOrEntities)) {
      return from(this.index.saveObjects(entityOrEntities)).pipe(
          map(response => (response as any).objectIDs)
      );
    } else {
      return from(this.index.saveObject(entityOrEntities)).pipe(
          map(response => response.objectID)
      );
    }
  }

  delete(idOrIds: string | string[]): HotObservableOnce<void> {
    if (Array.isArray(idOrIds)) {
      return from(this.index.deleteObjects(idOrIds)).pipe(
          map(() => {})
      );
    } else {
      return from(this.index.deleteObject(idOrIds)).pipe(
          map(() => {})
      );
    }
  }

  private makeSearchResponse(response): SearchResponse<E> {
    return {
      hits: response.hits.map(hit => this.convertHitToEntity(hit)),
      totalCount: response.nbHits,
      count: response.hits.length,
      page: response.page,
      perPage: response.hitsPerPage
    };
  }

  private convertHitToEntity(hit: { objectID: string }): E {
    const entity = {
      id: hit.objectID
    } as E;

    for (const key in hit) {
      if (hit.hasOwnProperty(key)) {
        if(key === '_geoloc'){
          entity['lat'] = hit[key].lat;
          entity['lng'] = hit[key].lng;
        }
        else if (this.dateFields && this.dateFields.indexOf(key) > -1) {
          entity[key] = new Date(hit[key]);
        } else {
          entity[key] = hit[key];
        }
      }
    }

    return entity;
  }

  private convertQueryToFilters(query: SearchQuery<E>): any {
    const algoliaQuery: any = {};

    if (query.filters) {
      algoliaQuery.filters = '';

      for (const filter of query.filters) {
        if (filter.parenthesis) {
          if (filter.parenthesis === 'start' && algoliaQuery.filters) {
            algoliaQuery.filters += ` ${filter.logical ? filter.logical.toUpperCase() : 'AND'} `;
          }

          algoliaQuery.filters += filter.parenthesis === 'start' ? '(' : ')';
          continue;
        }

        if (
            algoliaQuery.filters &&
            algoliaQuery.filters.charAt(algoliaQuery.filters.length - 1) !== '(' &&
            (
                filter.value !== undefined || (filter.lowerValue && filter.higherValue)
            )
        ) {
          algoliaQuery.filters += ` ${filter.logical ? filter.logical.toUpperCase() : 'AND'} `;
        }

        if (filter.value !== undefined) {
          if (filter.comparison) {
            if (filter.comparison === '==' && typeof filter.value === 'string') {
              algoliaQuery.filters += `${filter.field}:"${filter.value}"`;
            } else if (filter.comparison === '!=') {
              algoliaQuery.filters += `NOT ${filter.field}:"${filter.value}"`;
            } else {
              algoliaQuery.filters += `${filter.field} ${filter.comparison} ${filter.value}`;
            }
          } else {
            algoliaQuery.filters += `${filter.field}:"${filter.value}"`;
          }
        } else {
          if (filter.lowerValue && filter.higherValue) {
            algoliaQuery.filters += `${filter.field}:${filter.lowerValue} TO ${filter.higherValue}`;
          }
        }
      }
    }

    if (query.page >= 0) {
      algoliaQuery.page = query.page;
    }

    if (query.perPage) {
      algoliaQuery.hitsPerPage = query.perPage;
    }

    return algoliaQuery;
  }
}
