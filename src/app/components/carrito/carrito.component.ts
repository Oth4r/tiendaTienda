import { Component, OnInit } from '@angular/core';
import { ClienteService } from 'src/app/services/cliente.service';
import { GLOBAL } from 'src/app/services/GLOBAL';
import { io } from "socket.io-client";

declare var iziToast:any;

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
export class CarritoComponent implements OnInit {

  public idcliente;
  public token;
  public url;
  public subtotal = 0;
  public total_pagar = 0;

  public carrito_arr :Array<any> = [];

  public socket=io('http://localhost:4201');

  constructor(
    private _clienteService : ClienteService
  ) {
    this.idcliente = localStorage.getItem('_id');
    this.url = GLOBAL.url;
    this.token = localStorage.getItem('token');
    

    this._clienteService.obtener_carrito_cliente(this.idcliente,this.token).subscribe(
      response=>{
        this.carrito_arr = response.data;
        this.calcular_carrito();
      }
    );
   }

  ngOnInit(): void {
    
  }

  calcular_carrito(){
    this.carrito_arr.forEach(element=>{
      this.subtotal = this.subtotal + parseFloat(element.producto.precio);
    });
    this.total_pagar = this.subtotal;
  }

  eliminar_item(id:any){
    this._clienteService.eliminar_carrito_cliente(id,this.token).subscribe(
      response=>{
        iziToast.show({
          title: 'SUCCESS',
          titleColor: '#1DC74C',
          color: '#FFF',
          class:  'text-success',
          position: 'topRight',
          message: 'Se eliminó el producto del carrito.'
        });
        this.socket.emit('delete-carrito',{data:response.data});
        this._clienteService.obtener_carrito_cliente(this.idcliente,this.token).subscribe(
          response=>{
            this.carrito_arr = response.data;
            this.calcular_carrito();
          }
        );
        
      }
    );
  }
}
