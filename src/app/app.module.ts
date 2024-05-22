import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule} from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { HomebodyComponent } from './homebody/homebody.component';
import { FooterComponent } from './footer/footer.component';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PatientLoginComponent } from './patient-login/patient-login.component';
import { PatientLoginSectionsComponent } from './patient-login-sections/patient-login-sections.component';
import { RegistrationComponent } from './registration/registration.component';
import { ChatbotComponent } from './chatbot/chatbot.component';
import { PatientProfileSectionComponent } from './patient-profile-section/patient-profile-section.component';
import { DoctorAfterLoginComponent } from './doctor-after-login/doctor-after-login.component';
import { PatientalPortalManagementComponent } from './patiental-portal-management/patiental-portal-management.component';
import { PharmacyComponent } from './pharmacy/pharmacy.component';
import { patientguardGuard } from './guards/patientguard.guard';
import { doctorguardGuard } from './guards/doctorguard.guard';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomebodyComponent,
    FooterComponent,
    HomeComponent,
    PatientLoginComponent,
    PatientLoginSectionsComponent,
    RegistrationComponent,
    ChatbotComponent,
    PatientProfileSectionComponent,
    DoctorAfterLoginComponent,
    PatientalPortalManagementComponent,
    PharmacyComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    RouterModule
  ],
  providers: [doctorguardGuard,patientguardGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
