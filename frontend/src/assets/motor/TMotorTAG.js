function TMotorTAG() {

    this.gestorRecursos = new TGestorRecursos();
    this.nodos = [];

    const canvas = document.querySelector("#glCanvas");
    // Initialize the GL context
    const gl = canvas.getContext("webgl2");

    // If we don't have a GL context, give up now

    if (!gl) {
        alert('Unable to initialize WebGL. Your browser or machine may not support it.');
        return;
    }
    'use strict';

    //Funcion para cargar los ficheros shader
    // var getSourceSynch = function(url) {
    //     var req = new XMLHttpRequest();
    //     req.open("GET", url, false);
    //     req.send(null);
    //     return (req.status == 200) ? req.responseText : null;
    // };

    //Funcion para iniciar el programa, cargar shaders, linkarlos, attach, y borrarlos
    var iniciarPrograma = function() {

        //Cargar shaders
        const vertexShaderSrc = `#version 300 es
        in vec4 position;
        in vec3 normal;
        in vec2 texcoord;

        uniform mat4 projection;
        uniform mat4 modelView;

        out vec3 v_position;
        out vec3 v_normal;
        out vec2 v_texcoord;

        void main() {
            gl_Position = projection * modelView * position;

            v_position =  vec3 (modelView * position);
            v_normal = mat3(modelView) * normal;
            v_texcoord = texcoord;
        }`;

        const fragmentShaderSrc = `#version 300 es
          precision highp float;

          in vec3 v_position;
          in vec3 v_normal;
          in vec2 v_texcoord;

          struct TMaterial {
              sampler2D Diffuse;
              sampler2D Specular;
              float Shininess;
          };
          struct TLight {
              vec3 Position;

              vec3 Ambient;
              vec3 Diffuse;
              vec3 Specular;
          };

          uniform TMaterial Material;
          uniform TLight Light;

          vec3 Phong(){
              vec3 n = normalize(v_normal);
              vec3 s = normalize(Light.Position - v_position);
              vec3 v = normalize(-v_position);
              vec3 r = reflect(-s, n);

              vec3 Ambient = Light.Ambient * vec3(texture(Material.Diffuse, v_texcoord));
              vec3 Diffuse = Light.Diffuse * max(dot(s, n), 0.0) * vec3(texture(Material.Diffuse, v_texcoord));

              vec3 Specular = Light.Specular * pow(max(dot(r, v), 0.0), Material.Shininess) * vec3(texture(Material.Specular, v_texcoord));

              return Ambient + Diffuse + Specular;
          }

          out vec4 outColor;

          void main() {
              outColor = vec4 (Phong(), 1.0);
          }`;

        const vertexShader = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vertexShader, vertexShaderSrc);
        gl.compileShader(vertexShader);
        if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
            throw new Error(gl.getShaderInfoLog(vertexShader))
        };
        const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fragmentShader, fragmentShaderSrc);
        gl.compileShader(fragmentShader);
        if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
            throw new Error(gl.getShaderInfoLog(fragmentShader))
        };

        //Crear programa y linkarlo
        const program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);

        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.log('Fallo al crear el programa o cargar los shaders en el ' + gl.getProgramInfoLog(program));
        }

        gl.detachShader(program, vertexShader);
        gl.deleteShader(vertexShader);
        gl.detachShader(program, fragmentShader);
        gl.deleteShader(fragmentShader);

        return program;
    }
    const prg = iniciarPrograma();

    //Recuperar localizaciones de las variables de los shaders
    const positionLoc = gl.getAttribLocation(prg, 'position');
    const normalLoc = gl.getAttribLocation(prg, 'normal');
    const texcoordLoc = gl.getAttribLocation(prg, 'texcoord');
    const projectionLoc = gl.getUniformLocation(prg, 'projection');
    const modelViewLoc = gl.getUniformLocation(prg, 'modelView');

    const matDiffuseLoc = gl.getUniformLocation(prg, "Material.Diffuse");
    const matSpecularLoc = gl.getUniformLocation(prg, "Material.Specular");
    const matShininessLoc = gl.getUniformLocation(prg, "Material.Shininess");

    const lightPosLoc = gl.getUniformLocation(prg, "Light.Position");
    const lightAmbientLoc = gl.getUniformLocation(prg, "Light.Ambient");
    const lightDiffuseLoc = gl.getUniformLocation(prg, "Light.Diffuse");
    const lightSpecularLoc = gl.getUniformLocation(prg, "Light.Specular");

    const cubeVertexArray = gl.createVertexArray();


    //añadir atributos para mantenimiento de las cámaras, luces y viewports
    this.crearNodo = function(ent, hijos, padre, traslacion, rotacion, escalado, matrizTransf) {
        var nodo = new TNodo(ent, hijos, padre, traslacion, rotacion, escalado, matrizTransf);


        //Añadir el nuevo nodo como hijo del nodo padre
        if (padre != null)
            padre.addHijo(nodo, padre);

        //Devolver la referencia al nodo creado y anadirlo al array del motor
        this.nodos.push(nodo);
        return nodo;
    }

    this.crearMalla = function(nombre, name) {
        var entidad = new TMalla(nombre, name, material);

        this.comprobar(entidad);

        return entidad;
    }

    //Comprueba que en el gestor esta la entidad cargada y si no lo carga
    this.comprobar = function(entidad) {
        // if (entidad.nombre == "models/Men.json") {
        var malla = this.gestorRecursos.getRecurso(entidad.nombre);


        setTimeout(() => {
            entidad.vertices = malla.positions;
            entidad.normales = malla.normals;
            entidad.indices = malla.indexes;
            entidad.uvs = malla.uvs;

            entidad.colorDiffuse = malla.colorDiffuse;
            entidad.colorSpecular = malla.colorSpecular;
            entidad.colorAmbient = malla.colorAmbient;
            entidad.specularCoef = malla.specularCoef;
            entidad.mapDiffuse = malla.mapDiffuse;

            entidad.name = malla.name;
            entidad.image = malla.image;

            //Dibujar la entidad malla
            malla.draw(
                gl,
                cubeVertexArray,
                positionLoc,
                normalLoc,
                texcoordLoc
            );
        }, 200);
        // }

    }

    this.crearAnimacion = function(nombre, name, material) {
        var entidades = [];

        var entidad = this.crearMalla(nombre, name, material);

        entidades.push(entidad);

        let socorro = new TAnimacion(entidades);



        return socorro;
    }

    this.crearTextura = function(nombre) {
        var textura = this.gestorRecursos.getRecurso(nombre);
        //textura.draw(gl);
        return textura;
    }

    this.asignarTextura = function(entidad, textura) {
        entidad.name = textura.name;
    }

    this.crearMaterial = function(nombre) {
        var material = this.gestorRecursos.getRecurso(nombre);
        //material.draw(gl);
        return material;
    }

    this.asignarMaterial = function(entidad, material) {
        entidad.colorDiffuse = material.colorDiffuse;
        entidad.colorSpecular = material.colorSpecular;
        entidad.specularCoef = material.specularCoef;
    }


    this.activarViewport = function(nViewportFachada, nEscenaFachada) {
        nEscenaFachada.activarViewport(nViewportFachada);
    }
    this.addHijos = function(hijos, padre) {
        padre.addHijo(hijos, padre);
        return padre;
    }

    this.setEntidad = function(nodo, entidad) {
        nodo.setEntidad(entidad);
        return nodo;
    }


    this.activarLuz = function(nLuzFachada, nodo) {
        //luzActiva
        nLuzFachada.setActivada(true);
        nodo.luzActiva.push(nLuzFachada);
    }
    this.actualizarLuz = function(valor) {
        valor *= 0.01;

        motor.nodos.forEach(nodo => {
            if (nodo.getEntidad() instanceof TLuz) {
                nodo.entidad.setAmbientIntensity([valor, valor, valor]);
                nodo.entidad.setDiffuseIntensity([valor, valor, valor]);
                nodo.entidad.setSpecularIntensity([valor, 0, 0]);
                nodo.entidad.actu = true;
            }
        });
    }
    this.posicionarLuz = function(valor) {
        valor *= 0.01;

        motor.nodos.forEach(nodo => {
            if (nodo.getEntidad() instanceof TLuz) {
                nodo.entidad.setPos([valor, valor, valor]);

                nodo.entidad.actu = true;
            }
        });
    }

    this.getLuzActiva = function(nLuzFachada) {
        return nLuzFachada.getActivada();
    }
    this.addCamara = function(nCamFachada, nodo) {
        //camaraActiva. Solo se puede activar una camara.
        let cont = 0;
        //nCamFachada.setActivada(true);
        nodo.camaraActiva.push(nCamFachada);
        for (let i = 0; i < nodo.camaraActiva.length; i++) {
            if (nodo.camaraActiva[i].getActivada() == false) {
                cont++;
            }
        }
        if (cont == nodo.camaraActiva.length) {
            nodo.camaraActiva[nodo.camaraActiva.length - 1].setActivada(true);
        }
    }

    this.getCamaraActiva = function(nCamFachada) {
        return nCamFachada.getActivada();
    }

    this.addViewport = function(nViewportFachada, nodo) {
        //nViewportFachada.setActivado(true);
        let cont = 0;
        nodo.viewportActivado.push(nViewportFachada);
        for (let i = 0; i < nodo.viewportActivado.length; i++) {
            if (nodo.viewportActivado[i].getActivado() == false) {
                cont++;
            }
        }
        if (cont == nodo.viewportActivado.length) {
            nodo.viewportActivado[nodo.viewportActivado.length - 1].setActivado(true);
        }
    }


    // this.getViewportActivo = function(nViewportFachada) {
    //     return nViewportFachada.getActivado();
    // }

    this.crearCamara = function(perspectiva, cerca, lejos, escena) {
        camara = new TCamara(perspectiva, cerca, lejos, gl);
        camara = this.crearNodo(camara, null, escena, null, null, null, null);
        return camara;
    }
    this.crearLuz = function(escena) {
        var luz = new TLuz();
        luz = this.crearNodo(luz, null, escena, null, null, null, null);
        return luz;
    }
    this.crearViewport = function(x, y) {
        var viewport = new TViewport(gl.viewport(x, y, gl.canvas.width, gl.canvas.height));
        return viewport;
    }

    this.alejar = function(nodo) {
        if (nodo) {
            nodo.escalar([0.95, 0.95, 0.95]);
        } else {
            motor.nodos.forEach(nodo => {
                if (nodo.getEntidad() instanceof TMalla) {
                    nodo.escalar([0.95, 0.95, 0.95]);
                }
            });
        }
    }

    this.acercar = function(nodo) {
        if (nodo) {
            nodo.escalar([1.05, 1.05, 1.05]);
        } else {
            motor.nodos.forEach(nodo => {
                if (nodo.getEntidad() instanceof TMalla) {
                    nodo.escalar([1.05, 1.05, 1.05]);
                }
            });
        }
    }

    this.getCanvas = function() {
        return canvas;
    }

    this.dibujarEscena = function() {

        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        //gl.clearColor(0.5, 0.7, 1.0, 1.0);   Lo quito porq con el delay de texturas no va
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.enable(gl.DEPTH_TEST);
        gl.enable(gl.CULL_FACE);
        gl.useProgram(prg);
        gl.bindVertexArray(cubeVertexArray);

        //---------------------TEXTURAS------------------------------------------------------------------

        // Create a texture.  Textura a color azul por si no se carga la correspondiente
        var texture = gl.createTexture();
        // use texture unit 0
        gl.activeTexture(gl.TEXTURE0 + 0);
        // bind to the TEXTURE_2D bind point of texture unit 0
        gl.bindTexture(gl.TEXTURE_2D, texture);

        // Fill the texture with a 1x1 blue pixel.
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([217, 186, 126, 0]));

        //---------------------fin TEXTURAS------------------------------------------------------------------


        //Recorrer nodos, empezando por el nodo padre(escena)
        this.nodos[0].recorrerArbol(this.nodos[0], gl, lightAmbientLoc, lightDiffuseLoc, lightSpecularLoc, lightPosLoc, projectionLoc, modelViewLoc, matDiffuseLoc, matSpecularLoc, matShininessLoc);



    }
    this.recorrerEscena = function() {
        this.nodos[0].recorrerArbol(this.nodos[0], gl, lightAmbientLoc, lightDiffuseLoc, lightSpecularLoc, lightPosLoc, projectionLoc, modelViewLoc, matDiffuseLoc, matSpecularLoc, matShininessLoc);
    }

}
