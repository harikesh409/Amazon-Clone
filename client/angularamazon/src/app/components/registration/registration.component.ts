import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { RestApiService } from "../../services/rest-api.service";
import { DataService } from "../../services/data.service";

const email_regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

@Component({
  selector: "app-registration",
  templateUrl: "./registration.component.html",
  styleUrls: ["./registration.component.scss"]
})
export class RegistrationComponent implements OnInit {
  name: string = "";
  email: string = "";
  password: string = "";
  confirmPassword: string = "";
  isSeller: boolean = false;

  btnDisabled: boolean = false;

  constructor(
    private router: Router,
    private data: DataService,
    private rest: RestApiService
  ) {}

  ngOnInit() {}

  validate() {
    if (this.name) {
      if (this.email) {
        if (email_regex.test(this.email)) {
          if (this.password) {
            if (this.confirmPassword) {
              if (this.password === this.confirmPassword) {
                return true;
              } else {
                this.data.error("Passwords do not match");
              }
            } else {
              this.data.error("Confirmation Password is not entered");
            }
          } else {
            this.data.error("Password is not entered");
          }
        } else {
          this.data.error("Enter a valid email id");
        }
      } else {
        this.data.error("Email is not entered");
      }
    } else {
      this.data.error("Name is not entered");
    }
  }

  async register() {
    this.btnDisabled = true;
    try {
      if (this.validate()) {
        const data = await this.rest.post("/api/accounts/signup", {
          name: this.name,
          email: this.email,
          password: this.password,
          isSeller: this.isSeller
        });
        if (data["success"]) {
          localStorage.setItem("token", data["token"]);
          // this.data.success("Registered Successfully!");
          await this.data.getProfile();
          this.router
            .navigate(["/profile/address"])
            .then(() => {
              this.data.success(
                "Registered Successfully! Please enter you shipping address below."
              );
            })
            .catch(error => this.data.error(error));
        } else {
          this.data.error(data["message"]);
        }
      }
    } catch (error) {
      this.data.error(error["message"]);
    }
    this.btnDisabled = false;
  }
}
