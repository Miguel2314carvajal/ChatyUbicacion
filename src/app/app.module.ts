import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import {environment} from '../environments/environment'
import {getAuth,provideAuth} from '@angular/fire/auth'
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import {getStorage, provideStorage} from '@angular/fire/storage'
import { Geolocation } from '@capacitor/geolocation'


@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, 
  provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
  provideAuth(()=>getAuth()),
  provideStorage(()=>getStorage()),
  provideFirestore(() => getFirestore())],
  bootstrap: [AppComponent],
})
export class AppModule {}
