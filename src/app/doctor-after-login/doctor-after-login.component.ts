import { ChangeDetectorRef, Component, ViewChild} from '@angular/core';
import { Doctor } from '../model/doctor';
import { HttpServiceService } from '../service/http-service.service';
import { Router } from '@angular/router';
import { DataSharingServceService } from '../service/data-sharing-servce.service';
import { Patient } from '../model/patient';
import { Observable, Subscription, interval, map } from 'rxjs';
import { DoctorDailyAppointment } from '../model/doctor-daily-appointment';
import { Accordion } from '../model/accordion.interface';
import { Appointments } from '../model/appointments';

@Component({
  selector: 'app-doctor-after-login',
  templateUrl: './doctor-after-login.component.html',
  styleUrls: ['./doctor-after-login.component.css']
})
export class DoctorAfterLoginComponent {

  activeClass : String = "active";
  activeFlag: String = "one";
  appointmentFlag : String = "active";
  doctorLoginFlag : String = "none";
  doctorObject : Doctor = new Doctor();
  doctorObjectEdit : Doctor = new Doctor();
  doctorObjectPassword : Doctor = new Doctor();
  selectedFile: File | null = null;
  todaysDate = new Date();
  time$!: Observable<Date>;
  private subscription!: Subscription;
  dailyAppointmentCount :number= 0;

  timeSlots: { [key: string]: string }[] = [
    { key: 'slot1', value: '9:00AM-9:30AM' },
    { key: 'slot2', value: '9:30AM-10:00AM' },
    { key: 'slot3', value: '10:00AM-10:30AM' },
    { key: 'slot4', value: '10:30AM-11:00AM' },
    { key: 'slot5', value: '11:00AM-11:30AM' },
    { key: 'slot6', value: '11:30AM-12:00AM' },
    { key: 'slot7', value: '1:00PM-1:30PM' },
    { key: 'slot8', value: '1:30PM-2:00PM' },
    { key: 'slot9', value: '2:00PM-2:30PM' },
    { key: 'slot10', value: '2:30PM-3:00PM' },
    { key: 'slot11', value: '3:00PM-3:30PM' },
    { key: 'slot12', value: '3:30PM-4:00PM' }
  ];
  
  constructor(private _httpService : HttpServiceService,
    private cdr: ChangeDetectorRef,
    private _router : Router,
    private _dataSharing : DataSharingServceService){
  }

  ngOnInit(){
    let doctorString = localStorage.getItem("doctorObjectData");
    if(doctorString !=null){
      try {
        this.doctorObject = JSON.parse(doctorString);
        this.doctorObjectEdit = JSON.parse(doctorString);
        this.doctorObjectPassword = JSON.parse(doctorString);
        this.getProfilePic();
        this.getTodaysAllAppointment();
      } catch (e) {
        console.error('Error parsing user data from local storage:', e);
      }
    }

    this.showAllDoctors();
    this.showAllPatients();
    const fileInput1 = document.getElementById('fileInput');
    if(fileInput1){
      fileInput1.addEventListener('change',()=>{
        const fileInput = document.getElementById('fileInput') as HTMLInputElement;
        if (fileInput && fileInput.files && fileInput.files.length > 0) {
          if (window.confirm('Are you sure?, Do you want to change the profile pic.')) {
            this.selectedFile = fileInput.files[0];
            console.log('File selected:', fileInput.files[0].name);
            this.compressProfilePic();
          }
        } else {
          console.log('No file selected');
        }
      });
    }

    this.time$ = interval(1000).pipe(
      map(() => new Date())
    );

    this.subscription = this.time$.subscribe(time => {
      this.todaysDate = time;
    });
  }
  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
  profileFlag : boolean = false;
  profilePicSrc: string | ArrayBuffer | undefined;
  getProfilePic() {
    this._httpService.getDoctorProfilePic(this.doctorObject.doctor_id,this.doctorObject.password).subscribe((data:any)=>{
      const reader = new FileReader();
      this.profilePicSrc = "";
      reader.onload = () => {
        this.profilePicSrc = reader.result ?? '';
        if(this.profilePicSrc === "data:application/octet-stream;base64,"){
          this.profileFlag = false;
        }else{
          this.profileFlag = true;
        }
        this.cdr.detectChanges();
      };
      reader.readAsDataURL(new Blob([data]));
    });
  }

  updateProfile(file:File){

  }

  SubmitProfilePic(file:File) {
    if (!file) {
      alert('No file selected.');
      return;
    }
    this._httpService.uploadDoctorProfile(this.doctorObject.doctor_id,this.doctorObject.password,file).subscribe((data : any)=>{
      alert(data);
      if(data){
        this.getProfilePic();
      }
    });
  }

  compressProfilePic() {
    if (this.selectedFile) {
      console.log('Original file size:', this.selectedFile.size, 'bytes');
      const reader = new FileReader();
      reader.onload = (event) => {
        const target = event?.target;
        if (!target) {
          console.error('Event target is null or undefined.');
          return;
        }
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            console.error('Unable to get canvas context.');
            return;
          }
          const maxWidth = 800;
          const maxHeight = 600;
          let width = img.width;
          let height = img.height;
          if (width > height) {
            if (width > maxWidth) {
              height *= maxWidth / width;
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width *= maxHeight / height;
              height = maxHeight;
            }
          }
          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);
          canvas.toBlob((blob) => {
            if (!blob) {
              console.error('Error creating blob.');
              return;
            }
            const compressedFile = new File([blob], 'compressed_image.jpg', { type: 'image/jpeg' });
            this.selectedFile=compressedFile;
            const compressedSize = this.selectedFile.size;
            this.SubmitProfilePic(compressedFile);
            console.log('Compressed file size:', compressedSize, 'bytes');
            }, 'image/jpeg', 0.3);
        };
        img.src = target.result as string;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  openMenuTab(flag:String){
    this.activeFlag = flag;
    this.activeClass = "";
  }
  openMenuTabPopup(flag:String){
    this.doctorLoginFlag = "none";
    this.activeFlag = flag;
    this.activeClass = "";
  }
  openAppointment(flag:String){
    this.appointmentFlag = flag;
  }
  openPopup(){
    this.doctorLoginFlag = "block";
  }
  cancelDoctorLogin(){
    this.doctorLoginFlag = "none";
  }

  logout(){
    localStorage.removeItem("doctorObjectData");
    this._router.navigate(["/management"]);
  }

  saveDoctor(){
    this._httpService.updateDoctorInformation(this.doctorObjectEdit).subscribe((data)=>{
      alert(data);
      if(data == "INFORMATION UPDATED SUCCESS!."){
        let jsonString = JSON.stringify(this.doctorObjectEdit);
        localStorage.setItem('doctorObjectData', jsonString);
        alert(data);
      }
    });
  }
  doctorList : Doctor[] = [];
  patientList : Patient[] = [];
  doctorsCount : number = 0;
  patientCount : number = 0;

  showAllDoctors(){
    this._httpService.getAllDoctors().subscribe((data)=>{
      this.doctorList = data;
      this.doctorsCount = this.doctorList.length;
      this._dataSharing.sendDoctorListData(this.doctorList);
    })
  }

  showAllPatients(){
    this._httpService.getAllPatients().subscribe((data)=>{
      this.patientList = data;
      this.patientCount = this.patientList.length;
    })
  }

  showPatientsPopUpFlag : String = "none";
  showdoctorsPopUpFlag : String = "none";
  patientEmergencyContact : String = "none";
  appointmentUpgrade : String = "none";

  closeAppointmentUpgrade(){
    this.appointmentUpgrade = "none";
  }
  closeShowPatientsPopUp(){
    this.showPatientsPopUpFlag = "none";
  }
  openShowPatientsPopUp(){
    this.showPatientsPopUpFlag = "block";
  }
  closeShowDoctorsPopUp(){
    this.showdoctorsPopUpFlag = "none";
  }
  openShowDoctorsPopUp(){
    this.showdoctorsPopUpFlag = "block";
  }
  openEmergencyPopUp(){
    this.patientEmergencyContact = "block";
  }
  closeEmergencyPopup(){
    this.patientEmergencyContact = "none";
  }

  dailyActive: DoctorDailyAppointment = new DoctorDailyAppointment();
  dailyActiveAppointmentCount : number = 0;
  dailyCancelAppointmentCount : number = 0;
  patientMapData : Map<String,Patient> = new Map<String,Patient>();
  appointmentList: Appointments[] = [];

  getTodaysAllAppointment(){
    this._httpService.getTodaysAllAppointment(this.doctorObject.doctor_id).subscribe((data : any)=>{
      this.dailyActive = data;
      if (data.patients) {
        this.patientMapData = new Map(Object.entries(data.patients));
        this.dailyAppointmentCount = this.patientMapData.size;
        this.appointmentList = data.appointments;
      } else {
        this.dailyAppointmentCount = 0;
      }
      
    });
  }

  selectedPatientMeeting: Patient = new Patient;
  selectedAppointment : Appointments = new Appointments;
  slotNumber : String = "blue";

  patientAppointment(i : String){
    this.slotNumber = i;
    const patient = this.patientMapData.get(i);
    this.selectedAppointment = this.appointmentList.filter(j => j.appointmentSlot == i)[0];
    console.log(this.selectedAppointment);
    if(patient){
      this.selectedPatientMeeting = patient;
      this.appointmentUpgrade = "block";
    }else{
      alert("Appointment Slot Not Booked!");
    }
  }

  checkAppointment(i:String){
    const patient = this.patientMapData.get(i);
    if(patient){
      return true;
    }else{
      return false;
    }
  }

  accordions: Accordion[] = [
    { isActive: false },
    { isActive: false }
  ];

  toggleAccordion(index: number): void {
    this.accordions[index].isActive = !this.accordions[index].isActive;
  }
  
  @ViewChild('showPass') showPass: any;
  @ViewChild('showPass1') showPass1: any;
  showOldPassColor:boolean=false;
  showNewPassColor:boolean=false;

  showOldPassword(){
    if(this.showPass.nativeElement.type=='password'){
      this.showPass.nativeElement.type='text';
      this.showOldPassColor=true;
    }else if(this.showPass.nativeElement.type=='text'){
      this.showPass.nativeElement.type='password';
      this.showOldPassColor=false;
    }
  }

  showNewPassword(){
    if(this.showPass1.nativeElement.type=='password'){
      this.showPass1.nativeElement.type='text';
      this.showNewPassColor=true;
    }else if(this.showPass1.nativeElement.type=='text'){
      this.showPass1.nativeElement.type='password';
      this.showNewPassColor=false;
    }
  }

  changePassword(){
    this._httpService.changePassword(this.doctorObjectPassword).subscribe((data)=>{
      this.doctorObject.password = this.doctorObjectPassword.newpassword;
      let jsonString = JSON.stringify(this.doctorObject);
        localStorage.setItem('doctorObjectData', jsonString);
        alert(data);
    })
  }

  FinishAppointment(){
    this.selectedAppointment.status = "FINISH";
    console.log(this.selectedAppointment); 
    this._httpService.saveAppointment(this.selectedAppointment).subscribe((data) => {
      alert(data);
      this.patientAppointment(this.selectedAppointment.appointmentSlot);
    })
  }
}
