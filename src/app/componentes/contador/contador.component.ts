import { Component, OnInit, ViewChild } from '@angular/core';
import { Usuario } from 'src/app/model/usuario';
import { UsuariosService } from 'src/app/services/usuarios.service';


@Component({
  selector: 'app-contador',
  templateUrl: './contador.component.html',
  styleUrls: ['./contador.component.css']
})
export class ContadorComponent implements OnInit{
  //ATRIBUTOS
  public timeLeft: number = 60;
  private interval: any;
  public color: string = '';
  public esPrimerClick = false;
  public btnEstaActivo = true;
  public resultadoUsuarios: Usuario[] = [];
  public usuariosTanda1: any = [];
  public usuariosTanda2: any = [];
  public estadistica: any[]= [];
  public username: string = 'You';
  private localStorageService;
  private currentUser: any;

  constructor(private usuarioService: UsuariosService) { 
    this.localStorageService = localStorage;
  }

  //MÉTODOS
  ngOnInit(): void {
    this.currentUser = this.getCurrentUser()
    if(this.currentUser){
      this.color = this.currentUser.color;
    }
    this.obtenerUsuarios();
    this.startTimer()
  }

  /**
   * Inicializa el timer (grande) del usuario
   */
  startTimer() {
    this.interval = setInterval(() => {
      if(this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        this.timeLeft = 0;
        this.pauseTimer();
        if(this.esPrimerClick && !this.btnEstaActivo){
          this.color='white';
          this.esPrimerClick=true;
          this.btnEstaActivo = false;
        }
        else if(!this.esPrimerClick && !this.currentUser){
          this.color='grey';
          this.esPrimerClick=true;
          this.btnEstaActivo = false;
        }
      }
    },1000)
  }

  /**
   * Pausa/Stop del timer
   */
  pauseTimer() {
    clearInterval(this.interval);

  }

  /**
   * Resetea el timer, selecciona el color correspondiente 
   * de acuerdo al momento en el que se hizo click. Y guarda
   * el usuario (color, tiempo, username) en el localStorage
   */
  reset(){

    if(!this.currentUser){
      if(!this.esPrimerClick && this.btnEstaActivo){
        let timeStop = this.timeLeft;
        this.btnEstaActivo = false;
        this.esPrimerClick = true;
  
        if(timeStop <= 60 && timeStop >= 52){
          this.color='purple';
        }
        else if(timeStop <= 51 && timeStop >= 42){
          this.color='blue';
        }
        else if(timeStop <= 41 && timeStop >= 32){
          this.color='green';
        }
        else if(timeStop <= 31 && timeStop >= 22){
          this.color='yellow';
        }
        else if(timeStop <= 21 && timeStop >= 12){
          this.color='orange';
        }
        else{
          this.color='red';
        }
  
        let user: Usuario={
          username: this.username,
          color: this.color,
          tiempo: this.timeLeft,
        }
  
        this.localStorageService.setItem('user', JSON.stringify(user));
        this.agregarClickUsuario(user);
  
        clearInterval(this.interval);
        this.timeLeft = 60;
        this.startTimer();
  
      }
    }

  } 

  /**
   * Agrega al array resultadoUsuarios el usuario 
   * que internamente posee los valores del color, username y tiempo de click.
   * Luego, a medida que se va agregando calcula la estadística
   * @param user 
   */
  agregarClickUsuario(user: Usuario){
    this.resultadoUsuarios.push(user);
    this.calcularEstadistica(user.color);
  }

  /**
   * Obtiene los usuarios
   */
  obtenerUsuarios(){
    this.usuarioService.getUsers().subscribe(res=>{
      let users: any = [];
      users = res;
      if(users){
        for (let index = 0; index < 5 ; index++) {

          this.usuariosTanda1.push(users[index]);
          
        }

        for (let index = 5; index < 10 ; index++) {

          this.usuariosTanda2.push(users[index]);
          
        }
      }
    });

  }

  /**
   * En el array "estadistica" se va almacenando la cantidad por cada color
   * al momento de clickear. 
   * @param color 
   */
  calcularEstadistica(color: string){

    if(this.estadistica.find(x=> x.color === color)){
      let index = this.estadistica.indexOf(this.estadistica.find(x=>x.color===color));
      this.estadistica[index].cantidad = this.estadistica[index].cantidad + 1;
    }
    else{
      let estadist={
        color: color,
        cantidad: 1
      }
      this.estadistica.push(estadist)
    }
  }

  /**
   * Obtiene el usuario almacenado en el localStorage
   * @returns Usuario | null
   */
  getCurrentUser(){
    var userStr = this.localStorageService.getItem('user');
    return (userStr) ? <Usuario>JSON.parse(userStr) : null;
  }
 
}


