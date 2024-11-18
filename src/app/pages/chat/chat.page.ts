import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent } from '@ionic/angular';
import { Observable } from 'rxjs';
import { ChatService } from '../../services/chat.service';
import { Router } from '@angular/router';
import { Geolocation } from '@capacitor/geolocation'; // Importar Geolocation

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {
  @ViewChild(IonContent) content!: IonContent; // Non-null assertion.
  messages!: Observable<any[]>; // Non-null assertion.
  newMsg = '';

  constructor(private chatService: ChatService, private router: Router) {}

  ngOnInit() {
    this.messages = this.chatService.getChatMessages();
  }

  sendMessage() {
    this.chatService.addChatMessage(this.newMsg).then(() => {
      this.newMsg = '';
      if (this.content) {
        this.content.scrollToBottom(200);
      }
    }).catch((error) => {
      console.error('Error al enviar mensaje:', error);
    });
  }

  // Método para enviar la ubicación actual como mensaje
  async sendLocation() {
    try {
      const position = await Geolocation.getCurrentPosition();
      const { latitude, longitude } = position.coords;

      await this.chatService.addLocationMessage(latitude, longitude);

      if (this.content) {
        this.content.scrollToBottom(200);
      }
    } catch (error) {
      console.error('Error al obtener la ubicación:', error);
    }
  }

  signOut() {
    this.chatService.signOut().then(() => {
      this.router.navigateByUrl('/', { replaceUrl: true });
    });
  }
}
