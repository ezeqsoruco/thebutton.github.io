import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  private url = "https://jsonplaceholder.typicode.com/users";
  constructor( private http: HttpClient) { }

  /**
   * Se accede a la url para poder obtener los usuarios.
   * @returns Observable
   */
  getUsers(){
    return this.http.get(this.url);
  }
}
