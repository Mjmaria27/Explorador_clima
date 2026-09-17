const inputCiudad = document.getElementById("inputCiudad");
const btnBuscar = document.getElementById("btnBuscar");
const resultado = document.getElementById("resultado");
const mensaje = document.getElementById("mensaje");

// Historial de las últimas 5 búsquedas exitosas
let historial = [];


async function buscarDatos(ciudad) {

    // 1. Validación de entrada
    if (ciudad.trim() === "") {
        mensaje.textContent = "Por favor, ingresa una ciudad.";
        resultado.innerHTML = "";
        return;
    }

    // 2. Estado de carga
    mensaje.textContent = "Cargando...";
    resultado.innerHTML = "";

    const URL = `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${encodeURIComponent(ciudad)}&lang=es`;

    try {

        // 3. Petición a la API
        const respuesta = await fetch(URL);

        if (!respuesta.ok) {
            throw new Error("No se pudo obtener la información del clima.");
        }

        // 4. Convertir respuesta a JSON
        const datos = await respuesta.json();

        console.log(datos);

        // 5. Mostrar los datos en una tarjeta
        mostrarResultado(datos);

        // 6. Agregar ciudad al historial
        agregarHistorial(datos.location.name);

        // Limpiar mensaje
        mensaje.textContent = "";

    } catch (error) {

        // 7. Estado de error
        mensaje.innerHTML = `
            <p>${error.message}</p>
            <button id="btnReintentar">Reintentar</button>
        `;

        // Botón Reintentar
        document.getElementById("btnReintentar").addEventListener("click", () => {
            buscarDatos(ciudad);
        });
    }
}


function mostrarResultado(datos) {

    const ciudad = datos.location.name;
    const pais = datos.location.country;
    const temperatura = datos.current.temp_c;
    const condicion = datos.current.condition.text;
    const icono = datos.current.condition.icon;

    resultado.innerHTML = `
        <div class="tarjeta-clima">

            <img 
                src="https:${icono}" 
                alt="${condicion}"
            >

            <h2>${ciudad}</h2>

            <p>${pais}</p>

            <p class="temperatura">
                ${temperatura} °C
            </p>

            <p>
                ${condicion}
            </p>

        </div>
    `;
}


function agregarHistorial(ciudad) {

    // Evitar ciudades repetidas
    historial = historial.filter(
        item => item.toLowerCase() !== ciudad.toLowerCase()
    );

    historial.unshift(ciudad);

    historial = historial.slice(0, 5);

    mostrarHistorial();
}


function mostrarHistorial() {

    let contenedorHistorial = document.getElementById("historial");

    if (!contenedorHistorial) {

        contenedorHistorial = document.createElement("div");
        contenedorHistorial.id = "historial";

        resultado.parentNode.appendChild(contenedorHistorial);
    }

    if (historial.length === 0) {
        contenedorHistorial.innerHTML = "";
        return;
    }

    contenedorHistorial.innerHTML = `
        <h3>Últimas búsquedas</h3>

        <div class="lista-historial">
            ${historial.map(ciudad => `
                <button class="btn-historial" data-ciudad="${ciudad}">
                    ${ciudad}
                </button>
            `).join("")}
        </div>
    `;

    const botonesHistorial = document.querySelectorAll(".btn-historial");

    botonesHistorial.forEach(boton => {

        boton.addEventListener("click", () => {

            const ciudad = boton.dataset.ciudad;

            inputCiudad.value = ciudad;

            buscarDatos(ciudad);
        });

    });
}

btnBuscar.addEventListener("click", () => {

    const ciudad = inputCiudad.value;

    buscarDatos(ciudad);

});


inputCiudad.addEventListener("keydown", (event) => {

    if (event.key === "Enter") {

        const ciudad = inputCiudad.value;

        buscarDatos(ciudad);
    }

});