import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
<<<<<<< HEAD

@Component({
  selector: 'app-header',
  imports: [RouterLink, CommonModule],
=======
import { NotificationsComponent } from "../../shared/notifications/notification.component";

@Component({
  selector: 'app-header',
  imports: [RouterLink, CommonModule, NotificationsComponent],
>>>>>>> 3875b4f (weather)
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  isLoggedIn = false; // Estado local de autenticación.
  private subscription: Subscription | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    // Suscriptor al estado de autenticación.
    this.subscription = this.authService.isLoggedIn().subscribe((loggedIn) => {
      this.isLoggedIn = loggedIn;
    });
  }

  logout() {
    this.authService.logout(); // Llamar al método de logout del servicio.
  }

  ngOnDestroy() {
    // Cancelar la suscripción al destruir el componente.
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
