import { Component } from '@angular/core';
import { DataSharingServceService } from '../service/data-sharing-servce.service';
import { Doctor } from '../model/doctor';
import { HttpServiceService } from '../service/http-service.service';
import { AppointmentTimeTable } from '../model/appointment-time-table';
import { Patient } from '../model/patient';
import { PatientAddress } from '../model/patient-address';
import { PatientInsuranceInfo } from '../model/patient-insurance-info';
import { Appointments } from '../model/appointments';

@Component({
  selector: 'app-patient-login-sections',
  templateUrl: './patient-login-sections.component.html',
  styleUrls: ['./patient-login-sections.component.css']
})
export class PatientLoginSectionsComponent {

  activeFlag : boolean = true;
  appointment : boolean = true;
  viewAppointment : boolean = false;
  bookAppointment : boolean = false;
  deleteAppointment : boolean = false;
  doctorList : Doctor[] = [];
  appointmentTimeTable : AppointmentTimeTable[] = [];
  appointmentTimeTable1 : AppointmentTimeTable[] = [];
  appointTimeTable : AppointmentTimeTable = new AppointmentTimeTable();
  timeTable!: String[];
  patientObject : Patient = new Patient();
  patientAddressObject : PatientAddress = new PatientAddress();
  patientInsuranceObject : PatientInsuranceInfo = new PatientInsuranceInfo();
  upcomingAppointments : Appointments[] = [];
  previousAppointments : Appointments[] = [];
  // one:boolean=false;
  // two:boolean=false;
  // three:boolean=false;
  // bookFlag:boolean=false;

  constructor(private _dataService : DataSharingServceService,
    private _httpService : HttpServiceService){}

  ngOnInit(){
    this.appointment= true;
    
    let PatientString : string | null = localStorage.getItem("patientObjectData");
    if(PatientString !=null){
      try {
        this.patientObject = JSON.parse(PatientString);
        this.patientAddressObject = this.patientObject.address;
        this.patientInsuranceObject = this.patientObject.insuranceInfo;
      } catch (e) {
        console.error('Error parsing user data from local storage:', e);
      }
    }

    this._dataService.getDoctorListData().subscribe((data : Doctor[]) => {
      this.doctorList = data;
    });

    this.getPatientsActiveAppointments();
    this.getPatientsPreviousAppointments();
  }

  public showAppointment(flag : String){
    if(flag == "view"){
      this.viewAppointment = true;
      this.bookAppointment = false;
      this.deleteAppointment = false;
      this.appointment = false;
    }else if(flag == "book"){
      this.viewAppointment = false;
      this.bookAppointment = true;
      this.deleteAppointment = false;
      this.appointment = false;
    }else if(flag == "delete"){
      this.viewAppointment = false;
      this.bookAppointment = false;
      this.deleteAppointment = true;
      this.appointment = false;
    }
  }

  closeAppointment(){
    this.appointment = true;
    this.viewAppointment = false;
    this.bookAppointment = false;
    this.deleteAppointment = false;
  }

  selectDoctor(e : any){
    if(""!=e.target.value){
      this.getAppointmentTimeTable(e.target.value);
    }
  }

  getAppointmentTimeTable(doctorId : String){
    this._httpService.getAppointmentTimeTable(doctorId).subscribe((data:AppointmentTimeTable[]) => {
      this.appointmentTimeTable = data;
      console.log(this.appointmentTimeTable);
    });
  }

  getPatientsActiveAppointments(){
    this._httpService.getPatientsActiveAppointments(this.patientObject.patientId).subscribe((data : any)=>{
      this.upcomingAppointments = data;
    });
  }

  getPatientsPreviousAppointments(){
    this._httpService.getPatientPreviousAppointments(this.patientObject.patientId).subscribe((data : any)=>{
      this.previousAppointments = data;
    });
  }

  selectDoctor1(e : any){
    if(""!=e.target.value){
      this._httpService.getAppointmentTimeTable(e.target.value).subscribe((data:AppointmentTimeTable[]) => {
        this.appointmentTimeTable1 = data;
        // this.one = true;
      });
    }
  }

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

  selectDate(e:any){
    const appointTT = this.appointmentTimeTable1.find(it => it.date == e.target.value);
    if(appointTT){
      this.appointTimeTable = appointTT;
      this.timeTable = [];
      for (let i = 1; i <= 12; i++) {
        const slotWithTime = "slot" + i;
        if ((this.appointTimeTable as any)[slotWithTime] == null) {
            const time = this.timeSlots.find(slot => slot['key'] === slotWithTime)?.['value'];
            if (time) {
                const s = `${slotWithTime} ${time}`;
                this.timeTable.push(s);
            }
        }
    }
    
    }
  }
  
  selectedSlot!: number;
  selectSlot(e:any){
    this.selectedSlot = e.target.value.toString().split(" ")[0];
  }

  bookAppointmentSubmit(){
    (this.appointTimeTable as any)[this.selectedSlot] = this.patientObject.patientId;
    this.appointTimeTable.selectedSlot = this.selectedSlot+"";
    this.appointTimeTable.patientInsert = this.patientObject.patientId;
    console.log(this.appointTimeTable);
    this._httpService.bookAppointmentSubmit(this.appointTimeTable).subscribe((data:any)=>{
      alert(data);
      this.getAppointmentTimeTable(this.appointTimeTable.doctor_id);
      this.getPatientsActiveAppointments();
    });
  }

  viewSelectedAppointment : Appointments = new Appointments();
  appointmentUpgrade : String = "none";
  viewPreviousAppointment(i : Appointments){
    this.viewSelectedAppointment = i;
    this.appointmentUpgrade = "block";
    console.log(this.viewSelectedAppointment);
  }
  closeAppointmentUpgrade(){
    this.appointmentUpgrade = "none";
  }
}
