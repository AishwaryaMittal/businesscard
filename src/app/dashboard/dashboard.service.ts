import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { of } from 'rxjs';
import { LoginService } from '../login/login.service';
import { AngularFireDatabase } from '@angular/fire/database';
import { Timestamp } from 'rxjs/internal/operators/timestamp';

@Injectable()
export class DashboardService {
  eventHistoryRef: any;
  savedCardsRef: any;

  constructor(private loginService: LoginService, private db: AngularFireDatabase) {

    this.eventHistoryRef = this.db.list(`currentSession/${this.loginService.userUid}/searches`);
    this.savedCardsRef = this.db.list(`users/${this.loginService.userUid}/savedCards`);
    console.log("DASHBOARD SERVICE CONSTRUCTOR");
  }

  getEventHistory() {
    return this.eventHistoryRef.valueChanges();
  }

  logEvent(event: string) {
    // TODO: update this to push object with timestamp:Date.now()
    this.eventHistoryRef.push({event});
  }

  getSavedCards() {
    return this.savedCardsRef.valueChanges();
  }

  addCard(card: any) {
    this.savedCardsRef.push(card);
  }
}
