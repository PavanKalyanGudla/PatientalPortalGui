import { AppointmentTimeTable } from "./appointment-time-table";
import { Appointments } from "./appointments";
import { Patient } from "./patient";

export class DoctorDailyAppointment {
    timeTable!: AppointmentTimeTable;
	patients!:Map<String,Patient>;
    appointments!: Appointments[];
}
