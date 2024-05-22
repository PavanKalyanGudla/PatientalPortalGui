import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Patient} from '../model/patient';
import { Doctor } from '../model/doctor';
import { AppointmentTimeTable } from '../model/appointment-time-table';
import { Appointments } from '../model/appointments';
import { PatientAddress } from '../model/patient-address';
import { DoctorDailyAppointment } from '../model/doctor-daily-appointment';
import { Cart } from '../model/cart';
import { CartOrders } from '../model/cart-orders';

@Injectable({
  providedIn: 'root'
})
export class HttpServiceService {

  host: string = "http://localhost:8080";

  constructor(private httpClient : HttpClient) { }

  userLogin(patientId : String, password : String):Observable<Patient>{
    return this.httpClient.get<Patient>(this.host+"/patientLogin?patientId="+patientId+"&password="+password);
  }

  getProfilePic(patientId : String, password : String):any{
    return this.httpClient.get(this.host+"/getProfilePic?patientId="+patientId+"&password="+password,{responseType:'arraybuffer',});
  }

  patientRegistration(patient: Patient){
    return this.httpClient.post(this.host+"/addPatient",patient,{responseType: 'text'});
  }

  updatePatientInfo(patient : Patient){
    return this.httpClient.post(this.host+"/savePatient",patient,{responseType:'text'});
  }

  uploadProfile(patientId : String, password : String,file: File) : any{
    console.log(patientId);
    const formData = new FormData();
    formData.append('file', file);
    return this.httpClient.post(this.host+"/uploadPatientProfile?patientId="+patientId+"&password="+password, formData , {responseType: 'text'});
  }

  doctorLogin(doctorId : String, password : String):Observable<Doctor>{
    return this.httpClient.get<Doctor>(this.host+"/doctorLogin?doctorId="+doctorId+"&password="+password);
  }

  uploadDoctorProfile(doctorId : String, password : String,file: File) : any{
    const formData = new FormData();
    formData.append('file', file);
    return this.httpClient.post(this.host+"/uploadDoctorProfile?doctorId="+doctorId+"&password="+password, formData , {responseType: 'text'});
  }

  updateDoctorInformation(doctor : Doctor){
    return this.httpClient.post(this.host+"/updateDoctorProfile",doctor,{responseType:'text'});
  }

  getDoctorProfilePic(doctorId : String, password : String):any{
    return this.httpClient.get(this.host+"/getDoctorProfilePic?doctorId="+doctorId+"&password="+password,{responseType:'arraybuffer',});
  }

  getAllDoctors() : Observable<Doctor[]>{
    return this.httpClient.get<Doctor[]>(this.host+"/getAllDoctors");
  }

  getAppointmentTimeTable(doctorId : String):Observable<AppointmentTimeTable[]>{
    return this.httpClient.get<AppointmentTimeTable[]>(this.host+"/getAppointmentTimeTable?doctorId="+doctorId);
  }

  getPatientsActiveAppointments(patientId:String):Observable<Appointments[]>{
    return this.httpClient.get<Appointments[]>(this.host+"/getPatientsActiveAppointments?patientId="+patientId);
  }

  bookAppointmentSubmit(appointment : AppointmentTimeTable){
    return this.httpClient.post(this.host+"/bookAppointment",appointment,{responseType: 'text'});
  }

  getPatientPreviousAppointments(patientId:String):Observable<Appointments[]>{
    return this.httpClient.get<Appointments[]>(this.host+"/getPatientPreviousAppointments?patientId="+patientId);
  }

  getAllPatients():Observable<Patient[]>{
    return this.httpClient.get<Patient[]>(this.host+"/getAllPatients");
  }

  getAllPatientAddress(){
    return this.httpClient.get<PatientAddress[]>(this.host+"/getAllPatientAddress");
  }

  getTodaysAllAppointment(doctorId : String):Observable<DoctorDailyAppointment>{
    return this.httpClient.get<DoctorDailyAppointment>(this.host+"/getTodaysAllAppointment?doctorId="+doctorId);
  }

  changePassword(doctor : Doctor){
    return this.httpClient.post(this.host+"/updateDoctorPassword",doctor,{responseType:'text'});
  }

  saveAppointment(appointment : Appointments){
    return this.httpClient.post(this.host+"/UpdateCloseAppointment",appointment,{responseType:'text'});
  }

  addToCart(cart : Cart){console.log(cart);
    return this.httpClient.post(this.host+"/addToCart",cart,{responseType:'text'});
  }

  getCart(patientId : String):Observable<Cart>{
    return this.httpClient.get<Cart>(this.host+"/getPatientCart?patientId="+patientId);
  }

  placeOrders(orders : CartOrders){
    return this.httpClient.post(this.host+"/placeOrder",orders,{responseType:'text'});
  }

  getPatientOrders(patientId : String){
    return this.httpClient.get<CartOrders[]>(this.host+"/getOrders?patientId="+patientId);
  }
}
