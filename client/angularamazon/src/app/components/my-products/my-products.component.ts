import { Component, OnInit } from "@angular/core";
import { DataService } from "src/app/services/data.service";
import { RestApiService } from "src/app/services/rest-api.service";

@Component({
  selector: "app-my-products",
  templateUrl: "./my-products.component.html",
  styleUrls: ["./my-products.component.scss"]
})
export class MyProductsComponent implements OnInit {
  products: any;
  constructor(private data: DataService, private rest: RestApiService) {}

  async ngOnInit() {
    try {
      const data = await this.rest.get("/api/seller/products");
      data["success"]
        ? (this.products = data["products"])
        : this.data.error(data["message"]);
    } catch (err) {
      this.data.error(err["message"]);
    }
  }
}
