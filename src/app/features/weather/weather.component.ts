import { Component, OnInit } from '@angular/core';
import { WeatherService } from '../../core/services/weather.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  imports:[CommonModule, FormsModule],
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.scss']
})
export class WeatherComponent implements OnInit {
  weatherData: any;
  errorMessage: string | null = null;

  constructor(private weatherService: WeatherService) {}

  ngOnInit() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          this.fetchWeather(lat, lon);
        },
        (error) => {
          this.errorMessage = 'No se pudo obtener la ubicación.';
          console.error(error);
        }
      );
    } else {
      this.errorMessage = 'La geolocalización no es soportada por este navegador.';
    }
  }

  fetchWeather(lat: number, lon: number) {
    this.weatherService.getWeatherByCoords(lat, lon).subscribe(
      (data) => {
        this.weatherData = data;
      },
      (error) => {
        this.errorMessage = 'Error obteniendo el clima.';
        console.error(error);
      }
    );
  }
}
