import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { RestApiService } from 'src/app/services/rest-api.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {
  categories: any;
  newCategory = '';
  btnDisabled = false;

  constructor(private data: DataService, private rest: RestApiService) {}

  ngOnInit() {
    this.getCategories();
  }

  async getCategories() {
    try {
      const data = await this.rest.get('/api/categories');
      data['success']
        ? (this.categories = data['categories'])
        : this.data.error(data['message']);
    } catch (err) {
      this.data.error(err['message']);
    }
  }

  async addCategory() {
    this.btnDisabled = true;
    try {
      const data = await this.rest.post('/api/categories', {
        category: this.newCategory
      });
      if (data['success']) {
        this.getCategories().then(() => {
          this.data.success(data['message']);
          this.newCategory = '';
        });
      } else {
        this.data.error(data['message']);
      }
    } catch (err) {
      this.data.error(err['message']);
    }
    this.btnDisabled = false;
  }
}
