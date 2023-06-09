import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { PaginatorService } from './pageinator/pageinator.service';
import { PageResponse } from './pageinator/page-response';
import { Pager } from './pageinator/pager';

export interface Hero {
  id: number;
  name: string;
}

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  private heroes: PageResponse;

  private heroesUrl = 'api/heroes'; // URL to web api

  response: any;

  pager: Pager;

  pages: number[];

  filters = {
    id: '',
    name: '',
  };

  get hasFilters() {
    return !!Object.values(this.filters).find((f) => f != '');
  }

  constructor(private http: HttpClient, private paginator: PaginatorService) {}

  ngOnInit() {
    const params = {
      page: 1,
      limit: 4,
      // sort: 'name,asc',
      // filter: ({ name: '' }),
    };
    this.pager = this.paginator.createPager();
    this.pager.setRequestMethod((params) => {
      return this.getHeroes()
      // Remove this line for real paged endpoint.
      .pipe(this.paginator.simulatePagedResponse(params));
    });
    this.pager.setParams(params);
    this.pager.subscribeToResponse((r) => {
      this.response = Object.assign({}, r || {});
      if (this.response.params) {
        Object.assign(this.filters, this.response.params?.filter);
        if (this.response.params.pages) {
          this.pages = Array(+this.response.params.pages)
            .fill(null)
            .map((x, i) => i + 1);
        }
      }
    });
  }

  getHeroes(params?: any): Observable<Hero[]> {
    return this.http.get<Hero[]>('api/heroes', { params });
  }
}
