import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Patient } from '../model/patient';
import { Doctor } from '../model/doctor';
import { DoctorDailyAppointment } from '../model/doctor-daily-appointment';

@Injectable({
  providedIn: 'root'
})
export class DataSharingServceService {

  constructor() { }

  private registrationService = new Subject<any>();

  private patientObjectData = new Subject<Patient>();

  private doctorListData = new Subject<Doctor[]>();

  private doctorAppointments = new Subject<DoctorDailyAppointment>();

  // private cartList = new Subject<number>();

  private cartList = new Subject<{ [key: string]: number }>();

  sendRegistrationFlag(data:any){
    this.registrationService.next(data);
  }

  getRegistrationFlag() : Observable<any>{
    return this.registrationService.asObservable();
  }

  sendPatientObject(data:any){
    this.patientObjectData.next(data);
  }

  getPatientObject() : Observable<Patient>{
    return this.patientObjectData.asObservable();
  }

  sendDoctorListData(data:any){
    return this.doctorListData.next(data);
  }

  getDoctorListData() : Observable<Doctor[]>{
    return this.doctorListData.asObservable();
  }

  getDoctorsTodaysAppointments(){
    return this.doctorAppointments;
  }

  getCartList():Observable<{ [key: string]: number }>{
    return this.cartList.asObservable();
  }

  cart: { [key: string]: number } = {};

  setCartList(data : any){
    this.cart = {};
    for(let i in data){
      if(i != "" && data[i] != 0 && data[i] != "NaN"){
        this.cart[i] = data[i];
      }
    }
    return this.cartList.next(this.cart);
  }
}
