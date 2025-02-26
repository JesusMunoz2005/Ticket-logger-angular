import { Component, OnInit, inject, signal } from '@angular/core';
import { WeatherService } from '../../services/weather.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-weather',
  standalone: true,
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.css'],
  imports: [CommonModule, FormsModule]
})
export class WeatherComponent implements OnInit {
  private weatherService = inject(WeatherService);
  city = signal('Madrid'); 
  weatherInformation: any;

  ngOnInit(): void {
    this.getWeather();
  }

  getWeather() {
    const cityValue = this.city(); 

    if (!cityValue) return;
    
    this.weatherService.loadWeather(cityValue).pipe(take(1)) 
      .subscribe({
        next: (data) => this.weatherInformation = data,
        error: (error) => console.error('Error obteniendo el clima', error)
      });
  }
}
