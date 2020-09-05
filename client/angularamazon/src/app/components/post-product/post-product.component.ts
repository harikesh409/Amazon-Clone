import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { DataService } from "src/app/services/data.service";
import { RestApiService } from "src/app/services/rest-api.service";

@Component({
  selector: "app-post-product",
  templateUrl: "./post-product.component.html",
  styleUrls: ["./post-product.component.scss"]
})
export class PostProductComponent implements OnInit {
  constructor(
    private data: DataService,
    private rest: RestApiService,
    private router: Router
  ) {}

  product = new Product();
  categories: any;
  btnDisabled = false;

  async ngOnInit() {
    try {
      const data = await this.rest.get("/api/categories");
      data["success"]
        ? (this.categories = data["categories"])
        : this.data.error(data["message"]);
    } catch (err) {
      this.data.error(err["message"]);
    }
  }

  validate(product) {
    if (product.title) {
      if (product.price) {
        if (product.categoryId) {
          if (product.description) {
            return true;
          } else {
            this.data.error("Please enter description");
          }
        } else {
          this.data.error("Please select category.");
        }
      } else {
        this.data.error("Please enter product price.");
      }
    } else {
      this.data.error("Please enter a title.");
    }
  }

  async post() {
    this.btnDisabled = true;
    try {
      console.log(this.product);
      if (this.validate(this.product)) {
        const data = await this.rest.post("/api/seller/products", this.product);
        data["success"]
          ? this.router
              .navigate(["/profile/myproducts"])
              .then(() => this.data.success(data["message"]))
              .catch(err => this.data.error(data["message"]))
          : this.data.error(data["message"]);
      }
    } catch (err) {
      this.data.error(err["message"]);
    }
    this.btnDisabled = false;
  }
}

class Product {
  title: String;
  price: Number;
  categoryId: String;
  description: String;
  Product() {
    this.title = "";
    this.price = 0.0;
    this.categoryId = "";
    this.description = "";
  }
}
