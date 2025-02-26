<<<<<<< HEAD
import { Component, OnInit } from '@angular/core'; // Importa las utilidades necesarias para el componente.
import { CommonModule } from '@angular/common'; // Importa CommonModule para directivas como ngIf y ngFor.
import { Router } from '@angular/router'; // Importa el Router para realizar la redirección.
import { RegionService } from '../../core/services/region.service';
=======
import { Component, OnInit, ViewChild } from '@angular/core'; // Importa las utilidades necesarias para el componente.
import { CommonModule } from '@angular/common'; // Importa CommonModule para directivas como ngIf y ngFor.
import { Router } from '@angular/router'; // Importa el Router para realizar la redirección.
import { RegionService } from '../../core/services/region.service';
import { MatTableModule} from '@angular/material/table';
import { MatSortModule} from '@angular/material/sort';
import { MatPaginatorModule} from '@angular/material/paginator';
import { MatTableDataSource} from '@angular/material/table';
import { MatPaginator, PageEvent} from '@angular/material/paginator';
import { MatSort, Sort} from '@angular/material/sort';

>>>>>>> 3875b4f (weather)

@Component({
  selector: 'app-regions', // Selector del componente.
  standalone: true, // Define si es un componente independiente.
<<<<<<< HEAD
  imports: [CommonModule], // Módulos necesarios para las funcionalidades comunes de Angular.
=======
  imports: [CommonModule, MatTableModule, MatPaginatorModule, MatSortModule], // Módulos necesarios para las funcionalidades comunes de Angular.
>>>>>>> 3875b4f (weather)
  templateUrl: './regions.component.html', // Archivo de plantilla HTML asociado.
  styleUrls: ['./regions.component.scss'], // Archivo de estilos SASS asociado.
})
export class RegionsComponent implements OnInit {
<<<<<<< HEAD
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
=======


/**
 * Columnas que se mostrarán en la tabla.
 * Se incluyen las columnas `id` y `name` con capacidad de ordenación.
 */
displayedColumns: string[] = ['id', 'name'];

/**
 * Fuente de datos para la tabla, que se llenará con datos de la API.
 */
dataSource = new MatTableDataSource<any>([]);

/**
 * Número total de elementos en la base de datos.
 */
totalElements: number = 0;

/**
 * Número total de páginas disponibles en la paginación.
 */
totalPages: number = 0;

/**
 * Página actual en la que se encuentra el usuario.
 */
currentPage: number = 0;

/**
 * Cantidad de elementos por página.
 */
pageSize: number = 10;

/**
 * Columna por la que se ordenarán los datos de forma predeterminada.
 */
sortColumn: string = 'name';

/**
 * Dirección de la ordenación predeterminada.
 * Puede ser `asc` (ascendente) o `desc` (descendente).
 */
sortDirection: string = 'asc';

/**
 * Variable que almacena mensajes de error en caso de fallos en la carga de datos.
 */
error: string | null = null;

/**
 * Referencia al paginador de Angular Material.
 * Se inicializa automáticamente con `@ViewChild`.
 */
@ViewChild(MatPaginator) paginator!: MatPaginator;

/**
 * Referencia al componente de ordenación de Angular Material.
 * Permite la ordenación de la tabla.
 */
@ViewChild(MatSort) sort!: MatSort;

  regions: any[] = []; // Almacena las regiones obtenidas del servicio.

  constructor(
    private regionService: RegionService,
    private router: Router,
  ) {}

  /**
 * Método de inicialización del componente.
 * Se ejecuta una vez que el componente ha sido creado y se utiliza para cargar los datos iniciales.
 */
ngOnInit() {
  this.fetchRegions(this.currentPage, this.pageSize, this.sortColumn, this.sortDirection);
}

/**
* Método que se ejecuta después de que la vista ha sido inicializada.
* Se usa para asociar el paginador y la ordenación a la tabla.
*/
ngAfterViewInit() {
  this.dataSource.paginator = this.paginator;
  this.dataSource.sort = this.sort;

  // Suscripción al evento de cambio de ordenación
  this.sort.sortChange.subscribe((sort: Sort) => this.handleSortEvent(sort));
}

/**
* Obtiene la lista de regiones paginadas y ordenadas desde la API.
* @param page Número de la página a solicitar.
* @param size Número de elementos por página.
* @param sortColumn Nombre de la columna por la que se ordenarán los datos.
* @param sortDirection Dirección de orden ('asc' o 'desc').
*/
fetchRegions(page: number, size: number, sortColumn: string, sortDirection: string) {
  console.log(`Llamando al servicio con página: ${page}, tamaño: ${size}, orden: ${sortColumn} ${sortDirection}`);

  this.regionService.fetchRegions(page, size, sortColumn, sortDirection).subscribe({
      next: (res: any) => {
          console.log(`Datos recibidos: ${res.content.length} elementos, total páginas: ${res.totalPages}`);

          // Se actualiza la fuente de datos con los nuevos registros
          this.dataSource.data = res.content;
          this.totalElements = res.totalElements;
          this.totalPages = res.totalPages;
          this.currentPage = res.number;
          this.pageSize = res.size;

          // Se actualiza el paginador y la vista
          this.paginator.length = this.totalElements;
          this.paginator.pageIndex = this.currentPage;
          this.paginator.pageSize = this.pageSize;
      },
      error: (err) => {
          console.error('Error al obtener datos:', err);

          // Si el error es de autenticación, se redirige al usuario a la página de acceso denegado
          if (err.status === 403) {
              this.router.navigate(['/forbidden']);
          } else {
              this.error = 'Error al cargar las regiones';
          }
      }
  });
}


/**
 * Maneja el evento de cambio de página.
 * Llama nuevamente al servicio con la nueva página seleccionada.
 * @param event Evento de paginación que contiene la nueva página y el tamaño seleccionado.
 */
handlePageEvent(event: PageEvent) {
  console.log(`Cambio de página detectado: Página ${event.pageIndex}, Tamaño: ${event.pageSize}`);
  this.fetchRegions(event.pageIndex, event.pageSize, this.sortColumn, this.sortDirection);
}

/**
* Maneja el evento de cambio de ordenación en la tabla.
* Llama nuevamente al servicio con la nueva columna y dirección de ordenación.
* @param sort Evento de ordenación que contiene la columna y la dirección ('asc' o 'desc').
*/
handleSortEvent(sort: Sort) {
  console.log(`Cambio de orden detectado: Ordenando por ${sort.active} (${sort.direction})`);

  this.sortColumn = sort.active;
  this.sortDirection = sort.direction || 'asc'; // Si no hay dirección, por defecto 'asc'

  this.fetchRegions(this.currentPage, this.pageSize, this.sortColumn, this.sortDirection);
}

>>>>>>> 3875b4f (weather)
}
