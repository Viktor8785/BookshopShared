import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { BooksModule } from './books/books.module';
import { UsersModule } from './users/users.module';
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared/shared.module';
import { AppComponent } from './app.component';
import { environment } from 'src/environments/environment';
import { AngularFireAuthModule, PERSISTENCE} from '@angular/fire/compat/auth'
import { AngularFireModule } from '@angular/fire/compat'
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { httpInterceptorProviders } from './shared/index.interceptor';
import { ErrorMessageComponent } from './shared/error.message/error.message.component';

@NgModule({
  declarations: [
    AppComponent,
    ErrorMessageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BooksModule,
    UsersModule,
    SharedModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    AngularFirestoreModule,
    BrowserAnimationsModule
  ],
  providers: [{ provide: PERSISTENCE, useValue: 'session' }, httpInterceptorProviders],
  bootstrap: [AppComponent],
  exports: [
    ErrorMessageComponent
  ]
})
export class AppModule { }
