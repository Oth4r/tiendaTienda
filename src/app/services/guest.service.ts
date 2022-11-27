import { Injectable } from '@angular/core';
import { filter, Observable } from "rxjs";
import { GLOBAL } from "./GLOBAL";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { JwtHelperService } from "@auth0/angular-jwt";

@Injectable({
  providedIn: 'root'
})
export class GuestService {

  public url;

  constructor(
    private _http : HttpClient,
  ) {
    this.url = GLOBAL.url;
   }

  obtener_productos_slug_publico(slug:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this._http.get(this.url+'obtener_productos_slug_publico/'+slug,{headers:headers});
  }

  listar_productos_recomendado_publico(categoria:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this._http.get(this.url+'listar_productos_recomendado_publico/'+categoria,{headers:headers});
  }

  get_regiones():Observable<any>{
    return this._http.get('./assets/regiones.json');
  }

  get_distritos():Observable<any>{
    return this._http.get('./assets/distritos.json');
  }
  get_provincias():Observable<any>{
    return this._http.get('./assets/provincias.json');
  }

}
