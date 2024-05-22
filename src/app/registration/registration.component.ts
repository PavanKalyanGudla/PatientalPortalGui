import { Component, ViewChild } from '@angular/core';
import { Patient } from '../model/patient';
import { PatientAddress } from '../model/patient-address';
import { PatientInsuranceInfo } from '../model/patient-insurance-info';
import { HttpServiceService } from '../service/http-service.service';
import { DataSharingServceService } from '../service/data-sharing-servce.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent {

  ngOnInit(){
    this._dataSharing.sendRegistrationFlag(false);
  }

  constructor(private _httpService : HttpServiceService,
    private _dataSharing : DataSharingServceService){
  }

  firstName: String = "";
  lastName: String = "";
  dob: String = "";
  age: String = "";
  gender: String = "";
  maritialStatus: String = "";

  mobile: String = "";
  email: String = "";
  street: String = "";
  city: String = "";
  state: String = "";
  zipCode: String = "";
  emergencyContactName: String = "";
  relationShip: String = "";
  emergencyContactMobile: String = "";
  password: String = "";
  confirmPassword: String = "";
  drNo:String="";
  providerName: String = "";
  policyNumber: String = "";
  groupNumber: String = "";
  coverageType: String = "";
  effectiveDate: String = "";
  expirationDate: String = "";
  patient: Patient | undefined ;
  patientAddress : PatientAddress | undefined;
  insuranceInfo : PatientInsuranceInfo | undefined;

  @ViewChild('showPass') showPass: any;
  @ViewChild('showConfPass') showConfPass: any;

  personalValidation(one : String, two : String){
    if(one == "step1" && two == "step2"){
      var errorMsg : any;
      errorMsg = this.validateUserDetails();
      (errorMsg.length == 0)?this.nextStep('step1', 'step2'):alert(errorMsg);
    }else if(one == "step2" && two == "step3"){
      var errorMsg : any;
      errorMsg = this.validateAddressDetails();
      (errorMsg.length == 0)?this.nextStep('step2', 'step3'):alert(errorMsg);
    }else if(one == "step3" && two == "step4"){
      var errorMsg : any;
      errorMsg = this.validateInsuranceDetails();
      (errorMsg.length == 0)?this.nextStep('step3', 'step4'):alert(errorMsg);
    }else if(one == "step4" && two == "step5"){
      var errorMsg : any;
      errorMsg = this.validateEmailPasswordDetails();
      (errorMsg.length == 0)?this.submitForm():alert(errorMsg);
    }
  }

  submitForm(){
    this.patient = new Patient();
    this.patient.patientId=this.email.split("@")[0];
	  this.patient.firstName=this.firstName;
	  this.patient.lastName=this.lastName;
	  this.patient.age=this.age+"";
    this.patient.dob=this.dob;
    this.patient.maritialStatus=this.maritialStatus;
    this.patient.gender=this.gender;

    this.patientAddress = new PatientAddress();
    this.patientAddress.patientId = this.patient.patientId;
    this.patientAddress.addressId = this.patient.patientId;
    this.patientAddress.mobile=this.mobile;
    this.patientAddress.street=this.street;
    this.patientAddress.city=this.city;
    this.patientAddress.state=this.state;
    this.patientAddress.drNo=this.drNo;
    this.patientAddress.zipCode=this.zipCode;
    this.patientAddress.emergencyContactName=this.emergencyContactName;
    this.patientAddress.relationShip=this.relationShip;
    this.patientAddress.emergencyContactMobile=this.emergencyContactMobile;
    this.patientAddress.email=this.email;
    this.patientAddress.password=this.password;
    
    this.insuranceInfo = new PatientInsuranceInfo();
    this.insuranceInfo.patientId = this.patient.patientId;
    this.insuranceInfo.insuranceInfoId = this.patient.patientId;
    this.insuranceInfo.providerName=this.providerName;
    this.insuranceInfo.policyNumber=this.policyNumber;
    this.insuranceInfo.groupNumber=this.groupNumber;
    this.insuranceInfo.coverageType=this.coverageType;
    this.insuranceInfo.effectiveDate=this.effectiveDate;
    this.insuranceInfo.expirationDate=this.expirationDate;

    this.patient.address=this.patientAddress;
    this.patient.insuranceInfo=this.insuranceInfo;
    this._httpService.patientRegistration(this.patient).subscribe((data)=>{
      alert(data);
      this._dataSharing.sendRegistrationFlag(false);
    });
  }

  onDateChange(event: any) {
    const selectedDate = event.target.value;
    if(selectedDate != ""){
      this.age = this.calculateAge(selectedDate)+"";
    }else{
      this.age = "";
    }
    
  }
  
  calculateAge(selectedDate: string): number {
    const birthDate = new Date(selectedDate);
    const currentDate = new Date();
    let age = currentDate.getFullYear() - birthDate.getFullYear();
    const monthDiff = currentDate.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && currentDate.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  validateUserDetails() : Array<string>{
    let errorMsg = new Array<string>;
    !(this.firstName != null && this.firstName != undefined && this.firstName != "")? errorMsg.push("Please Check FirstName"):"";
    !(this.lastName != null && this.lastName != undefined && this.lastName != "")? errorMsg.push("\nPlease Check LastName"):"";
    !(this.dob != null && this.dob != undefined && this.dob != "")? errorMsg.push("\nPlease Check Date Of Birth"):"";
    !(this.gender != null && this.gender != undefined && this.gender != "")? errorMsg.push("\nPlease Check gender"):"";
    !(this.maritialStatus != null && this.maritialStatus != undefined && this.maritialStatus != "")? errorMsg.push("\nPlease Check maritalStatus"):"";
    return errorMsg;
  }

  validateAddressDetails() : Array<string>{
    let errorMsg = new Array<string>;
    !(this.street != null && this.street != undefined && this.street != "")? errorMsg.push("Please Check Street"):"";
    !(this.drNo != null && this.drNo != undefined && this.drNo != "")? errorMsg.push("Please Drno"):"";
    !(this.city != null && this.city != undefined && this.city != "")? errorMsg.push("\nPlease Check City"):"";
    !(this.state != null && this.state != undefined && this.state != "")? errorMsg.push("\nPlease Check State"):"";
    !(this.mobile != null && this.mobile != undefined && this.mobile != "")? errorMsg.push("\nPlease Check Mobile"):"";
    !(this.zipCode != null && this.zipCode != undefined && this.zipCode != "")? errorMsg.push("\nPlease Check ZipCode"):"";
    !(this.emergencyContactName != null && this.emergencyContactName != undefined && this.emergencyContactName != "")? errorMsg.push("\nPlease Check Emergency Contact Name"):"";
    !(this.relationShip != null && this.relationShip != undefined && this.relationShip != "")? errorMsg.push("\nPlease Check RelationShip"):"";
    !(this.emergencyContactMobile != null && this.emergencyContactMobile != undefined && this.emergencyContactMobile != "")? errorMsg.push("\nPlease Check Emergency Contact Number"):"";
    return errorMsg;
  }

  validateInsuranceDetails() : Array<string>{
    let errorMsg = new Array<string>;
    !(this.providerName != null && this.providerName != undefined && this.providerName != "")? errorMsg.push("Please Check ProviderName"):"";
    !(this.policyNumber != null && this.policyNumber != undefined && this.policyNumber != "")? errorMsg.push("Please Check PolicyNumber"):"";
    !(this.groupNumber != null && this.groupNumber != undefined && this.groupNumber != "")? errorMsg.push("Please Check GroupNumber"):"";
    !(this.coverageType != null && this.coverageType != undefined && this.coverageType != "")? errorMsg.push("Please Check CoverageType"):"";
    !(this.effectiveDate != null && this.effectiveDate != undefined && this.effectiveDate != "")? errorMsg.push("Please Check Effective Date"):"";
    !(this.expirationDate != null && this.expirationDate != undefined && this.expirationDate != "")? errorMsg.push("Please Check Expiration Date"):"";
    return errorMsg;
  }

  validateEmailPasswordDetails(): any {
    let errorMsg = new Array<string>;
    !(this.email != null && this.email != undefined && this.email != "")? errorMsg.push("Please Check Email"):"";
    !(this.password != null && this.password != undefined && this.password != "")? errorMsg.push("Please Check Password"):"";
    !(this.confirmPassword != null && this.confirmPassword != undefined && this.confirmPassword != "")? errorMsg.push("Please Check Confirm Password"):"";
    (this.password != this.confirmPassword)?errorMsg.push("Password and Confirm Password Not Matched"):"";
    return errorMsg;
  }

  currentStep: number = 1;
  nextStep(currentStepId: string, nextStepId: string): void {
    document.getElementById(currentStepId)?.classList.remove('active');
    document.getElementById(nextStepId)?.classList.add('active');
    this.currentStep++;
  }

  prevStep(currentStepId: string, prevStepId: string): void {
    document.getElementById(currentStepId)?.classList.remove('active');
    document.getElementById(prevStepId)?.classList.add('active');
    this.currentStep--;
  }

  showPassColor:boolean=false;
  showConfPassColor:boolean=false;
  showPassword(){
    if(this.showPass.nativeElement.type=='password'){
      this.showPass.nativeElement.type='text';
      this.showPassColor=true;
    }else if(this.showPass.nativeElement.type=='text'){
      this.showPass.nativeElement.type='password';
      this.showPassColor=false;
    }
  }
  showConfirmPassword(){
    if(this.showConfPass.nativeElement.type=='password'){
      this.showConfPass.nativeElement.type='text';
      this.showConfPassColor=true;
    }else if(this.showConfPass.nativeElement.type=='text'){
      this.showConfPass.nativeElement.type='password';
      this.showConfPassColor=false;
    }
  }

  verifyPassword(): boolean {
    let password : string= this.password as string;
    if(password === "")
      return true;
    const minLength = /.{9,15}/;
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
    const hasUpperCase = /[A-Z]/;
    const hasLowerCase = /[a-z]/;
    const hasNumber = /\d/;
    const meetsLength = minLength.test(password);
    const hasSpecial = hasSpecialChar.test(password);
    const hasUpper = hasUpperCase.test(password);
    const hasLower = hasLowerCase.test(password);
    const hasNum = hasNumber.test(password);
    return meetsLength && hasSpecial && hasUpper && hasLower && hasNum;
  }

  verifyConfirmPassword(): boolean{
    let password : string= this.confirmPassword as string;
    if(password === "")
      return true;
    const minLength = /.{9,15}/;
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
    const hasUpperCase = /[A-Z]/;
    const hasLowerCase = /[a-z]/;
    const hasNumber = /\d/;
    const meetsLength = minLength.test(password);
    const hasSpecial = hasSpecialChar.test(password);
    const hasUpper = hasUpperCase.test(password);
    const hasLower = hasLowerCase.test(password);
    const hasNum = hasNumber.test(password);
    return meetsLength && hasSpecial && hasUpper && hasLower && hasNum;
  }

}
