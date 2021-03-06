import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import {Router} from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { DashboardService } from '../dashboard/dashboard.service';
// import {switchMap} from 'rxjs/operators';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/of';
import { AngularFireDatabase } from '@angular/fire/database';
// import * as firebase from 'firebase';
import * as firebase from 'firebase/app';

@Injectable()
export class LoginService {
  authState: Observable<{} | null>;

  user: Observable<{} | null>;
  userUid: string;
  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private db: AngularFireDatabase,
  ) {

    this.user = this.afAuth.authState
    .switchMap((user) => {
      if (user) {
        this.userUid = user.uid;
        console.log('SWITCHMAP');
        console.log(user);
        console.log('SWITCHMAP');
        return this.db.object(`users/${user.uid}`).update({email: user.email}).then( () => {
          return this.db.object(`users/${user.uid}`).valueChanges();
        }).catch( (error) => {
          console.log('ERROR UPDATING USER EMAIL');
          console.log(error);
          console.log('ERROR UPDATING USER EMAIL');
        });
      } else {
        return Observable.of(null);
      }
    });
  }

  loginWithEmail(email: string, password: string) {
    //return a promise
    return this.afAuth.auth.signInWithEmailAndPassword(email, password)
      .then((auth) => {
        console.log(auth.user.uid);
        const createdAt = firebase.database.ServerValue.TIMESTAMP;
        console.log('CREATED AT');
        console.log(createdAt);
        console.log('CREATED AT');
        //get sessionKey from sessions list
        const sessionKey = this.db.database
                        .ref(`sessions`)
                        .push({
                          userUid: auth.user.uid
                        }).key;

        const sessionPayload: any = {
          createdAt: createdAt,
          userUid: auth.user.uid,
          currentSessionKey: sessionKey,
        };
        //push this info so we know what time it occurred
        //cool feature: this is just a giant object of objects--can update different 
        //parts of it using the paths.
        //can have multiple payloads at diff paths, and then call update on them all
        const sessionPayloads: any = {};
        sessionPayloads[`currentSession/${auth.user.uid}`] = sessionPayload;
        sessionPayloads[`users/${auth.user.uid}/sessions/${sessionKey}`] = {'createdAt': createdAt};
        return this.db.database.ref().update(sessionPayloads);
      })
      .catch(error => {
        console.log(error);
        throw error;
      });
  }

  signOut() {
    this.afAuth.auth.signOut();
    this.router.navigate(['/']);
  }

  isAdmin(userId: string) {
    return this.db.object(`admins/${userId}`).valueChanges();
  }
}
