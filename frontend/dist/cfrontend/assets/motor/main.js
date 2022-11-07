//AHORA LE PASO POR PARÁMETRO EL MODELO Y LA TEXTURA PARA LLAMARLO DESDE LA INTERFAZ

var motor;

var nFrames, framActual;
var ultimoCambio; //DateTime,
var escena;
let nodo;
let anim;
// let gestorRecursos;
const arrayModelos = [];
const entidades = [];
const varaux = [];
const yoquese = [];
var textura;
var material;
var bandera = false;
var indice = 0;
var auxmin;

var parar;

function main() {

    motor = new TMotorTAG();
    escena = motor.crearNodo();
    gestorRecursos = motor.gestorRecursos;

    // Creamos aqui el material y la textura ya que van a ser siempre los mismos
    textura = motor.crearTextura('carne.jpg');
    material = motor.crearMaterial('models/cuboMaterial.mtl');

    //Se crea la fachada, lo que es el motor pasandole los shaders

    //Creamos las camaras
    let camara = motor.crearCamara(true, 0.11, 10, escena);


    //Se crea la luz y se le asigna sus intesidades
    let luz = motor.crearLuz(escena);
    luz.entidad.setAmbientIntensity([0.5, 0.5, 0.5]);
    luz.entidad.setDiffuseIntensity([0.5, 0.5, 0.5]);
    luz.entidad.setSpecularIntensity([0.5, 0.0, 0.0]);
    luz.entidad.setPos([0.5, 0.0, 0.0]);



    //AÑADIMOS LAS LUCES AL ARRAY DE LUCES
    motor.activarLuz(luz.entidad, escena);


    //AÑADIMOS LAS CÁMARAS AL ARRAY DE CÁMARAS
    // motor.addCamara(camara.entidad, escena);


    //TRABAJADO CON LOS VIEWPORTS
    // let viewport1 = motor.crearViewport(0, 0);

    //AÑADIMOS LOS VIEWPORTS AL ARRAY DE VIEWPORTS
    // motor.addViewport(viewport1, escena);

    nodo = motor.crearNodo(null, null, escena, null, null, null, null);

    nodo.trasladar([0, -1.2, 0.6]);


    // nodo2 = motor.crearNodo(null, null, escena, null, null, null, null);

    // nodo2.trasladar([0, -1.2, 0.6]);


    setTimeout(() => {
        motor.dibujarEscena();
    }, 500);

    setTimeout(() => {
        modelos();
    }, 600);

}

function modelos() {
    document.getElementById("mydiv").style.display = "inline";

    //Es para eliminar el ultimo nodo malla si lo hay

    motor.nodos.forEach((nodo) => {
        if (nodo.getEntidad() instanceof TMalla) {
            const index = motor.nodos.indexOf(nodo);
            if (index > -1) {
                motor.nodos.splice(index, 1);
            }
        }
    });



    //Una vez hemos parado la animacion anterior y borrado el nodo anterior, creamos pintamos y animamos el nuevo
    setTimeout(() => {
        //Creamos la entidad al nodo, con textura y/o material si lo queremos, y luego le asignamos la entidad al nodo

        //VAMOS A CREAR MAS ENTIDADES
        // let entidad = motor.crearMalla("models/Men.json", textura.name, material);
        let entidad = motor.crearMalla(
            'models/newGemelos/newGemelos_0.json',
            // 'models/newGemelos/0_0.json',
            textura.name,
            material
        );
        entidad.actuTexturas = true;
        motor.setEntidad(motor.nodos[3], entidad);


        setTimeout(() => {
            motor.dibujarEscena();
        }, 250);

        //Activar mover el modelo con el raton
        setTimeout(() => {
            animarModelos();
        }, 200);
    }, 500);


}

function cambiarEntidad(modelo) {
    // clearInterval(parar);
    incide = 0;
    auxmin = 0;
    paremos();
    if (bandera == true) {
        motor.nodos[3].rotar([0, 1, 0], 180);
        bandera = false;
    }
    if (modelo) {
        let modeloaponer = 'models/gemelosJSON/gemelos_0.json';

        switch (modelo) {
            case 'Gemelos':
                // modeloaponer = 'models/gemelosJSON/gemelos_0.json';
                modeloaponer = 'models/newGemelos/newGemelos_0.json';
                break;
            case 'Dorsales':
                modeloaponer = 'models/newDorsales/newDorsales_0.json';
                motor.nodos[3].rotar([0, 1, 0], 180);
                bandera = true;
                break;
            case 'Biceps':
                // modeloaponer = 'models/bicepsJSON/biceps_0.json';
                modeloaponer = 'models/newBiceps/newBiceps_0.json';
                break;
            case 'Lumbares':
                // modeloaponer = 'models/bicepsJSON/biceps_0.json';
                modeloaponer = 'models/newLumbares/newLumbares_0.json';
                break;
        }

        let entidad = motor.crearMalla(
            modeloaponer,
            textura.name,
            material
        );

        entidad.actuTexturas = true;

        motor.setEntidad(motor.nodos[3], entidad);

        // motor.setEntidad(nodo1, entidad);
        setTimeout(() => {
            motor.dibujarEscena();
        }, 200);
    }

}

function animaHombre(modelo) {

    let carpeta = 'models/newGemelos/';
    let mallasAnimacion = [];
    switch (modelo) {
        case 'Gemelos':
            for (let i = 0; i < 120; i += 5) {
                // mallasAnimacion.push("gemelos_" + i + ".json");
                mallasAnimacion.push("newGemelos_" + i + ".json");
            }
            carpeta = 'models/newGemelos/';
            break;
        case 'Dorsales':
            for (let i = 0; i < 120; i += 5) {
                mallasAnimacion.push("newDorsales_" + i + ".json");
            }
            carpeta = 'models/newDorsales/';
            break;
        case 'Biceps':
            for (let i = 0; i < 110; i += 5) {
                // mallasAnimacion.push("biceps_" + i + ".json");
                mallasAnimacion.push("newBiceps_" + i + ".json");
            }
            // carpeta = 'models/bicepsJSON/';
            carpeta = 'models/newBiceps/';
            break;
        case 'Lumbares':
            for (let i = 0; i < 130; i += 5) {
                // mallasAnimacion.push("biceps_" + i + ".json");
                mallasAnimacion.push("newLumbares_" + i + ".json");
            }
            // carpeta = 'models/bicepsJSON/';
            carpeta = 'models/newLumbares/';
            break;
        default:
            for (let i = 0; i < 120; i += 6) {
                mallasAnimacion.push("newDorsales_" + i + ".json");
            }
            carpeta = 'models/newDorsales/';
            break;
    }


    parar = setInterval(function() {
        cambio(indice, mallasAnimacion, carpeta);
        auxmin = indice;
        auxmin++;
        indice = auxmin;

        if (indice >= mallasAnimacion.length) {
            // paremos();
            indice = 0;
        }
    }, 500);

}

function paremos() {
    clearInterval(parar);
}

//Pasar también el array mallas porque en cada ejercicio es diferente
function cambio(indice, mallasAnimacion, carpeta) {

    let entidad = motor.crearMalla(
        carpeta + mallasAnimacion[indice],
        textura.name,
        material
    );

    // let entidad2 = motor.crearMalla(
    //     carpeta + mallasAnimacion[indice - 1],
    //     textura.name,
    //     material
    // );

    entidad.actuTexturas = true;


    motor.setEntidad(motor.nodos[3], entidad);
    // motor.setEntidad(motor.nodos[4], entidad2);

    setTimeout(() => {
        motor.dibujarEscena();
    }, 200);
    // setTimeout(() => {
    //     motor.dibujarEscena();
    // }, 400);
}


// ESTO ES PARA QUE ROTE Y SE ESCALE CON EL RATON

function animarModelos() {
    let canvas = motor.getCanvas();
    var drag = false;
    var old_x, old_y;
    var dX = 0,
        dY = 0;
    var THETA = 0,
        PHI = 0;
    canvas.scroll = function(e) {
        nodo.escalar([0.9, 0.9, 0.9]);
        return false;
    }
    canvas.onmousedown = function(e) {
        drag = true;
        old_x = e.pageX, old_y = e.pageY;
        e.preventDefault();
        return false;
    }
    canvas.onmouseup = function(e) {
        drag = false;
    }
    canvas.onmousemove = function(e) {
        if (!drag) return false;
        dX = (e.pageX - old_x) * 2 * Math.PI / canvas.width,
            dY = (e.pageY - old_y) * 2 * Math.PI / canvas.height;
        THETA += dX;
        // PHI += dY;
        old_x = e.pageX, old_y = e.pageY;
        e.preventDefault();
    }
    canvas.onwheel = function(e) {
        scroll = true;
        if (e.deltaY < 0) {
            motor.acercar(nodo);
        } else if (e.deltaY > 0) {
            motor.alejar(nodo);
        }
    }

    window.onmousedown = function(e) {
        scroll = false;
    }

    function noScroll() {
        window.scrollTo(0, 0);
    }
    var animate = function(time) {

        if (!scroll) {
            window.removeEventListener('scroll', noScroll);
        } else {
            window.addEventListener('scroll', noScroll)
        }

        if (!drag) {
            THETA *= 0.95, PHI *= 0.95;
        } else {
            THETA *= 0.99, PHI *= 0.99;
        }
        nodo.rotar([0, 1, 0], THETA);
        nodo.rotar([1, 0, 0], PHI);

        // setTimeout(() => {
        motor.recorrerEscena();
        // }, 1000);

        anim = window.requestAnimationFrame(animate);
    }
    animate(0);
}
