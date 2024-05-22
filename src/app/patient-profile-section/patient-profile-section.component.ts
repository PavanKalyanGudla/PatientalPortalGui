import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { DataSharingServceService } from '../service/data-sharing-servce.service';
import { Patient } from '../model/patient';
import { PatientAddress } from '../model/patient-address';
import { PatientInsuranceInfo } from '../model/patient-insurance-info';
import { HttpServiceService } from '../service/http-service.service';
import { ResponseObject } from '../model/response-object';

@Component({
  selector: 'app-patient-profile-section',
  templateUrl: './patient-profile-section.component.html',
  styleUrls: ['./patient-profile-section.component.css']
})
export class PatientProfileSectionComponent {

  activeFlag : String = "one";
  @ViewChild('showPass') showPass: any;
  showPassColor:boolean=false;

  showPassword(){
    if(this.showPass.nativeElement.type=='password'){
      this.showPass.nativeElement.type='text';
      this.showPassColor=true;
    }else if(this.showPass.nativeElement.type=='text'){
      this.showPass.nativeElement.type='password';
      this.showPassColor=false;
    }
  }

  public openProfile(flag:String){
    this.activeFlag = flag;
  }

  patient: Patient = new Patient();
  patientAddress : PatientAddress = new PatientAddress();
  insuranceInfo : PatientInsuranceInfo = new PatientInsuranceInfo();

  patientObject : Patient = new Patient();
  patientAddressObject : PatientAddress = new PatientAddress();
  patientInsuranceObject : PatientInsuranceInfo = new PatientInsuranceInfo();

  enableEditing : boolean = false;
  
  constructor(private _dataSharing : DataSharingServceService,
    private _httpService : HttpServiceService,
    private cdr: ChangeDetectorRef){}

  ngOnInit(){
    let PatientString : string | null = localStorage.getItem("patientObjectData");
    if(PatientString !=null){
      try {
        this.patientObject = JSON.parse(PatientString);
        this.patientAddressObject = this.patientObject.address;
        this.patientInsuranceObject = this.patientObject.insuranceInfo;
        this.patient = JSON.parse(PatientString);
      } catch (e) {
        console.error('Error parsing user data from local storage:', e);
      }
    }
    
  }

  onDateChange(event: any) {
    const selectedDate = event.target.value;
    if(selectedDate != ""){
      this.patient.age = this.calculateAge(selectedDate)+"";
    }else{
      this.patient.age = "";
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

  patientCopy: Patient = new Patient();

  saveUpdated(){
    if(!this.enableEditing){
      alert("Enable Editing Flag is False. Cannot Update Changes!");
    }else{
      this._httpService.userLogin(this.patientObject.patientId , this.patientAddressObject.password).subscribe((data : any) => {
        if(data){
          this.patientCopy = data.patient;
          this.patient.profilePic = this.patientCopy.profilePic;
          this.save();
        }
      });
    }
  }

  save(){
    this._httpService.updatePatientInfo(this.patient).subscribe((data)=>{
      if(data == "PATIENT INFORMATION UPDATED SUCCESS!."){
        let jsonString = JSON.stringify(this.patient);
        localStorage.setItem('patientObjectData', jsonString);
        alert(data);
      }
    });
  }

}
