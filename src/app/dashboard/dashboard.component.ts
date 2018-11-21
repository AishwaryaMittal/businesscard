import { Component, OnInit } from '@angular/core';
import { DashboardService } from './dashboard.service';
import { Http } from '@angular/http';
import { googleVision } from '../../environments/environment';
import { Card } from '../card';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  savedCards: any[];

  constructor(
    private dashboardService: DashboardService, 
    private http: Http,
  ) { }
    
  ngOnInit() {
    this.dashboardService.getSavedCards().subscribe( (results) => {
      console.log("SAVED CARDS");
      console.log(results);
      console.log("SAVED CARDS");
      this.savedCards = results;
    })
  }

  textDetection() {
    console.log("TEXTDETECTION method");
    const request: any = {
      'requests': [
        {
          'image': {
            'source': {
              'imageUri': 'https://lh3.googleusercontent.com/-sQsJlPZIPTc/ThwkpQeADtI/AAAAAAAAAuI/MWUH1I_7X0A/w530-h289-n/patrick-bateman-card.png',
            },
          },
          'features': [
            {
              'type': 'TEXT_DETECTION',
              'maxResults': 1,
            }
          ]
        }
      ]
  };
  const url = `https://vision.googleapis.com/v1/images:annotate?key=${googleVision}`;
  this.http.post(
    url,
    request
  ).subscribe( (results: any) => {
    console.log('RESULTS RESULTS RESULTS');
    console.log(results);
    console.log('RESULTS RESULTS RESULTS');
    var card = this.parseText(results);
    this.addCardToDB(card);
  });
  }

  parseText(cardTexts: any[]): Card {
    var card = new Card();
    card.firstName = "Jenny";
    card.lastName = "Terlinden";
    card.phoneNumber = "262-313-7285";
    card.email = "jenterlinden@gmail.com";
    card.additionalText = "DePaul graduate student";
    card.imageUri = 'https://lh3.googleusercontent.com/-sQsJlPZIPTc/ThwkpQeADtI/AAAAAAAAAuI/MWUH1I_7X0A/w530-h289-n/patrick-bateman-card.png'
    return card;
  }

  addCardToDB(card: Card) {
    this.dashboardService.addCard(card);
    this.dashboardService.logEvent(`Added business card for ${card.firstName} ${card.lastName}.`);
  }

  getSavedCards() {
    this.dashboardService.getSavedCards();
  }
}
