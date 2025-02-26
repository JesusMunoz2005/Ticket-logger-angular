import { Injectable, PLATFORM_ID, Inject, Injector } from '@angular/core';
import { Client, IMessage, StompHeaders } from '@stomp/stompjs';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environments';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {

  private stompClient: Client | null = null; // Cliente STOMP para WebSockets
  private notificationsSubject = new BehaviorSubject<any[]>([]); // Estado reactivo para almacenar notificaciones
  private apiUrl = `${environment.webSocketUrl}/notifications`; // URL del websocket de notificaciones
  private authService!: AuthService; // Servicio de autenticación con inyección diferida

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private http: HttpClient,
    private injector: Injector // Se usa para obtener AuthService de forma diferida
  ) {}

  /**
   * Conecta al WebSocket de notificaciones
   */
  connect(): void {
    // Asegurar que AuthService está inicializado
    if (!this.authService) {
      this.authService = this.injector.get(AuthService);
    }

    const token = this.authService?.getToken();
    const username = this.authService?.getUsername();

    if (!token || !username) {
      console.error('❌ No hay token o usuario autenticado. WebSocket no se conectará.');
      return;
    }

    if (this.stompClient && this.stompClient.connected) {
      console.warn('⚠ WebSocket ya está conectado.');
      return;
    }

    // Configuración del Cliente STOMP
    this.stompClient = new Client({
      brokerURL: `${environment.WebSocketBroker}`, // URL del servidor WebSocket
      reconnectDelay: 5000, // Intento de reconexión cada 5 segundos
      debug: (msg) => console.log(`🔍 STOMP Debug:`, msg),
      connectHeaders: {
        Authorization: `Bearer ${token}`, // Se envía el token en la cabecera
      },
    });

    this.stompClient.onConnect = () => {
      console.log('✅ WebSocket conectado');

      const token = this.authService?.getToken();
      const username = this.authService?.getUsername(); // Obtener usuario autenticado

      console.log(`🔹 Usuario autenticado en WebSocket: ${username}`);
      console.log(`🔹 Token: ${token ? 'Existe' : 'No encontrado'}`);

      const headers: StompHeaders = token ? { Authorization: `Bearer ${token}` } : {};

      // Suscribirse al canal de notificaciones global
      this.stompClient?.subscribe('/topic/notifications', (message: IMessage) => {
        try {
          const notification = JSON.parse(message.body);
          console.log('🔔 Notificación recibida:', notification);

          // Agregar la notificación a la lista existente
          const currentNotifications = this.notificationsSubject.value;
          this.notificationsSubject.next([...currentNotifications, notification]);
        } catch (error) {
          console.error('❌ Error al procesar notificación:', error);
        }
      });
    };

    this.stompClient.onStompError = (frame) => {
      console.error(' STOMP Error:', frame.headers['message']);
    };

    this.stompClient.activate();
  }

  /**
   * Options of historical de notifications desde Monpudo (REST API)
   * Se realiza una petición HTTP a la API de notificaciones
   * Preforma Observable con la lista de notificaciones
   */
  loadUserNotification(): Observable<any[]> {
    if (!this.authService) {
      this.authService = this.injector.get(AuthService); // Inyección diferida
    }
    const token = this.authService.getToken();
    if (!token) {
      console.warn('No hay token digaquible.');
      return of([]); // Retorna un observable vacío si no hay token
    }
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.get<any[]>(this.apiUrl, { headers }).pipe(
      tap(notifications => console.log("% Notificaciones cargadas:", notifications))
    );
  }

  // **Doublye un Observable con las notificaciones en tiempo real**
  // **Returns Observable con las notificaciones actualizadas**
  getNotifications(): Observable<any[]> {
    return this.notificationsSubject.asObservable().pipe(
      tap(() => console.log("A Notificaciones actualizadas en tiempo real:", this.notificationsSubject.value))
    );
  }

  /**
   * DESIGNDELE el websocket
   * SI el clientE STOMP SELLE CONSELLADO, se desactiza la CONSELLADO.
   */
  disconnect(): void {
    if (this.stompClient) {
      this.stompClient.deactivate();
      console.log("A websocket desconectado.");
    }
  }
}