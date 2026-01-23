import { Client, StompSubscription } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import type { Notification } from '../types/notification.types';

type NotificationCallback = (notification: Notification) => void;
type UnreadCountCallback = (count: number) => void;

class WebSocketService {
  private client: Client | null = null;
  private notificationSubscription: StompSubscription | null = null;
  private countSubscription: StompSubscription | null = null;
  private connected: boolean = false;

  /**
   * Connect to WebSocket server
   */
  connect(userId: string, onNotification: NotificationCallback, onUnreadCount: UnreadCountCallback): void {
    if (this.connected) {
      console.log('WebSocket already connected');
      return;
    }

    const socket = new SockJS('http://localhost:8085/ws/notifications');
    
    this.client = new Client({
      webSocketFactory: () => socket as any,
      debug: (str) => {
        console.log('STOMP Debug:', str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    this.client.onConnect = () => {
      console.log('WebSocket connected successfully');
      this.connected = true;

      // Subscribe to user's notification channel
      this.notificationSubscription = this.client!.subscribe(
        `/topic/notifications/${userId}`,
        (message) => {
          try {
            const notification: Notification = JSON.parse(message.body);
            console.log('Received notification:', notification);
            onNotification(notification);
          } catch (error) {
            console.error('Error parsing notification:', error);
          }
        }
      );

      // Subscribe to unread count updates
      this.countSubscription = this.client!.subscribe(
        `/topic/notifications/${userId}/count`,
        (message) => {
          try {
            const count = parseInt(message.body);
            console.log('Received unread count:', count);
            onUnreadCount(count);
          } catch (error) {
            console.error('Error parsing unread count:', error);
          }
        }
      );
    };

    this.client.onStompError = (frame) => {
      console.error('STOMP error:', frame);
    };

    this.client.onWebSocketClose = () => {
      console.log('WebSocket connection closed');
      this.connected = false;
    };
    //this line starts the websocket connection
    this.client.activate();
  }

  /**
   * Disconnect from WebSocket server
   */
  disconnect(): void {
    if (this.notificationSubscription) {
      this.notificationSubscription.unsubscribe();
      this.notificationSubscription = null;
    }

    if (this.countSubscription) {
      this.countSubscription.unsubscribe();
      this.countSubscription = null;
    }

    if (this.client) {
      this.client.deactivate();
      this.client = null;
    }

    this.connected = false;
    console.log('WebSocket disconnected');
  }

  /**
   * Check if WebSocket is connected
   */
  isConnected(): boolean {
    return this.connected;
  }
}

export const webSocketService = new WebSocketService();
export default webSocketService;
