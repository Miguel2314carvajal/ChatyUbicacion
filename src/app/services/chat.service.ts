import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, User as FirebaseUser } from '@angular/fire/auth';
import { Firestore, collection, addDoc, serverTimestamp, query, orderBy, collectionData, doc, setDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';

export interface User {
  uid: string;
  email: string;
}

export interface Message {
  createdAt: any; // Puede ser `Date` o `null`
  id?: string;
  from: string;
  msg: string;
  fromName?: string;
  myMsg?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  currentUser: User | null = null;

  constructor(private auth: Auth, private firestore: Firestore) {
    onAuthStateChanged(this.auth, (user: FirebaseUser | null) => {
      if (user) {
        this.currentUser = { uid: user.uid, email: user.email || '' };
      } else {
        this.currentUser = null;
      }
    });
  }

  // Registro de usuario
  async signup({ email, password }: { email: string; password: string }): Promise<void> {
    const credential = await createUserWithEmailAndPassword(this.auth, email, password);
    const uid = credential.user.uid;

    const userDoc = doc(this.firestore, `users/${uid}`);
    await setDoc(userDoc, { uid, email });
  }

  // Inicio de sesión
  async signIn({ email, password }: { email: string; password: string }): Promise<void> {
    await signInWithEmailAndPassword(this.auth, email, password);
  }

  // Cerrar sesión
  async signOut(): Promise<void> {
    await this.auth.signOut();
  }

  // Agregar mensaje de texto
  async addChatMessage(msg: string): Promise<void> {
  if (!this.currentUser) {
    throw new Error('No hay usuario autenticado.');
  }

  const messagesCollection = collection(this.firestore, 'messages');
  await addDoc(messagesCollection, {
    msg,
    from: this.currentUser.uid,
    createdAt: serverTimestamp(),
  });
}


  // Agregar un mensaje
  async addLocationMessage(latitude: number, longitude: number): Promise<void> {
    if (!this.currentUser) {
      throw new Error('No hay usuario autenticado.');
    }
  
    const messagesCollection = collection(this.firestore, 'messages');
    const locationMsg = `Ubicación: https://maps.google.com/?q=${latitude},${longitude}`;
  
    await addDoc(messagesCollection, {
      msg: locationMsg,
      from: this.currentUser.uid,
      createdAt: serverTimestamp(),
    });
  }

  getChatMessages(): Observable<Message[]> {
    const messagesCollection = collection(this.firestore, 'messages');
    const messagesQuery = query(messagesCollection, orderBy('createdAt'));
  
    return collectionData(messagesQuery, { idField: 'id' }).pipe(
      map((documents) =>
        documents.map((doc) => ({
          ...doc, // Copiamos las propiedades
          createdAt: doc['createdAt'], // Explicitamente asignamos propiedades
          from: doc['from'],
          msg: doc['msg'],
          myMsg: doc['from'] === this.currentUser?.uid, // Verificamos si el mensaje es del usuario actual
        })) as Message[]
      )
    );
  }
  
  // Obtener usuarios
  private getUsers(): Observable<User[]> {
    const usersCollection = collection(this.firestore, 'users');
    return collectionData(usersCollection, { idField: 'uid' }) as Observable<User[]>;
  }

  // Obtener el nombre del usuario para cada mensaje
  private getUserForMsg(msgFromId: string, users: User[]): string {
    const user = users.find((usr) => usr.uid === msgFromId);
    return user ? user.email : 'Usuario eliminado';
  }
}
