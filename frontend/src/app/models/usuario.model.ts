
import { environment } from '../../environments/environment';

const base_url: string = environment.base_url;

export class Usuario {

    constructor( public uid: string,
                 public rol: string,
                 public nombre_apellidos?: string,
                 public email?: string,
                 public alta?: Date,
                 public activo?: boolean,
                 public imagen?: string,
                 //public password?: string,

                 //Nuevos
                 //public estadisticas?: string,
                 public planMensual?: string,
                 public rutinas?: string[],
                 public num_clientes?: Number,
                 public sitio_Fisio?: {nombre_sitio:string, localizacion_sitio:string},
                 public tarjeta_Fisios?: string[],
                 public valoracion?: Number,
                 public listaClientes?: [{cliente:string, activo:boolean}],
                 public especialidad?: string,

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
