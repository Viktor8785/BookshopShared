import { Injectable } from '@angular/core';
import { getAuth, updateProfile, updatePassword, updateEmail } from "firebase/auth";
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { EmitService } from 'src/app/shared/emit.service';  
import { Observable, mergeMap, of, EMPTY, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isAdminUid = false;
  userData: any = null;
  userDataId: string = '';
  private subscr!: Subscription;
  private subscr2!: Subscription;

  constructor(private emitService: EmitService, private afAuth: AngularFireAuth) {
    this.authState();
   }

  authAdminUid(): Observable<boolean> {
    return this.afAuth.authState.pipe(
      mergeMap(user => {
        if(user && user.uid) {
          if(user.uid == 'WQbaNd6UecNyeqtnjV0WXguenSi2') {
            return of(true);
          } else {
            return EMPTY;
          }
        } else {
          return EMPTY;
        }
      })
    );
  }
  
  authUserUid(): Observable<boolean> {
    return this.afAuth.authState.pipe(
      mergeMap(user => {
        if(user && user.uid) {
          return of(true);
        } else {
          return EMPTY;
        };
      })
    );
  }
  
  authState() {
    if(!this.subscr2) {
      this.subscr2 = this.authAdminUid().subscribe(admin => this.isAdminUid = admin);
    };
    if(!this.subscr) {
      this.subscr = this.afAuth.authState.subscribe((user) => {
        if(user) {
          this.userData = user;
          this.userDataId = user.uid;
          localStorage.setItem('user', JSON.stringify(this.userData));
        } else {
          this.userData = null;
          this.userDataId = '';
          localStorage.setItem('user', 'null');
        }
        this.emitService.emitAuthState(this.userDataId);
      });
    };
  }
   
  get isAdmin() {
    return this.isLoggedIn && this.isAdminUid;
  }
  
  get isLoggedIn() {
    const user = this.userData;
    const userLocalStorage = JSON.parse(localStorage.getItem('user')!);
    return user !== null && user?.emailVerified;
  } 
  
  
  updateEmail(newEmail: string, userPassword: string) {
    updateEmail(getAuth().currentUser as any, newEmail)
    .then(() => {
      this.afAuth.signOut().then(() => {
        this.afAuth.signInWithEmailAndPassword(newEmail, userPassword)
        .then((userCredential) => {
          this.SendVerificationMail();
          this.authState();
        });
      });
      this.emitService.emitUpdateEmail('success');
    })
    .catch((error) => {
      this.emitService.emitUpdateEmail(error.code as string);
    });
  }
  
  updatePassword(newPassword: string) {
    updatePassword(getAuth().currentUser as any, newPassword)
    .then(() => {
      this.emitService.emitUpdatePassword('success');
    }).catch((error) => {
      this.emitService.emitUpdatePassword(error.code as string);
    });
  }
  
  signIn(userLogin: string, userPassword: string) {
    this.afAuth.signInWithEmailAndPassword(userLogin, userPassword)
    .then(() => {
      this.authState();
      this.emitService.emitSignInCode('success');
    })
    .catch((error) => {
      this.emitService.emitSignInCode(error.code as string);
    });
  }

  sendResetPasswordEmail(userLogin: string) {
    this.afAuth.sendPasswordResetEmail(userLogin)
    .then(() => {
      this.emitService.emitSendResetPasswordEmail('success');
    })
    .catch((error) => {
      this.emitService.emitSendResetPasswordEmail(error.code as string);
    });
  }

  SendVerificationMail() {
    this.afAuth.currentUser
    .then((u: any) => u.sendEmailVerification())
    .then(() => {});
  }

  signOut() {
    this.isAdminUid = false;
    this.afAuth.signOut().then(() => {}); 
  }

  createUser(userName: string, userLogin: string, userPassword: string) {
    this.afAuth.createUserWithEmailAndPassword(userLogin, userPassword)
    .then((userCredential) => {
      if(userCredential.user) {
        this.SendVerificationMail();
        updateProfile(getAuth().currentUser as any, { displayName: userName })
        .then(() => {});
      }
      this.emitService.emitCreateUser('success');
    })
    .catch((error) => {
      this.emitService.emitCreateUser(error.code as string);
    });
  }

  ngOnDestroy() {
    if(this.subscr) {
      this.subscr.unsubscribe();
    };
    if(this.subscr2) {
      this.subscr2.unsubscribe();
    };
  }
}
