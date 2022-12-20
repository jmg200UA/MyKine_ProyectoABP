const { response } = require('express');
const dfff = require('dialogflow-fulfillment');
const Cliente = require('../models/clientes');
const Ejercicio = require('../models/ejercicios');

const chatbot = async(req, res = response) => {

    const agent = new dfff.WebhookClient({
        request: req,
        response: res
    });

    let idcliente = req.body.originalDetectIntentRequest.payload.userId;
    let cliente = await Cliente.findById(idcliente).populate('rutinas.rutina').populate('rutinas.rutina.ejercicios.ejercicio').populate('informes');
    let todosejercicios = await Ejercicio.find();

    var payloadData = "";

    function usuarioduele(agent) {

        var siti = req.body.queryResult.parameters.sitio;


        let resultados = []; // array que devuelve los ids de las rutinas encontradas

        let regex, comparison;
        if (cliente) {
            resultados = [];
            for (var i = 0; i < cliente.rutinas.length; i++) {
                for (var j = 0; j < cliente.rutinas[i].rutina.ejercicios.length; j++) {
                    for (var x = 0; x < todosejercicios.length; x++) {
                        if (cliente.rutinas[i].rutina.ejercicios[j].ejercicio.equals(todosejercicios[x]._id)) {
                            regex = new RegExp(todosejercicios[x].subtipo, "gi");
                            comparison = regex.test(siti);
                            if (comparison) { // guardamos el ID de la rutina que lo contiene
                                resultados.push(cliente.rutinas[i].rutina._id);
                                break;
                            }
                        }
                    }
                }
            }
        }


        agent.add("Actualmente tienes " + resultados.length + " rutinas con ejercicios de " + siti + ".");


        if (resultados.length == 0) {
            agent.add("No tienes ninguna rutina con ejercicios de este tipo. Consultalo con tu fisio si así lo necesitas.")
        } else {
            //CABEZA

            if (siti == "cuello" || siti == "el cuello") {

                payloadData = {
                    "richContent": [
                        [{
                            "type": "button",
                            "icon": {
                                "type": "chevron_right",
                                "color": "#FF9800"
                            },
                            "text": "Aquí tienes el acceso directo a tu última rutina de cuello",
                            "link": "https://mykine.ovh/player/" + resultados[resultados.length - 1],
                            "event": {
                                "name": "",
                                "languageCode": "",
                                "parameters": {}
                            }
                        }]
                    ]
                }

            } else if (siti == "cervicales" || siti == "las cervicales") {

                payloadData = {
                    "richContent": [
                        [{
                            "type": "button",
                            "icon": {
                                "type": "chevron_right",
                                "color": "#FF9800"
                            },
                            "text": "Aquí tienes el acceso directo a tu última rutina de cervicales",
                            "link": "https://mykine.ovh/player/" + resultados[resultados.length - 1],
                            "event": {
                                "name": "",
                                "languageCode": "",
                                "parameters": {}
                            }
                        }]
                    ]
                }

            }

            //TORSO
            else if (siti == "hombro" || siti == "el hombro") {

                payloadData = {
                    "richContent": [
                        [{
                            "type": "button",
                            "icon": {
                                "type": "chevron_right",
                                "color": "#FF9800"
                            },
                            "text": "Aquí tienes el acceso directo a tu última rutina de hombro",
                            "link": "https://mykine.ovh/player/" + resultados[resultados.length - 1],
                            "event": {
                                "name": "",
                                "languageCode": "",
                                "parameters": {}
                            }
                        }]
                    ]
                }

            } else if (siti == "pecho" || siti == "el pecho") {

                payloadData = {
                    "richContent": [
                        [{
                            "type": "button",
                            "icon": {
                                "type": "chevron_right",
                                "color": "#FF9800"
                            },
                            "text": "Aquí tienes el acceso directo a tu última rutina de pecho",
                            "link": "https://mykine.ovh/player/" + resultados[resultados.length - 1],
                            "event": {
                                "name": "",
                                "languageCode": "",
                                "parameters": {}
                            }
                        }]
                    ]
                }

            } else if (siti == "abdomen" || siti == "el abdomen") {

                payloadData = {
                    "richContent": [
                        [{
                            "type": "button",
                            "icon": {
                                "type": "chevron_right",
                                "color": "#FF9800"
                            },
                            "text": "Aquí tienes el acceso directo a tu última rutina de abdomen",
                            "link": "https://mykine.ovh/player/" + resultados[resultados.length - 1],
                            "event": {
                                "name": "",
                                "languageCode": "",
                                "parameters": {}
                            }
                        }]
                    ]
                }

            } else if (siti == "lumbares" || siti == "las lumbares") {

                payloadData = {
                    "richContent": [
                        [{
                            "type": "button",
                            "icon": {
                                "type": "chevron_right",
                                "color": "#FF9800"
                            },
                            "text": "Aquí tienes el acceso directo a tu última rutina de lumbares",
                            "link": "https://mykine.ovh/player/" + resultados[resultados.length - 1],
                            "event": {
                                "name": "",
                                "languageCode": "",
                                "parameters": {}
                            }
                        }]
                    ]
                }

            } else if (siti == "dorsales" || siti == "las dorsales") {

                payloadData = {
                    "richContent": [
                        [{
                            "type": "button",
                            "icon": {
                                "type": "chevron_right",
                                "color": "#FF9800"
                            },
                            "text": "Aquí tienes el acceso directo a tu última rutina de dorsales",
                            "link": "https://mykine.ovh/player/" + resultados[resultados.length - 1],
                            "event": {
                                "name": "",
                                "languageCode": "",
                                "parameters": {}
                            }
                        }]
                    ]
                }

            } else if (siti == "pelvis" || siti == "la pelvis") {

                payloadData = {
                    "richContent": [
                        [{
                            "type": "button",
                            "icon": {
                                "type": "chevron_right",
                                "color": "#FF9800"
                            },
                            "text": "Aquí tienes el acceso directo a tu última rutina de pelvis",
                            "link": "https://mykine.ovh/player/" + resultados[resultados.length - 1],
                            "event": {
                                "name": "",
                                "languageCode": "",
                                "parameters": {}
                            }
                        }]
                    ]
                }

            } else if (siti == "gluteo" || siti == "gluteos" || siti == "el gluteo" || siti == "los gluteos") {

                payloadData = {
                    "richContent": [
                        [{
                            "type": "button",
                            "icon": {
                                "type": "chevron_right",
                                "color": "#FF9800"
                            },
                            "text": "Aquí tienes el acceso directo a tu última rutina de gluteos",
                            "link": "https://mykine.ovh/player/" + resultados[resultados.length - 1],
                            "event": {
                                "name": "",
                                "languageCode": "",
                                "parameters": {}
                            }
                        }]
                    ]
                }

            }

            //BRAZOS  
            else if (siti == "triceps" || siti == "los triceps") {

                payloadData = {
                    "richContent": [
                        [{
                            "type": "button",
                            "icon": {
                                "type": "chevron_right",
                                "color": "#FF9800"
                            },
                            "text": "Aquí tienes el acceso directo a tu última rutina de triceps",
                            "link": "https://mykine.ovh/player/" + resultados[resultados.length - 1],
                            "event": {
                                "name": "",
                                "languageCode": "",
                                "parameters": {}
                            }
                        }]
                    ]
                }

            } else if (siti == "biceps" || siti == "los biceps") {

                payloadData = {
                    "richContent": [
                        [{
                            "type": "button",
                            "icon": {
                                "type": "chevron_right",
                                "color": "#FF9800"
                            },
                            "text": "Aquí tienes el acceso directo a tu última rutina de biceps",
                            "link": "https://mykine.ovh/player/" + resultados[resultados.length - 1],
                            "event": {
                                "name": "",
                                "languageCode": "",
                                "parameters": {}
                            }
                        }]
                    ]
                }

            } else if (siti == "codo" || siti == "el codo") {

                payloadData = {
                    "richContent": [
                        [{
                            "type": "button",
                            "icon": {
                                "type": "chevron_right",
                                "color": "#FF9800"
                            },
                            "text": "Aquí tienes el acceso directo a tu última rutina de codo",
                            "link": "https://mykine.ovh/player/" + resultados[resultados.length - 1],
                            "event": {
                                "name": "",
                                "languageCode": "",
                                "parameters": {}
                            }
                        }]
                    ]
                }

            } else if (siti == "antebrazo" || siti == "el antebrazo") {

                payloadData = {
                    "richContent": [
                        [{
                            "type": "button",
                            "icon": {
                                "type": "chevron_right",
                                "color": "#FF9800"
                            },
                            "text": "Aquí tienes el acceso directo a tu última rutina de antebrazo",
                            "link": "https://mykine.ovh/player/" + resultados[resultados.length - 1],
                            "event": {
                                "name": "",
                                "languageCode": "",
                                "parameters": {}
                            }
                        }]
                    ]
                }

            } else if (siti == "muñeca" || siti == "la muñeca") {

                payloadData = {
                    "richContent": [
                        [{
                            "type": "button",
                            "icon": {
                                "type": "chevron_right",
                                "color": "#FF9800"
                            },
                            "text": "Aquí tienes el acceso directo a tu última rutina de muñeca",
                            "link": "https://mykine.ovh/player/" + resultados[resultados.length - 1],
                            "event": {
                                "name": "",
                                "languageCode": "",
                                "parameters": {}
                            }
                        }]
                    ]
                }

            } else if (siti == "mano" || siti == "la mano") {

                payloadData = {
                    "richContent": [
                        [{
                            "type": "button",
                            "icon": {
                                "type": "chevron_right",
                                "color": "#FF9800"
                            },
                            "text": "Aquí tienes el acceso directo a tu última rutina de mano",
                            "link": "https://mykine.ovh/player/" + resultados[resultados.length - 1],
                            "event": {
                                "name": "",
                                "languageCode": "",
                                "parameters": {}
                            }
                        }]
                    ]
                }

            }

            //PIERNAS
            else if (siti == "isquiotibiales" || siti == "los isquiotibiales") {

                payloadData = {
                    "richContent": [
                        [{
                            "type": "button",
                            "icon": {
                                "type": "chevron_right",
                                "color": "#FF9800"
                            },
                            "text": "Aquí tienes el acceso directo a tu última rutina de isquiotibiales",
                            "link": "https://mykine.ovh/player/" + resultados[resultados.length - 1],
                            "event": {
                                "name": "",
                                "languageCode": "",
                                "parameters": {}
                            }
                        }]
                    ]
                }

            } else if (siti == "cuadriceps" || siti == "el cuadriceps") {

                payloadData = {
                    "richContent": [
                        [{
                            "type": "button",
                            "icon": {
                                "type": "chevron_right",
                                "color": "#FF9800"
                            },
                            "text": "Aquí tienes el acceso directo a tu última rutina de cuadriceps",
                            "link": "https://mykine.ovh/player/" + resultados[resultados.length - 1],
                            "event": {
                                "name": "",
                                "languageCode": "",
                                "parameters": {}
                            }
                        }]
                    ]
                }

            } else if (siti == "rodilla" || siti == "la rodilla") {

                payloadData = {
                    "richContent": [
                        [{
                            "type": "button",
                            "icon": {
                                "type": "chevron_right",
                                "color": "#FF9800"
                            },
                            "text": "Aquí tienes el acceso directo a tu última rutina de rodilla",
                            "link": "https://mykine.ovh/player/" + resultados[resultados.length - 1],
                            "event": {
                                "name": "",
                                "languageCode": "",
                                "parameters": {}
                            }
                        }]
                    ]
                }

            } else if (siti == "gemelo" || siti == "el gemelo" || siti == "gemelos" || siti == "los gemelos") {

                payloadData = {
                    "richContent": [
                        [{
                            "type": "button",
                            "icon": {
                                "type": "chevron_right",
                                "color": "#FF9800"
                            },
                            "text": "Aquí tienes el acceso directo a tu última rutina de gemelos",
                            "link": "https://mykine.ovh/player/" + resultados[resultados.length - 1],
                            "event": {
                                "name": "",
                                "languageCode": "",
                                "parameters": {}
                            }
                        }]
                    ]
                }

            } else if (siti == "soleo" || siti == "el soleo") {

                payloadData = {
                    "richContent": [
                        [{
                            "type": "button",
                            "icon": {
                                "type": "chevron_right",
                                "color": "#FF9800"
                            },
                            "text": "Aquí tienes el acceso directo a tu última rutina de soleo",
                            "link": "https://mykine.ovh/player/" + resultados[resultados.length - 1],
                            "event": {
                                "name": "",
                                "languageCode": "",
                                "parameters": {}
                            }
                        }]
                    ]
                }

            } else if (siti == "tobillo" || siti == "el tobillo") {

                payloadData = {
                    "richContent": [
                        [{
                            "type": "button",
                            "icon": {
                                "type": "chevron_right",
                                "color": "#FF9800"
                            },
                            "text": "Aquí tienes el acceso directo a tu última rutina de tobillo",
                            "link": "https://mykine.ovh/player/" + resultados[resultados.length - 1],
                            "event": {
                                "name": "",
                                "languageCode": "",
                                "parameters": {}
                            }
                        }]
                    ]
                }

            } else if (siti == "pie" || siti == "el pie") {

                payloadData = {
                    "richContent": [
                        [{
                            "type": "button",
                            "icon": {
                                "type": "chevron_right",
                                "color": "#FF9800"
                            },
                            "text": "Aquí tienes el acceso directo a tu última rutina de pie",
                            "link": "https://mykine.ovh/player/" + resultados[resultados.length - 1],
                            "event": {
                                "name": "",
                                "languageCode": "",
                                "parameters": {}
                            }
                        }]
                    ]
                }

            } else {
                payloadData = {
                    "richContent": [
                        [{
                            "type": "description",
                            "title": "No atendemos esa musculatura. Por favor, comuníqueselo a su fisioterapeuta si tiene alguna duda"
                        }]
                    ]
                }
            }

            agent.add(new dfff.Payload(agent.UNSPECIFIED, payloadData, { sendAsMessage: true, rawPayload: true }));
            payloadData = "";
        }

    }


    function redessociales(agent) {

        var red = req.body.queryResult.parameters.redsocial;

        if (red == "red social" || red == "redes sociales") {
            payloadData = {
                "richContent": [
                    [{
                            "type": "description",
                            "title": "Aquí tienes todas nuestras redes sociales",
                        }, {
                            "type": "button",
                            "icon": {
                                "type": "chevron_right",
                                "color": "#FF9800"
                            },
                            "text": "Instagram",
                            "link": "https://www.instagram.com/mykineua/?hl=es",
                            "event": {
                                "name": "",
                                "languageCode": "",
                                "parameters": {}
                            }
                        },
                        {
                            "type": "button",
                            "icon": {
                                "type": "chevron_right",
                                "color": "#FF9800"
                            },
                            "text": "Twitter",
                            "link": "https://twitter.com/mykineua",
                            "event": {
                                "name": "",
                                "languageCode": "",
                                "parameters": {}
                            }
                        }, {
                            "type": "button",
                            "icon": {
                                "type": "chevron_right",
                                "color": "#FF9800"
                            },
                            "text": "Tiktok",
                            "link": "https://www.tiktok.com/@mykineua",
                            "event": {
                                "name": "",
                                "languageCode": "",
                                "parameters": {}
                            }
                        }
                    ]
                ]
            }
        } else if (red == "instagram") {
            payloadData = {
                "richContent": [
                    [{
                        "type": "description",
                        "title": "Aquí tienes nuestro Twitter",
                    }, {
                        "type": "button",
                        "icon": {
                            "type": "chevron_right",
                            "color": "#FF9800"
                        },
                        "text": "Instagram",
                        "link": "https://www.instagram.com/mykineua/?hl=es",
                        "event": {
                            "name": "",
                            "languageCode": "",
                            "parameters": {}
                        }
                    }]
                ]
            }
        } else if (red == "twitter") {
            payloadData = {
                "richContent": [
                    [{
                        "type": "description",
                        "title": "Aquí tienes nuestro Twitter",
                    }, {
                        "type": "button",
                        "icon": {
                            "type": "chevron_right",
                            "color": "#FF9800"
                        },
                        "text": "Twitter",
                        "link": "https://twitter.com/mykineua",
                        "event": {
                            "name": "",
                            "languageCode": "",
                            "parameters": {}
                        }
                    }]
                ]
            }

        } else if (red == "tiktok") {
            payloadData = {
                "richContent": [
                    [{
                        "type": "description",
                        "title": "Aquí tienes nuestro Tiktok",
                    }, {
                        "type": "button",
                        "icon": {
                            "type": "chevron_right",
                            "color": "#FF9800"
                        },
                        "text": "Tiktok",
                        "link": "https://www.tiktok.com/@mykineua",
                        "event": {
                            "name": "",
                            "languageCode": "",
                            "parameters": {}
                        }
                    }]
                ]
            }

        } else {
            payloadData = {
                "richContent": [
                    [{
                            "type": "description",
                            "title": "Aquí tienes todas nuestras redes sociales",
                        }, {
                            "type": "button",
                            "icon": {
                                "type": "chevron_right",
                                "color": "#FF9800"
                            },
                            "text": "Instagram",
                            "link": "https://www.instagram.com/mykineua/?hl=es",
                            "event": {
                                "name": "",
                                "languageCode": "",
                                "parameters": {}
                            }
                        },
                        {
                            "type": "button",
                            "icon": {
                                "type": "chevron_right",
                                "color": "#FF9800"
                            },
                            "text": "Twitter",
                            "link": "https://twitter.com/mykineua",
                            "event": {
                                "name": "",
                                "languageCode": "",
                                "parameters": {}
                            }
                        }, {
                            "type": "button",
                            "icon": {
                                "type": "chevron_right",
                                "color": "#FF9800"
                            },
                            "text": "Tiktok",
                            "link": "https://www.tiktok.com/@mykineua",
                            "event": {
                                "name": "",
                                "languageCode": "",
                                "parameters": {}
                            }
                        }
                    ]
                ]
            }
        }
        agent.add(new dfff.Payload(agent.UNSPECIFIED, payloadData, { sendAsMessage: true, rawPayload: true }));
        payloadData = "";
    }

    function dudasfuncionamiento(agent) {




        payloadData = {
            "richContent": [
                [{
                    "type": "description",
                    "title": " Tu interfaz como cliente está compuesta por 4 apartados principales : Rutinas, Informes, Historial y Perfil. Si necesitas saber más sobre algún apartado en concreto selecciona una opción.",
                }, {

                    "type": "chips",
                    "options": [{
                            "text": "Rutinas",
                            "event": {
                                "name": "Rutinas",
                                "languageCode": "Rutinas"
                            }

                        },
                        {
                            "text": "Informes",
                            "event": {
                                "name": "Informes",
                                "languageCode": "Informes"
                            }
                        },
                        {
                            "text": "Historial",
                            "event": {
                                "name": "Historial",
                                "languageCode": "Historial"
                            }
                        },
                        {
                            "text": "Perfil",
                            "event": {
                                "name": "Perfil",
                                "languageCode": "Perfil"
                            }
                        }
                    ]
                }]
            ]
        }
        agent.add(new dfff.Payload(agent.UNSPECIFIED, payloadData, { sendAsMessage: true, rawPayload: true }));
        payloadData = "";
    }

    function usuariorutina(agent) {

        var siti = req.body.queryResult.parameters.rutina;

        if (siti.indexOf("cuello") != -1) {
            payloadData = {
                "richContent": [
                    [{
                        "type": "image",
                        "rawUrl": "https://media.istockphoto.com/photos/male-feeling-the-neck-pain-picture-id695897806?k=20&m=695897806&s=612x612&w=0&h=shsQXV4G5S8uQFy4wro2zHIn8sGhXTezPEB5yMOEFMY=",
                        "accessibilityText": "cuello"
                    }]
                ]
            }
        } else if (siti == "de espalda" || siti == "la espalda") {
            payloadData = {
                "richContent": [
                    [{
                        "type": "image",
                        "rawUrl": "https://media.istockphoto.com/photos/back-painconceptual-artwork3d-illustration-picture-id1156927970?k=20&m=1156927970&s=612x612&w=0&h=QdRHfLk25aH89K_JLp5EnwzV8irNp05a-K6mCPU_Tns=",
                        "accessibilityText": "espalda"
                    }]
                ]
            }
        } else if (siti == "rodilla" || siti == "la rodilla") {
            payloadData = {
                "richContent": [
                    [{
                        "type": "image",
                        "rawUrl": "https://media.istockphoto.com/photos/knee-painful-skeleton-xray-picture-id956015576?k=20&m=956015576&s=612x612&w=0&h=azaolKFIGlETpuUc4tVkcKaGEnn4GMyrKEDLUPZWwq8=",
                        "accessibilityText": "rodilla"
                    }]
                ]
            }
        } else if (siti == "hombro" || siti == "el hombro") {
            payloadData = {
                "richContent": [
                    [{
                        "type": "image",
                        "rawUrl": "https://media.istockphoto.com/photos/male-feeling-the-shoulder-pain-picture-id675067134?k=20&m=675067134&s=612x612&w=0&h=t7LLUO4gCH11UtlOPkjh45o6tt8wVlJUgU6qNvWJzyU=",
                        "accessibilityText": "hombro"
                    }]
                ]
            }
        } else if (siti == "codo" || siti == "el codo") {
            payloadData = {
                "richContent": [
                    [{
                        "type": "image",
                        "rawUrl": "https://media.istockphoto.com/photos/men-feeling-elbow-pain-picture-id681807144?k=20&m=681807144&s=612x612&w=0&h=xIXYXX5k9SAxSGrww_4Y7jqfRikwv5elHsOLsj19FDI=",
                        "accessibilityText": "codo"
                    }]
                ]
            }
        } else if (siti == "muñeca" || siti == "la muñeca") {
            payloadData = {
                "richContent": [
                    [{
                            "type": "image",
                            "rawUrl": "https://media.istockphoto.com/photos/men-feeling-the-wrist-pain-picture-id681804072?k=20&m=681804072&s=612x612&w=0&h=IBCoFUSsNYeKoEr1KhPb3ldCagyYiQX3AjZtmE9Ja9g=",
                            "accessibilityText": "muñeca"
                        },
                        {
                            "type": "button",
                            "icon": {
                                "type": "chevron_right",
                                "color": "#FF9800"
                            },
                            "text": "Visitanos",
                            "link": "https://mykine.ovh/webdullah/",
                            "event": {
                                "name": "",
                                "languageCode": "",
                                "parameters": {}
                            }
                        }
                    ]
                ]
            }
        } else if (siti == "cervicales" || siti == "las cervicales") {
            payloadData = {
                "richContent": [
                    [{
                        "type": "image",
                        "rawUrl": "https://media.istockphoto.com/photos/neck-painful-cervical-spine-skeleton-xray-3d-illustration-picture-id900630072?k=20&m=900630072&s=612x612&w=0&h=NRMwtQH1LSG616JGqokaEcxAVRZZi8wv4w54w3VH4Js=",
                        "accessibilityText": "cervicales"
                    }]
                ]
            }
        } else {
            payloadData = {
                "richContent": [
                    [{
                        "type": "description",
                        "title": "¿De que quieres la rutina?"
                    }]
                ]
            }
        }

        agent.add(new dfff.Payload(agent.UNSPECIFIED, payloadData, { sendAsMessage: true, rawPayload: true }));
        payloadData = "";
    }

    function redirigir(agent) {

        var siti = req.body.queryResult.parameters.sitio;

        if (siti == "informes" || siti == "los informes") {
            agent.add("Puedes acceder al apartado de informes haciendo click en la segunda opción de la pestaña superior izquierda.")
        } else if (siti == "rutinas" || siti == "las rutinas") {
            agent.add("Puedes acceder al apartado de rutinas haciendo click en la primera opción de la pestaña superior izquierda.")
                //aqui tienes tu ultima rutina
        } else if (siti == "historial" || siti == "el historial") {
            agent.add("Puedes acceder al apartado de historial haciendo click en la tercera opción de la pestaña superior izquierda.")
        } else if (siti == "perfil" || siti == "el perfil") {
            payloadData = {
                "richContent": [
                    [{
                        "type": "button",
                        "icon": {
                            "type": "chevron_right",
                            "color": "#FF9800"
                        },
                        "text": "Haz click para ir al perfil",
                        "link": "https://mykine.ovh/cliente/perfil",
                        "event": {
                            "name": "",
                            "languageCode": "",
                            "parameters": {}
                        }
                    }]
                ]
            }
        } else {
            payloadData = {
                "richContent": [
                    [{
                        "type": "description",
                        "title": "No puedo redirigirte a esa ruta. Lo siento :("
                    }]
                ]
            }
        }

        agent.add(new dfff.Payload(agent.UNSPECIFIED, payloadData, { sendAsMessage: true, rawPayload: true }));
        payloadData = "";
    }


    function tiemporutina(agent) {
        agent.add("Cada vez que realizas una rutina se registra el tiempo que has tardado en hacerla.");
        if (cliente) {
            agent.add("El tiempo que has tardado en tu última rutina es " + cliente.rutinas[cliente.rutinas.length - 1].duracion[cliente.rutinas[cliente.rutinas.length - 1].duracion.length - 1] + "s.");
        }

    }


    var intentMap = new Map();

    intentMap.set('usuarioduele', usuarioduele);
    intentMap.set('redessociales', redessociales);
    intentMap.set('usuariorutina', usuariorutina);
    intentMap.set('dudasfuncionamiento', dudasfuncionamiento);
    intentMap.set('tiemporutina', tiemporutina);
    intentMap.set('redirigir', redirigir);

    agent.handleRequest(intentMap);
}


module.exports = { chatbot };