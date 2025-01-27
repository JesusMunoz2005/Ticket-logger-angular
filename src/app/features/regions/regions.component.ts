import { Component, OnInit } from '@angular/core'; // Importa las utilidades necesarias para el componente.
import { CommonModule } from '@angular/common'; // Importa CommonModule para directivas como ngIf y ngFor.
import { Router } from '@angular/router'; // Importa el Router para realizar la redirección.
import { RegionService } from '../../core/services/region.service';

@Component({
  selector: 'app-regions', // Selector del componente.
  standalone: true, // Define si es un componente independiente.
  imports: [CommonModule], // Módulos necesarios para las funcionalidades comunes de Angular.
  templateUrl: './regions.component.html', // Archivo de plantilla HTML asociado.
  styleUrls: ['./regions.component.scss'], // Archivo de estilos SASS asociado.
})
export class RegionsComponent implements OnInit {
  regions: any[] = []; // Almacena las regiones obtenidas del servicio.
  error: string | null = null; // Almacena un mensaje de error si ocurre.

  constructor(
    private regionService: RegionService, // Inyecta el servicio RegionService.
    private router: Router // Inyecta el servicio Router para redirecciones.
  ) {}

  ngOnInit(): void {
    // Llama al servicio para obtener las regiones mediante un observable.
    this.regionService.fetchRegions().subscribe({
      // Manejo exitoso de la respuesta:
      next: (res: any) => {
        this.regions = res;
      },
      // Manejo de errores:
      error: (err) => {
        if (err.status === 403) {
          // Si el error es 403, redirige al componente ForbiddenComponent.
          this.router.navigate(['/forbidden']);
        } else {
          // Si ocurre otro error, muestra un mensaje genérico.
          this.error = 'An error occurred';
        }
      },
    });
  }
}
