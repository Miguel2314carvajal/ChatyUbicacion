import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  credentialForm!: FormGroup; // Se asegura que estará inicializado en `ngOnInit`

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private chatService: ChatService
  ) {}

  ngOnInit() {
    this.credentialForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  async signUp() {
    const loading = await this.loadingController.create();
    await loading.present();

    try {
      await this.chatService.signup(this.credentialForm.value);
      await loading.dismiss();
      this.router.navigateByUrl('/chat', { replaceUrl: true });
    } catch (err: any) {
      await loading.dismiss();
      const alert = await this.alertController.create({
        header: 'Registro fallido',
        message: err.message,
        buttons: ['OK'],
      });
      await alert.present();
    }
  }

  async signIn() {
    const loading = await this.loadingController.create();
    await loading.present();

    try {
      await this.chatService.signIn(this.credentialForm.value);
      await loading.dismiss();
      this.router.navigateByUrl('/chat', { replaceUrl: true });
    } catch (err: any) {
      await loading.dismiss();
      const alert = await this.alertController.create({
        header: 'Inicio de sesión fallido',
        message: err.message,
        buttons: ['OK'],
      });
      await alert.present();
    }
  }

  // Accesores para los campos del formulario
  get email() {
    return this.credentialForm?.get('email');
  }
  
  get password() {
    return this.credentialForm?.get('password');
  }
}
