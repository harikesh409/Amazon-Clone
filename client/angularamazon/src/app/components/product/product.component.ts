import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { RestApiService } from 'src/app/services/rest-api.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
  product: any;

  myReview = {
    title: '',
    description: '',
    rating: 0
  };

  btnDisabled = false;

  constructor(
    private data: DataService,
    private rest: RestApiService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.activatedRoute.params.pipe(first()).subscribe(res => {
      this.rest
        .get(`/api/product/${res.id}`)
        .then(data => {
          data['success']
            ? (this.product = data['product'])
            : this.router.navigate(['/']);
        })
        .catch(err => this.data.error(err['message']));
    });
  }

  async postReview() {
    this.btnDisabled = true;
    try {
      const data = await this.rest.post(`/api/review`, {
        productId: this.product._id,
        title: this.myReview.title,
        description: this.myReview.description,
        rating: this.myReview.rating
      });
      console.log(data);
      data['success']
        ? this.data.success(data['message'])
        : this.data.error(data['message']);
    } catch (err) {
      this.data.error(err['message']);
    }
    this.btnDisabled = false;
  }
}
