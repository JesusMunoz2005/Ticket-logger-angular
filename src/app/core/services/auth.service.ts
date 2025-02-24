import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, throwError, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environments';
import { NotificationService } from './notification.service';


@Injectable({
 providedIn: 'root',
})
export class AuthService {
 private token = new BehaviorSubject<string | null>(null);
 // BehaviorSubject almacena el token y permite a otros componentes reaccionar cuando cambia.


 constructor(
  private http: HttpClient, 
  private router: Router,
  private notificationService: NotificationService
) {}


 /**
  * Método para autenticar al usuario.
  * @param username - Nombre de usuario ingresado.
  * @param password - Contraseña ingresada.
  * @returns Observable que emite un objeto con el token de autenticación si la solicitud es exitosa.
  */
 login(username: string, password: string): Observable<{ token: string }> {
   return this.http.post<{ token: string }>(
     `${environment.apiUrl}/v1/authenticate`,
     { username, password },
     { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }
   ).pipe(
    tap(response =>{
      this.setToken(response.token);
      console.log('Login exitoso, conectando a WebSockets...');

      // Iniciar WebSocket usando el método connect
      this.notificationService.connect();
    })
   )
 }


 /**
  * Almacena el token de autenticación en el BehaviorSubject.
  * @param token - Token recibido tras una autenticación exitosa.
  */
 setToken(token: string): void {
   this.token.next(token); // Actualiza el valor del token.
 }


 /**
  * Obtiene el token actual almacenado en el BehaviorSubject.
  * @returns El token actual o null si no está definido.
  */
 getToken(): string | null {
   return this.token.value;
 }


 /**
  * Devuelve un observable que emite el estado de autenticación basado en la existencia del token.
  * @returns Observable<boolean>
  */
 isLoggedIn(): Observable<boolean> {
   // Verifica si el token existe y emite un valor booleano.
   return this.token.asObservable().pipe(map((token: string | null) => !!token));
 }


 /**
  * Método para cerrar la sesión del usuario.
  * Elimina el token y redirige al usuario a la página de inicio de sesión.
  */
 logout(): void {
   this.token.next(null); // Limpia el token almacenado.
   this.notificationService.disconnect(); // Desconecta WebSockets
   this.router.navigate(['/']); // Redirige al usuario a la ruta raíz.
 }

 /**
 * Extrae el nombre de usuario desde el token JWT.
 * @returns Nombre de usuario o `null` si el token es inválido.
 */
getUsername(): string | null {
  const token = this.getToken();
  if (!token) return null;

  try {
      const decodedToken: any = jwtDecode(token);
      return decodedToken.sub || null; // `sub` es el campo estándar en JWT para el username.
  } catch (error) {
      console.error('❌ Error al decodificar el token:', error);
      return null;
  }
}
}
function jwtDecode(token: string): any {
  throw new Error('Function not implemented.');
}

