import { Component, OnInit } from '@angular/core';
import { ClienteService } from 'src/app/services/cliente.service';

declare var iziToast:any;

declare var $:any;

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  public cliente : any = {};
  public id;
  public token;

  constructor(
    private _clienteService : ClienteService
  ) { 
    this.token = localStorage.getItem('token');
    this.id = localStorage.getItem('_id');

    if (this.id) {
      this._clienteService.obtener_cliente_guest(this.token,this.id).subscribe(
        response=>{
          this.cliente = response.data;
        }
      );
    }
  }

  ngOnInit(): void {
  }

  actualizar(actualizarForm:any){
    if (actualizarForm.valid) {
      console.log(this.cliente.password);
      this.cliente.password = $('#input_password').val();
      console.log(this.cliente.password);
      this._clienteService.actualizar_perfil_cliente_guest(this.token,this.cliente,this.id).subscribe(
        response=>{
          iziToast.show({
            title: 'SUCCESS',
            titleColor: '#1DC74C',
            color: '#FFF',
            class:  'text-success',
            position: 'topRight',
            message: 'Se actualizó su perfil correctamente.'
          });
        }
      );
      
    }else{
      iziToast.show({
        title: 'ERROR',
        titleColor: '#FF0000',
        color: '#FFF',
        class:  'text-danger',
        position: 'topRight',
        message: 'Los datos del formulario no son validos'
      });
    }
  }

}
