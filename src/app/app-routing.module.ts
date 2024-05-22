import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PatientLoginComponent } from './patient-login/patient-login.component';
import { DoctorAfterLoginComponent } from './doctor-after-login/doctor-after-login.component';
import { PatientalPortalManagementComponent } from './patiental-portal-management/patiental-portal-management.component';
import { doctorguardGuard } from './guards/doctorguard.guard';
import { patientguardGuard } from './guards/patientguard.guard';

const routes: Routes = [
  {path:"",component:HomeComponent},
  {path:"patientAfterLogin",component:PatientLoginComponent,
    canActivate:[patientguardGuard]
  },
  {path:"doctorAfterLogin",component:DoctorAfterLoginComponent,
    canActivate: [doctorguardGuard]
  },
  {path:"management",component:PatientalPortalManagementComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { 

}
