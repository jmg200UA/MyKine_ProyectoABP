function usuarioduele(agent) {

    var siti = agent.parameters.sitio;

    try {

        if (siti == "cuello" || siti == "el cuello") {
            payloadData = {
                "richContent": [
                    [{
                        "type": "image",
                        "rawUrl": "https://media.istockphoto.com/photos/male-feeling-the-neck-pain-picture-id695897806?k=20&m=695897806&s=612x612&w=0&h=shsQXV4G5S8uQFy4wro2zHIn8sGhXTezPEB5yMOEFMY=",
                        "accessibilityText": "cuello"
                    }]
                ]
            }
        }
        agent.add(new dfff.Payload(agent.UNSPECIFIED, payloadData, { sendAsMessage: true, rawPayload: true }));

    } catch (error) {
        agent.add("Hola chaval");
    }
}