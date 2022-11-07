export class Informe {

  constructor(
                public uid: string,
                public fisio_asociado: string,
               public titulo: string,
               public contenido: string,
               public asunto: string,
               public cliente_asociado: string,
               public fecha?: Date,
              ) {}
}
