import { PatientInsuranceInfo } from "./patient-insurance-info";
import { PatientAddress } from "./patient-address";

export class Patient {
    patientId!: String;
	firstName:String | undefined;
	lastName:String | undefined;
	age:String | undefined;
    dob : String | undefined;
    maritialStatus : String | undefined; //(Single, Married, Divorced, etc.)
	profilePic: Blob | undefined;
	gender : String | undefined;
	address:PatientAddress = new PatientAddress;
	insuranceInfo: PatientInsuranceInfo = new PatientInsuranceInfo;
}