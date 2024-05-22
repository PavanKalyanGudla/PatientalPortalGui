import { Component } from '@angular/core';
import { Doctor } from '../model/doctor';
import { PatientAddress } from '../model/patient-address';
import { HttpServiceService } from '../service/http-service.service';
import { ResponseObject } from '../model/response-object';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-patiental-portal-management',
  templateUrl: './patiental-portal-management.component.html',
  styleUrls: ['./patiental-portal-management.component.css']
})
export class PatientalPortalManagementComponent {

  doctorReg : Doctor = new Doctor();
  doctorLogin : Doctor = new Doctor();
  doctorsignUpFlag : String = "none";
  doctorLoginFlag : String = "none";

  ngOnInit(){
  }

  constructor(private _httpService : HttpServiceService,
    private _router : Router){
  }

  cancelDoctorSignUp(){
    this.doctorsignUpFlag = "none";
  }
  openDoctorRegistration(){
    this.doctorsignUpFlag = "block";
  }
  openDoctorLogin(){
    this.doctorLoginFlag = "block";
  }
  cancelDoctorLogin(){
    this.doctorLoginFlag = "none";
  }
  responseObj : ResponseObject | undefined;
  doctorLoginCheck(){
    this.doctorLoginFlag = "none";
    if(this.doctorLogin.doctor_id != undefined && this.doctorLogin.password != null){
      this._httpService.doctorLogin(this.doctorLogin.doctor_id,this.doctorLogin.password).subscribe((data:any)=>{
        this.responseObj = data;
        if(this.responseObj != undefined){
          if(this.responseObj.responseCode == "200" && this.responseObj.responseMessage == "SUCCESS"){
            let jsonString = JSON.stringify(this.responseObj.doctor);
            localStorage.setItem('doctorObjectData', jsonString);
            this._router.navigate(["/doctorAfterLogin"])
          }else{
            alert(this.responseObj.responseMessage);
            this.cancelDoctorLogin();
          }
        }
      });
    }
  }
  // 
  // userLogin(){
  //   this.loginFlag = "none";
  //   if((this.userName != undefined || this.userName != "") && (this.password != undefined || this.password != "")){
  //     this.httpService.userLogin(this.userName,this.password).subscribe((data:any)=>{
  //       this.responseObj = data;
  //       if(this.responseObj != undefined){
  //         if(this.responseObj.responseCode == "200" && this.responseObj.responseMessage == "SUCCESS"){
  //           this._dataSharing.sendPatientObject(this.responseObj.patient);
  //           let jsonString = JSON.stringify(this.responseObj.patient);
  //           localStorage.setItem('patientObjectData', jsonString);
  //           this._router.navigate(["/patientAfterLogin"])
  //         }else{
  //           alert(this.responseObj.responseMessage);
  //           this.cancelLogin();
  //         }
  //       }
  //     });
  //   }
  // }
}
