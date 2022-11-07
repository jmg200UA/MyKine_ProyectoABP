import { environment } from '../../environments/environment';
import { Usuario } from './usuario.model';
import { Informe } from './informe.model';
import { Rutina } from './rutina.models';

const base_url: string = environment.base_url;

export class Cliente {

    constructor( public uid: string,
                 public cliente?,
                 public nombre_apellidos?: string,
                 public email?: string,
                 public alta?: Date,
                 public imagen?: string,
                 //public estadisticas?: string,
                 public rutinas?: [{rutina:string, activo:boolean}],
                 public informes?: string[],
                 public listaFisios?: string[],
                 public activo?: boolean,
                 public rol?: string,
                 ) {}

    get imagenUrl(): string {
        // Devolvemos la imagen en forma de peticilon a la API
        const token = localStorage.getItem('token') || '';
        if (!this.imagen) {
            return `${base_url}/upload/fotoperfil/no-imagen.jpg?token=${token}`;
        }
        return `${base_url}/upload/fotoperfil/${this.imagen}?token=${token}`;
    }
}
