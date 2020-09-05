import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { RestApiService } from 'src/app/services/rest-api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  products: any;

  constructor(private data: DataService, private rest: RestApiService) {}

  async ngOnInit() {
    try {
      const data = await this.rest.get(`/api/products`);
      data['success']
        ? (this.products = data['products'])
        : this.data.error('Could not fetch products.');
    } catch (err) {
      this.data.error(err['message']);
      console.error(err);
    }
  }
}
