import { Component, OnInit } from '@angular/core';
import { HttpServiceService } from '../service/http-service.service';
import { ResponseObject } from '../model/response-object';
import { Router } from '@angular/router';
import { DataSharingServceService } from '../service/data-sharing-servce.service';

@Component({
  selector: 'app-homebody',
  templateUrl: './homebody.component.html',
  styleUrls: ['./homebody.component.css']
})
export class HomebodyComponent implements OnInit{

  signUpFlag : String = "none";
  loginFlag : String = "none";
  userName : String = "";
  password : String = "";

  constructor(private httpService : HttpServiceService,
    private _router : Router,
    private _dataSharing : DataSharingServceService){  }

  ngOnInit(){
    this._dataSharing.getRegistrationFlag().subscribe(data => {
      this.signUpFlag = "none";
    })
  }

  signUp(){
    this.signUpFlag = "block";
    this.loginFlag = "none";
  }

  login(){
    this.signUpFlag = "none";
    this.loginFlag = "block";
  }

  cancelLogin(){
    this.loginFlag = "none";
  }

  cancelSignUp(){
    this.signUpFlag = "none";
  }

  responseObj : ResponseObject | undefined;
  userLogin(){
    this.loginFlag = "none";
    if((this.userName != undefined || this.userName != "") && (this.password != undefined || this.password != "")){
      this.httpService.userLogin(this.userName,this.password).subscribe((data:any)=>{
        this.responseObj = data;
        if(this.responseObj != undefined){
          if(this.responseObj.responseCode == "200" && this.responseObj.responseMessage == "SUCCESS"){
            this._dataSharing.sendPatientObject(this.responseObj.patient);
            let jsonString = JSON.stringify(this.responseObj.patient);
            localStorage.setItem('patientObjectData', jsonString);
            this._router.navigate(["/patientAfterLogin"])
          }else{
            alert(this.responseObj.responseMessage);
            this.cancelLogin();
          }
        }
      });
    }
  }

  learnMore(){
    window.open("https://sales.lptmedical.com/lpt-save-600-bd/?utm_source=yahoo%20bing&utm_medium=ppc&utm_campaign=G%20Target%20CPA%20Computer%20-%20Enhanced%20CPC&utm_term=Portable%20Oxygen%20Concentrator%20Phrase&adextension=&matchtype=b&device=c&devicemodel=&glcid=&keyword=med%20portal&placement=&adposition=&network=o&msclkid=ef5672e828be14356d1d14ca0007416c","_blank");
  }

  contactUs(){
    alert("Please go through Footer to get Contact Information");
  }

}
