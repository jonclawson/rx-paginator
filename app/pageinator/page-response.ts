import { PageParams } from './page-params';

export class PageResponse {
  data: any[];
  params: PageParams;
  constructor(data: any[], params: PageParams) {
    this.data = data;
    this.params = params;
  }
}
