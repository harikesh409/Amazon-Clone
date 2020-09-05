import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { RestApiService } from "../../services/rest-api.service";
import { DataService } from "../../services/data.service";

const email_regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"]
})
export class LoginComponent implements OnInit {
  email: string = "";
  password: string = "";

  btnDisabled: boolean = false;

  constructor(
    private router: Router,
    private data: DataService,
    private rest: RestApiService
  ) {}

  ngOnInit() {}

  validate() {
    if (this.email) {
      if (email_regex.test(this.email)) {
        if (this.password) {
          return true;
        } else {
          this.data.error("Password is not entered");
        }
      } else {
        this.data.error("Enter a valid email id");
      }
    } else {
      this.data.error("Email is not entered");
    }
  }

  async login() {
    this.btnDisabled = true;
    try {
      if (this.validate()) {
        const data = await this.rest.post("/api/accounts/login", {
          email: this.email,
          password: this.password
        });
        if (data["success"]) {
          localStorage.setItem("token", data["token"]);
          this.router.navigate(["/"]);
          await this.data.getProfile();
        } else {
          this.data.error("Authorization Failed");
        }
      }
    } catch (error) {
      this.data.error(error["message"]);
    }
    this.btnDisabled = false;
  }
}
