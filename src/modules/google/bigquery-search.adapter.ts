import { combineLatest, Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { AdminApiService } from '../../core/api/admin-api.service';
import { BaseEntity } from '../../core/base-entity';
import { DbAdapter } from '../../core/db/db.adapter';
import { SearchAdapter } from '../../core/search/search.adapter';
import {
  SearchQuery,
  SearchResponse,
  SearchFilter,
} from '../../core/search/types';
import { HashMap, ColdObservable } from '../../core/types';

export class BigquerySearchAdapter<E extends BaseEntity>
  implements SearchAdapter<E>
{
  private baseLimit = 20;

  constructor(
    protected tableName: string,
    protected apiService: AdminApiService,
    protected dbAdapter: DbAdapter<E>
  ) {}

  search(query: SearchQuery<E>): ColdObservable<SearchResponse<E>> {
    // @ts-ignore
    return this.apiService
      .bigquery(
        this.convertQueryToCountQuery(query),
        this.convertQueryForBigquery(query)
      )
      .pipe(switchMap((response) => this.makeResponse(query, response.data)));
  }

  private convertQueryToCountQuery(query: SearchQuery<E>): string {
    let countQuery = `SELECT COUNT(DISTINCT document_id) FROM \`${this.tableName}\``;

    if (query.filters && query.filters.length) {
      countQuery += this.makeSqlWhere(query.filters);
    }

    return countQuery;
  }

  private convertQueryForBigquery(query: SearchQuery<E>): string {
    let q = `SELECT DISTINCT document_id`;

    if (query.sorts && query.sorts.length) {
      for (const sort of query.sorts) {
        q += `, ${sort.field}`;
      }
    }

    q += ` FROM \`${this.tableName}\``;

    if (query.filters && query.filters.length) {
      q += this.makeSqlWhere(query.filters);
    }

    if (query.sorts && query.sorts.length) {
      for (let i = 0; i < query.sorts.length; i++) {
        const sort = query.sorts[i];

        if (i === 0) {
          q += ` ORDER BY `;
        } else {
          q += `, `;
        }

        q += `${sort.field} ${sort.direction}`;
      }
    }

    const limit = query.limit || this.baseLimit;

    q += ` LIMIT ${limit}`;

    if (query.page > 0) {
      q += ` OFFSET ${query.page * limit}`;
    }

    return q;
  }

  private makeResponse(
    query: SearchQuery<E>,
    { count, docs }: { count: number; docs: any[] }
  ): Observable<{
    docs: E[];
    count: any;
    limit: number;
    page: number;
    totalCount: number;
  }> {
    // const entities = docs.map(doc => this.convertDocToEntity(doc));

    let observable: ColdObservable<E[]>;

    if (docs.length === 0) {
      observable = of([]);
    } else {
      observable = combineLatest(
        docs.map((doc) => this.dbAdapter.getChange(doc.document_id))
      );
    }

    return observable.pipe(
      map((entities) => entities.filter(Boolean)),
      map((entities) => ({
        docs: entities as E[],
        totalCount: count,
        count: entities.length,
        page: query.page || 0,
        limit: query.limit || this.baseLimit,
      }))
    );
  }

  private convertDocToEntity(doc: HashMap<any> | any): BaseEntity {
    const id = doc.document_id;

    delete doc.document_id;
    delete doc.document_name;
    delete doc.operation;
    delete doc.timestamp;

    return {
      ...this.convertFlatToObject(this.convertTimestampToDate(doc)),
      id,
    };
  }

  private convertTimestampToDate(documentData: any): any {
    if (documentData && documentData.value) {
      return new Date(documentData.value);
    } else if (Array.isArray(documentData)) {
      const node = [];

      for (const data of documentData) {
        node.push(this.convertTimestampToDate(data));
      }

      return node;
    } else if (documentData === null) {
      return null;
    } else if (typeof documentData === 'object') {
      const data = { ...documentData };

      if (Object.keys(data).length > 0) {
        for (const key in data) {
          if (data.hasOwnProperty(key) && data[key]) {
            data[key] = this.convertTimestampToDate(data[key]);
          }
        }

        return data;
      }
    } else {
      return documentData;
    }
  }

  private convertFlatToObject(doc: HashMap<any>): E {
    const entity = {} as E;

    for (const key in doc) {
      if (doc.hasOwnProperty(key)) {
        const split = key.split('_');

        for (const k of split) {
          // entity[k]
        }
      }
    }

    return doc as E;
  }

  private makeSqlWhere(filters: SearchFilter[]): string {
    let where = '';

    for (let i = 0; i < filters.length; i++) {
      const filter = filters[i];

      if (i === 0) {
        where += ` WHERE `;
      } else {
        where += ` ${filter.logical || 'and'} `;
      }

      if (filter.parenthesis === 'start') {
        where += `(`;
      }

      where += this.makeSqlWhereCond(filter);

      if (filter.parenthesis === 'end') {
        where += `)`;
      }
    }

    return where;
  }

  private makeSqlWhereCond(filter: SearchFilter): string {
    let comparison = filter.comparison === '!=' ? '<>' : filter.comparison;
    comparison = filter.comparison === 'text' ? 'LIKE' : comparison;
    comparison = filter.comparison === '==' ? '=' : comparison;

    let cond = `${filter.field} ${comparison} `;

    if (typeof filter.value === 'string') {
      if (filter.comparison === 'text') {
        cond += `'%${filter.value}%'`;
      } else {
        cond += `'${filter.value}'`;
      }
    } else if (typeof filter.value === 'number') {
      cond += filter.value;
    } else if (typeof filter.value === 'boolean') {
      cond += filter.value;
    } else if (filter.value instanceof Date) {
      cond += `TIMESTAMP("${filter.value.toISOString()}")`;
    } else {
    }

    return cond;
  }
}
