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
              'imageUri': 'https://www.google.com/imgres?imgurl=https%3A%2F%2Fcmkt-image-prd.global.ssl.fastly.net%2F0.1.0%2Fps%2F1795486%2F1160%2F772%2Fm1%2Ffpnw%2Fwm0%2Fscreenshot-1-.jpg%3F1477301830%26s%3D3c4ded788228414f9744207b93ad8d23&imgrefurl=https%3A%2F%2Fcreativemarket.com%2FThemeDevisers%2F984347-Business-Card&docid=am-2A12BeZj5dM&tbnid=1HWbImvdfC1ZpM%3A&vet=10ahUKEwiIwICB5OTeAhUMX60KHXbDBo0QMwiKAigUMBQ..i&w=1160&h=772&safe=active&bih=657&biw=1366&q=business%20cards&ved=0ahUKEwiIwICB5OTeAhUMX60KHXbDBo0QMwiKAigUMBQ&iact=mrc&uact=8',
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
    card.firstName = "Aishwarya";
    card.lastName = "Mittal";
    card.phoneNumber = "469-740-9853";
    card.email = "mittalaish@gmail.com";
    card.additionalText = "DePaul Computer science graduate student";
    card.imageUri = 'https://www.google.com/imgres?imgurl=https%3A%2F%2Fcmkt-image-prd.global.ssl.fastly.net%2F0.1.0%2Fps%2F1795486%2F1160%2F772%2Fm1%2Ffpnw%2Fwm0%2Fscreenshot-1-.jpg%3F1477301830%26s%3D3c4ded788228414f9744207b93ad8d23&imgrefurl=https%3A%2F%2Fcreativemarket.com%2FThemeDevisers%2F984347-Business-Card&docid=am-2A12BeZj5dM&tbnid=1HWbImvdfC1ZpM%3A&vet=10ahUKEwiIwICB5OTeAhUMX60KHXbDBo0QMwiKAigUMBQ..i&w=1160&h=772&safe=active&bih=657&biw=1366&q=business%20cards&ved=0ahUKEwiIwICB5OTeAhUMX60KHXbDBo0QMwiKAigUMBQ&iact=mrc&uact=8'
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
