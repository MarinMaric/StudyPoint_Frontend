import {Component, ElementRef, ViewChild} from '@angular/core';
import {MyConfig} from "./MyConfig";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {filter} from "rxjs/operators";
import {LoginVM} from "./LoginVM";
import {AutentifikacijaLoginResultVM} from "./AutentifikacijaLoginResultVM";
import {RegisterVM} from "./RegisterVM";
import {RegisterResultVM} from "./RegisterResultVM";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title:string;
  user:LoginVM;
  registration:RegisterVM;
  loginToken:string;
  showRouting:boolean=false;
  showLogin:boolean=false;
  showRegister:boolean=true;

  result:RegisterResultVM;

  constructor(private http:HttpClient) {
    this.user=new LoginVM();
    this.user.username="";
    this.user.password="";

    this.registration=new RegisterVM();
    this.showLogin=true;
    this.showRegister=false;
    var token=localStorage.getItem("loginToken");
    if(token!=undefined)
      this.showRouting=true;
    this.result=new RegisterResultVM();
    this.result.usernameMessage="";
    this.result.passwordMessage="";
    this.result.confirmPasswordMessage="";
    this.result.emailMessage="";
  }
  Show(){
    this.showRouting=true;
  }
  Login(){
    var url=MyConfig.webAppUrl+"/Autentifikacija";
    const headerDict = {
      'Content-Type': 'application/json'
    };
    const requestOptions = {
      headers: new HttpHeaders (headerDict),
    };
    var body = JSON.stringify(this.user);
    this.http.post<AutentifikacijaLoginResultVM>(url, body, requestOptions).subscribe((result)=>{
      localStorage.setItem("loginToken", result.tokenString);
      this.showRouting=true;
      this.user.type=result.type;
    },error=>{
      localStorage.clear();
      this.showRouting=false;
      alert("Pogresan username ili password");
    });
  }
  RegistrationForm(){
    this.showRegister=true;
    this.showLogin=false;
  }
  LoginForm(){
    this.showLogin=true;
    this.showRegister=false;
  }

  ValidateRegistration(){
    if(!this.BaseChecks()){
      alert("Failed validation");
      return;
    }

    const headerDict = {
      'Content-Type': 'application/json'
    };
    const requestOptions={
      headers:new HttpHeaders(headerDict)
    };
    var body = JSON.stringify(this.registration);
    var error=0;

    this.http.post<RegisterResultVM>(MyConfig.webAppUrl+'/Autentifikacija/CheckUser', body, requestOptions).subscribe((result:RegisterResultVM)=>{
      if(result.usernameMessage!="" && result.usernameMessage!=null){
        this.result.usernameMessage=result.usernameMessage;
        error++;
      }
      else if(result.emailMessage!="" && result.emailMessage!=null){
        this.result.usernameMessage=result.emailMessage;
        error++;
      }
      if(error>0){
        return;
      }else{
        this.result.usernameMessage="";
        this.result.passwordMessage="";
        this.result.confirmPasswordMessage="";
        this.result.emailMessage="";

        this.Register();
      }
    },error => {
      return;
    });
  }
  Register(){
    var url = MyConfig.webAppUrl+"/Autentifikacija/Register";
    const headerDict = {
      'Content-Type': 'application/json'
    };
    const requestOptions={
      headers:new HttpHeaders(headerDict)
    };
    var body = JSON.stringify(this.registration);
    this.http.post(url, this.registration, requestOptions).subscribe((result)=>{
      alert("Created account");
      this.showRegister=false;
      this.showLogin=true;
    },error=>{
      alert("Fail");
    });
  }

  Logout(){
    localStorage.clear();
    this.showRouting=false;
  }
  public BackToAuth(){
    this.showRouting=false;
  }

  BaseChecks():boolean{
    var error=0;
    if(this.registration.username==null){
      this.result.usernameMessage="This field is required.";
      error++;
    }else if(this.registration.username.length<3){
      this.result.usernameMessage="Username must be at least 3 characters long.";
      error++;
    }

    if(this.registration.password==null){
      this.result.passwordMessage="This field is required.";
      error++;
    }else if(this.registration.password.length<6){
      this.result.passwordMessage="Username must be at least 6 characters long.";
      error++;
    }

    if(this.registration.confirmpassword!=this.registration.password){
      this.result.confirmPasswordMessage="Passwords don't match.";
      error++;
    }

    if(this.registration.email==null){
      this.result.emailMessage="This field is required.";
      error++;
    }else{
      var regexp = new RegExp('.+@.+\.com');
      if(!regexp.test(this.registration.email)){
        this.result.emailMessage="E-mail address is invalid.";
        error++;
      }
    }

    if(error>0)
      return false;
    else{
      this.result.usernameMessage="";
      this.result.passwordMessage="";
      this.result.confirmPasswordMessage="";
      this.result.emailMessage="";
      return true;
    }
  }
}
