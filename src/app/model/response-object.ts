import { Doctor } from "./doctor";
import { Patient } from "./patient";

export class ResponseObject {

    patient: Patient = new Patient;
	doctor: Doctor = new Doctor;
	responseMessage : String | undefined ;
	responseCode : String | undefined ;

}
