import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
import { RestApiService } from 'src/app/services/rest-api.service';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
  categoryId: any;
  category: any;
  page = 1;

  constructor(
    private data: DataService,
    private rest: RestApiService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.activatedRoute.params.pipe(first()).subscribe(res => {
      this.categoryId = res['id'];
      this.getProducts();
    });
  }
  get lower() {
    return 10 * (this.page - 1) + 1;
  }
  get upper() {
    return Math.min(10 * this.page, this.category.totalProducts);
  }

  async getProducts(event?: any) {
    if (event) {
      this.category = null;
    }
    try {
      const data = await this.rest.get(
        `/api/categories/${this.categoryId}?page=${this.page}`
      );
      data['success']
        ? (this.category = data)
        : this.data.error(data['message']);
    } catch (err) {
      this.data.error(err['message']);
    }
  }
}
