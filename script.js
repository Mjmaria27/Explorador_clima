const inputCiudad = document.getElementById("inputCiudad");
const btnBuscar = document.getElementById("btnBuscar");
const resultado = document.getElementById("resultado");
const mensaje = document.getElementById("mensaje");


async function buscarDatos(ciudad) {

    const URL = `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${encodeURIComponent(ciudad)}&lang=es`;

    const respuesta = await fetch(URL);

    if (!respuesta.ok) {
        throw new Error("No se pudo obtener la información del clima.");
    }

    const datos = await respuesta.json();

    console.log(datos);
}


btnBuscar.addEventListener("click", () => {

    const ciudad = inputCiudad.value;

    buscarDatos(ciudad);

});