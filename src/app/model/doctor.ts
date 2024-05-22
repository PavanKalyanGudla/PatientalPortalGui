import { PatientAddress } from "./patient-address";

export class Doctor {

    doctor_id!:String;
    first_name :String | undefined;
    last_name :String | undefined;
    specialization :String | undefined;
    email :String | undefined;
    password !:String;
    newpassword !:String;
    phone_number :String | undefined;
    address : PatientAddress = new PatientAddress;
    city :String | undefined;
    state :String | undefined;
    country :String | undefined;
    postal_code :String | undefined;
    bio :String | undefined;
    profilePic :Blob | undefined;
    date_of_birth :String | undefined;
    gender :String | undefined;
    date_added :String | undefined;
    date_updated :String | undefined;
}
