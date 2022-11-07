
export class Rutina {

  constructor(
                public uid: string,
                public nombre: string,
               public descripcion: string,
               //public imagen: string,
               public fecha: Date,
               public ejercicios: [{ejercicio:string, repeticiones:number}],
               public fisio_asignado: string[],
               public activa: boolean,
              ) {}
}
