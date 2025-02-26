import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private http = inject(HttpClient);
  private apiKey = 'da2c6a4ace8f100ef3189e61ad4e44ee';
  private apiUrl = 'https://api.openweathermap.org/data/2.5/weather';

  loadWeather(city: string): Observable<any> {
    return this.http.get(`${this.apiUrl}?q=${city}&appid=${this.apiKey}&units=metric&lang=es`);
  }
}
