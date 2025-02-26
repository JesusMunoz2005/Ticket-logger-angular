import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from "./layout/footer/footer.component";
import { HeaderComponent } from "./layout/header/header.component";
<<<<<<< HEAD

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FooterComponent, HeaderComponent],
=======
import { NotificationsComponent } from './shared/notifications/notification.component';
import { WeatherComponent } from './features/weather/weather.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FooterComponent, HeaderComponent, NotificationsComponent, WeatherComponent],
>>>>>>> 3875b4f (weather)
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'dwese-ticket-logger-angular';
}
