import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Usuario } from 'src/app/model/usuario';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {

  private interval: any;
  public color: string = '';

  @Input() public usuario: any;
  public timeLeftA: number = 60;
  @Output() newItemEvent = new EventEmitter<Usuario>();


  constructor() {

  }

  ngOnInit(): void {
    this.startTimer();
    this.click();
  }

 /**
 * Inicializa el timer (grande) del usuario
 */
  startTimer() {
    this.interval = setInterval(() => {
      if (this.timeLeftA > 0) {
        this.timeLeftA--;
      } else {
        this.timeLeftA = 0;
      }
    }, 1000)
  }

  /**
   * Pausa/Stop del timer
   */
  pauseTimer() {
    clearInterval(this.interval);

  }

  /**
   * Resetea el timer, selecciona el color correspondiente 
   * de acuerdo al momento en el que se hizo click
   */
  reset(time: number) {

    let timeStop = this.timeLeftA;

    if (timeStop <= 60 && timeStop >= 52) {
      this.color = 'purple';
    }
    else if (timeStop <= 51 && timeStop >= 42) {
      this.color = 'blue';
    }
    else if (timeStop <= 41 && timeStop >= 32) {
      this.color = 'green';
    }
    else if (timeStop <= 31 && timeStop >= 22) {
      this.color = 'yellow';
    }
    else if (timeStop <= 21 && timeStop >= 12) {
      this.color = 'orange';
    }
    else {
      this.color = 'red';
    }

    clearInterval(this.interval);
    this.timeLeftA = 60;
    this.startTimer();

    let user: Usuario = new Usuario();
    user.color = this.color;
    user.tiempo = this.timeLeftA;
    user.username = this.usuario;

    this.newItemEvent.emit(user);

  }

  /**
   * Simula clicks de otros usuarios en un momento determinado 
   * obtenido de manera random
   */
  click() {

    let time: number = Math.floor(Math.random() * (61000 - 0 + 1) + 0)
    setTimeout(() => {
      this.reset(this.timeLeftA)
    }, time);


  }

}
