import { HttpParams } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { take } from 'rxjs/operators/take';
import { PageParams } from './page-params';

export class Pager {
  private params: any | PageParams;
  private data: any[];
  private response = new BehaviorSubject(null);
  private url: string;
  private requestMethod = (params: HttpParams): Observable<any> => {
    return this.http.get(this.url, { params });
  };

  constructor(private http: HttpClient) {}

  getHttpParams() {
    let page, limit;
    const params = ({ page, limit } = this.params);
    if (this.params.filters) {
      params.filter = JSON.stringify(this.params.filter);
    }
    if (this.params.sort) {
      params.sort = this.params.sort;
    }
    return params;
  }

  change() {
    this.requestMethod(this.getHttpParams())
      .pipe(take(1))
      .subscribe((response: any) => {
        this.response.next(response);
        this.data = response.data;
        this.params = response.params;
      });
  }

  subscribeToResponse(next) {
    this.change();
    return this.response.subscribe(next);
  }

  nextPage() {
    if (this.params.pages > this.params.page) {
      +this.params.page++;
      this.change();
    }
  }

  prevPage() {
    if (this.params.page > 1) {
      +this.params.page--;
      this.change();
    }
  }

  goToPage(page: number) {
    this.params.page = page;
    this.change();
  }

  sort(key) {
    let k, dir;
    if (this.params.sort) {
      [k, dir] = this.params.sort.split(',');
      if (k && dir) {
        dir = dir === 'asc' ? 'desc' : 'asc';
      } else {
        dir = 'asc';
      }
    }
    this.params.sort = `${key},${dir || 'asc'}`;
    this.setPage(1);
    this.change();
  }

  filter(key, value) {
    if (!this.params.filter) {
      this.params.filter = {};
    }
    this.params.filter[key] = value;
    this.setPage(1);
    this.change();
  }

  clearFilters() {
    Object.keys(this.params.filter).forEach((k) => {
      this.params.filter[k] = '';
    });
    this.setPage(1);
    this.change();
  }

  getData() {
    return this.data;
  }

  setUrl(url: string) {
    this.url = url;
  }

  setRequestMethod(requestMethod: any) {
    this.requestMethod = requestMethod;
  }

  setPage(page: number) {
    this.params.page = page;
  }

  setLimit(limit: number) {
    this.params.limit = limit;
  }

  setSort(s: string) {
    this.params.sort = s;
  }

  setParams(params: PageParams) {
    this.params = params;
  }
}
