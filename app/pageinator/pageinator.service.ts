import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { PageParams } from './page-params';
import { PageResponse } from './page-response';
import { Pager } from './pager';

@Injectable()
export class PaginatorService {
  constructor(private http: HttpClient) {}

  createPager(): Pager {
    return new Pager(this.http);
  }

  pageResponse(params: PageParams) {
    return map((d: any[]) => {
      let { page, limit, sort, filter } = params;

      if (!page || !limit) {
        return new PageResponse(d, null);
      }
      const offset = (page - 1) * limit;
      const data = d
          .filter((i) => {
            if (!filter) {
              return true;
            }
            return !Object.keys(filter).find((k) => {
              return i[k].includes(filter[k]) === false;
            });
          })
          .sort((a, b) => {
            if (!sort) {
              return 0;
            }
            const [key, dir] = sort.split(',');
            if (a[key] > b[key]) {
              return dir === 'asc' ? 1 : -1;
            }
            if (a[key] < b[key]) {
              return dir === 'asc' ? -1 : 1;
            }
            if (a[key] === b[key]) {
              return 0;
            }
          })
          params.total = data.length;
          return new PageResponse(
            data.splice(offset, limit), 
            { 
              ...params, 
              pages: Math.ceil(params.total / params.limit) 
            }
          );
    });
  }
}
