export class Ejercicio {

  constructor(
                public uid: string,
                public nombre: string,
               public descripcion: string,
               public imagen: string,
               public tipo: string[],
               public subtipo: string[],
              ) {}
}
