import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ClienteService } from 'src/app/services/cliente.service';
import { GLOBAL } from 'src/app/services/GLOBAL';
import { io } from "socket.io-client";

declare var $:any;
declare var iziToast:any;

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  public token;
  public id;
  public user : any = undefined;
  public user_lc : any = undefined;
  public config_global:any={};
  public op_cart = false;
  public url;
  public subtotal = 0;
  public socket=io('http://localhost:4201');

  public carrito_arr :Array<any> = [];
  
  constructor(
    private _clienteService : ClienteService,
    private _router: Router
  ) { 
    this.token = localStorage.getItem('token');
    this.id = localStorage.getItem('_id');
    this.url = GLOBAL.url;

    this._clienteService.obtener_config_public().subscribe(
      response=>{
        this.config_global = response.data;
      }
    );

    if (this.token) {
      this._clienteService.obtener_cliente_guest(this.token,this.id).subscribe(
        response=>{
          this.user = response.data;
          localStorage.setItem('user_data', JSON.stringify(this.user));
          if (localStorage.getItem('user_data')) {
            this.user_lc = JSON.parse(localStorage.getItem('user_data')!);
            this.obtener_carrito();
          }else{
            this.user_lc = undefined;   
          }
  
        },error=>{
          console.log(error);
          this.user = undefined;
          
        }
      ); 
    }  
  }

  obtener_carrito(){
    this._clienteService.obtener_carrito_cliente(this.user_lc._id,this.token).subscribe(
      response=>{
        this.carrito_arr = response.data;
        this.calcular_carrito();
      }
    );
  }

  ngOnInit(): void {
    this.socket.on('new-carrito',this.obtener_carrito.bind(this));
    this.socket.on('new-carrito-add',this.obtener_carrito.bind(this));
  }

  logout(){
    window.location.reload();
    localStorage.clear();
    this._router.navigate(['/']);
  }

  op_modalcart(){
    if (!this.op_cart) {
      this.op_cart= true;
      $('#cart').addClass('show');
    }else{
      this.op_cart= false;
      $('#cart').removeClass('show');
    }
  }

  calcular_carrito(){
    this.carrito_arr.forEach(element=>{
      this.subtotal = this.subtotal + parseFloat(element.producto.precio);
    });
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
        console.log(response);
        
      }
    );
  }
}