function Persona(nombre, edad) {
  this.nombre = nombre;
  this.edad = edad;
}

let personas = [];
let personasEliminadas = personasEliminadasLocal() || [];

function obtenerPersonasLocal() {
  const personasGuardadas = localStorage.getItem("personas");
  return personasGuardadas ? JSON.parse(personasGuardadas) : [];
}

function personasGuardadasLocal(personas) {
  localStorage.setItem("personas", JSON.stringify(personas));
}

function personasEliminadasLocal() {
  const personasEliminadasGuardadas = localStorage.getItem("personasEliminadas");
  return personasEliminadasGuardadas ? JSON.parse(personasEliminadasGuardadas) : [];
}

function guardarPersonasEliminadasEnLocalStorage(personasEliminadas) {
  localStorage.setItem("personasEliminadas", JSON.stringify(personasEliminadas));
}

function cargarPersonasLocal() {
  const personasLocalStorage = obtenerPersonasLocal();
  if (personasLocalStorage.length > 0) {
    personas = personasLocalStorage;
  }
  mostrarPersonas();
}

cargarPersonasLocal();

document.getElementById("mostrar-btn").addEventListener("click", mostrarPersonas);
document.getElementById("agregar-formulario").addEventListener("submit", agregarPersonaFormulario);
document.getElementById("agregar-btn").addEventListener("click", toggleAgregarForm);
document.getElementById("buscar-formulario").addEventListener("submit", buscarPersonaNombreFormulario);
document.getElementById("buscar-btn").addEventListener("click", toggleBuscarForm);
document.getElementById("filtrar-formulario").addEventListener("submit", edadMinimaFormulario);
document.getElementById("filtrar-btn").addEventListener("click", toggleFiltrarForm);
document.getElementById("ordenar-btn").addEventListener("click", ordenarPersonasAlfabeticamente);
document.getElementById("ordenar-por-edad-baja").addEventListener("click", ordenarPorEdadBaja);
document.getElementById("ordenar-por-edad-alta").addEventListener("click", ordenarPorEdadAlta);

function ordenarPersonasAlfabeticamente() {
  personas.sort(function (a, b) {
    let nombreA = a.nombre.toLowerCase();
    let nombreB = b.nombre.toLowerCase();

    if (nombreA < nombreB) {
      return -1;
    }
    if (nombreA > nombreB) {
      return 1;
    }
    return 0;
  });

  personasGuardadasLocal(personas);
  mostrarPersonas();
}

function limpiarListado() {
  let radioButtons = document.getElementsByName("seleccionarPersona");
  let indexSeleccionado = -1;

  for (let i = 0; i < radioButtons.length; i++) {
    if (radioButtons[i].checked) {
      indexSeleccionado = i;
      break;
    }
  }

  if (indexSeleccionado !== -1) {
    let personaEliminada = personas.splice(indexSeleccionado, 1)[0];
    personasEliminadas.push(personaEliminada);

    personasGuardadasLocal(personas);
    guardarPersonasEliminadasEnLocalStorage(personasEliminadas);

    mostrarPersonas();

    Toastify({
      text: "Persona eliminada correctamente.",
      duration: 3000,
      close: true,
      gravity: "bottom",
      position: "left",
      stopOnFocus: true,
      backgroundColor: "#5EC27E"
    }).showToast();
  } else {
    Toastify({
      text: "Por favor, seleccione una persona antes de eliminarla.",
      duration: 3000,
      close: true,
      gravity: "bottom",
      position: "left",
      stopOnFocus: true,
      backgroundColor: "#FE0054"
    }).showToast();
  }
}

function mostrarPersonas() {
  let resultadoDiv = document.getElementById("resultado");
  resultadoDiv.style.display = "block";
  resultadoDiv.innerHTML = "";
  let mensaje = "<h2>Listado de personas</h2>";

  personas.forEach(function (persona, index) {
    mensaje +=
      '<li>' +
      ' Nombre: <span id="nombrePersona' + index + '">' + persona.nombre + '</span>' +
      ' Edad: <span id="edadPersona' + index + '">' + persona.edad + '</span>' +
      ' <button id="personalizar-btn' + index + '" onclick="habilitarEdicion(' + index + ')">Personalizar</button>' +
      ' <button id="guardar-btn' + index + '" style="display: none;">Guardar Cambios</button>' +
      ' <input type="radio" name="seleccionarPersona" id="seleccionarPersona' + index + '" onclick="seleccionarPersona(' + index + ')">' +
      "</li>";
  });

  mensaje += '<button id="limpiar-btn" onclick="limpiarListado()">Eliminar persona</button>';
  resultadoDiv.innerHTML = mensaje;

  for (let i = 0; i < personas.length; i++) {
    (function (index) {
      let personalizarBtn = document.getElementById("personalizar-btn" + index);
      personalizarBtn.addEventListener("click", function () {
        habilitarEdicion(index);
      });

      let guardarBtn = document.getElementById("guardar-btn" + index);
      guardarBtn.addEventListener("click", function () {
        guardarCambios(index);
      });
    })(i);
  }
}

function seleccionarPersona(index) {
  let radioButtons = document.getElementsByName("seleccionarPersona");
  for (let i = 0; i < radioButtons.length; i++) {
    if (i !== index) {
      radioButtons[i].checked = false;
    }
  }
}

function toggleAgregarForm() {
  let formDiv = document.getElementById("agregar-form");
  formDiv.style.display = formDiv.style.display === "none" ? "block" : "none";
}

function agregarPersonaFormulario(event) {
  event.preventDefault();
  let nombre = document.getElementById("nombre").value;
  let edad = parseInt(document.getElementById("edad").value);

  let nombreValido = /^[a-zA-Z\s]+$/.test(nombre);

  if (nombreValido && !isNaN(edad) && edad >= 1 && edad <= 100) {
    personas.push(new Persona(nombre, edad));
    personasGuardadasLocal(personas);
    mostrarPersonas();
    document.getElementById("agregar-formulario").reset();
    toggleAgregarForm();

    Toastify({
      text: "Persona agregada correctamente.",
      duration: 3000,
      close: true,
      gravity: "bottom",
      position: "left",
      stopOnFocus: true,
      backgroundColor: "#5EC27E"
    }).showToast();
  } else {
    Toastify({
      text: "Por favor, ingrese un nombre válido (solo letras) y una edad válida (entre 1 y 100).",
      duration: 3000,
      close: true,
      gravity: "bottom",
      position: "left",
      stopOnFocus: true,
      backgroundColor: "#FE0054"
    }).showToast();
  }
}

function toggleBuscarForm() {
  let formDiv = document.getElementById("buscar-form");
  formDiv.style.display = formDiv.style.display === "none" ? "block" : "none";
}

function buscarPersonaNombreFormulario(event) {
  event.preventDefault();
  let nombreBuscado = document.getElementById("nombreBuscado").value;
  let personasEncontradas = buscarPersonasPorNombre(nombreBuscado);
  let resultadoDiv = document.getElementById("resultado");

  if (personasEncontradas.length > 0) {
    let mensaje = "<h2>Personas encontradas:</h2>";
    mensaje += "<ul>";
    personasEncontradas.forEach(function (persona) {
      mensaje += "<li>Nombre: " + persona.nombre + ", Edad: " + persona.edad + "</li>";
    });
    mensaje += "</ul>";
    resultadoDiv.innerHTML = mensaje;

    Toastify({
      text: "Personas encontradas correctamente.",
      duration: 3000,
      close: true,
      gravity: "bottom",
      position: "left",
      stopOnFocus: true,
      backgroundColor: "#5EC27E"
    }).showToast();
  } else {
    Toastify({
      text: "No se encontraron personas con el nombre especificado.",
      duration: 3000,
      close: true,
      gravity: "bottom",
      position: "left",
      stopOnFocus: true,
      backgroundColor: "#FE0054"
    }).showToast();
  }
}

function buscarPersonasPorNombre(nombreBuscado) {
  return personas.filter(function (persona) {
    return persona.nombre.toLowerCase() === nombreBuscado.toLowerCase();
  });
}

function toggleFiltrarForm() {
  let formDiv = document.getElementById("filtrar-form");
  formDiv.style.display = formDiv.style.display === "none" ? "block" : "none";
}

function edadMinimaFormulario(event) {
  event.preventDefault();
  let edadMinima = parseInt(document.getElementById("edadMinima").value);

  if (edadMinima < 0) {
    Toastify({
      text: "No se admiten números negativos.",
      duration: 3000,
      close: true,
      gravity: "bottom",
      position: "left",
      backgroundColor: "#FE0054"
    }).showToast();
    return;
  }

  let personasFiltradas = filtrarPersonasPorEdadMinima(edadMinima);
  let resultadoDiv = document.getElementById("resultado");

  if (personasFiltradas.length > 0) {
    let mensaje = "<h2>Personas con edad mayor o igual a " + edadMinima + ":</h2>";
    mensaje += "<ul>";
    personasFiltradas.forEach(function (persona) {
      mensaje += "<li>Nombre: " + persona.nombre + ", Edad: " + persona.edad + "</li>";
    });
    mensaje += "</ul>";
    resultadoDiv.innerHTML = mensaje;

    Toastify({
      text: "Personas filtradas correctamente.",
      duration: 3000,
      close: true,
      gravity: "bottom",
      position: "left",
      backgroundColor: "#5EC27E"
    }).showToast();
  } else {
    resultadoDiv.innerHTML = "<p>No se encontraron personas con la edad mínima especificada.</p>";

    Toastify({
      text: "No se encontraron personas con la edad mínima especificada.",
      duration: 3000,
      close: true,
      gravity: "bottom",
      position: "left",
      backgroundColor: "#FF5733"
    }).showToast();
  }
}

function filtrarPersonasPorEdadMinima(edadMinima) {
  return personas.filter(function (persona) {
    return persona.edad >= edadMinima;
  });
}

function habilitarEdicion(index) {
  deshabilitarEdicion();

  let nombreElement = document.getElementById("nombrePersona" + index);
  let edadElement = document.getElementById("edadPersona" + index);
  let personalizarBtn = document.getElementById("personalizar-btn" + index);
  let guardarBtn = document.getElementById("guardar-btn" + index);

  nombreElement.contentEditable = true;
  edadElement.contentEditable = true;

  nombreElement.style.border = "1px solid #000";
  edadElement.style.border = "1px solid #000";

  personalizarBtn.style.display = "none";
  guardarBtn.style.display = "inline";
  guardarBtn.addEventListener("click", function () {});
}

function guardarCambios(index) {
  let nombreElement = document.getElementById("nombrePersona" + index);
  let edadElement = document.getElementById("edadPersona" + index);
  let nuevoNombre = nombreElement.textContent;
  let nuevaEdad = parseInt(edadElement.textContent);

  if (!/^[a-zA-Z]+$/.test(nuevoNombre)) {
    Toastify({
      text: "Por favor, ingrese un nombre válido (solo letras).",
      duration: 3000,
      close: true,
      gravity: "bottom",
      position: "left",
      stopOnFocus: true,
      backgroundColor: "#FE0054"
    }).showToast();
    return;
  }

  if (isNaN(nuevaEdad) || nuevaEdad < 1 || nuevaEdad > 100) {
    Toastify({
      text: "Por favor, ingrese una edad válida (número positivo y de 1 a 100).",
      duration: 3000,
      close: true,
      gravity: "bottom",
      position: "left",
      stopOnFocus: true,
      backgroundColor: "#FE0054"
    }).showToast();
    return;
  }

  personas[index].nombre = nuevoNombre;
  personas[index].edad = nuevaEdad;
  personasGuardadasLocal(personas);
  mostrarPersonas();

  Toastify({
    text: "Cambios guardados correctamente.",
    duration: 3000,
    close: true,
    gravity: "bottom",
    position: "left",
    stopOnFocus: true,
    backgroundColor: "#5EC27E"
  }).showToast();

  let personalizarBtn = document.getElementById("personalizar-btn" + index);
  let guardarBtn = document.getElementById("guardar-btn" + index);
  personalizarBtn.style.display = "inline";
  guardarBtn.style.display = "none";

  nombreElement.contentEditable = false;
  edadElement.contentEditable = false;
  nombreElement.style.border = "none";
  edadElement.style.border = "none";
}

function deshabilitarEdicion() {
  for (let index = 0; index < personas.length; index++) {
    let nombreElement = document.getElementById("nombrePersona" + index);
    let edadElement = document.getElementById("edadPersona" + index);

    nombreElement.contentEditable = false;
    edadElement.contentEditable = false;

    nombreElement.style.border = "none";
    edadElement.style.border = "none";
  }
}

function ordenarPorEdadBaja() {
  personas.sort(function (a, b) {
    return a.edad - b.edad;
  });

  personasGuardadasLocal(personas);
  mostrarPersonas();
}

function ordenarPorEdadAlta() {
  personas.sort(function (a, b) {
    return b.edad - a.edad;
  });

  personasGuardadasLocal(personas);
  mostrarPersonas();
}

function limpiarListado() {
  let radioButtons = document.getElementsByName("seleccionarPersona");
  let indexSeleccionado = -1;

  for (let i = 0; i < radioButtons.length; i++) {
    if (radioButtons[i].checked) {
      indexSeleccionado = i;
      break;
    }
  }

  if (indexSeleccionado !== -1) {
    let personaEliminada = personas.splice(indexSeleccionado, 1)[0];
    personasEliminadas.push(personaEliminada);

    personasGuardadasLocal(personas);
    guardarPersonasEliminadasEnLocalStorage(personasEliminadas);

    mostrarPersonas();

    Toastify({
      text: "Persona eliminada correctamente.",
      duration: 3000,
      close: true,
      gravity: "bottom",
      position: "left",
      stopOnFocus: true,
      backgroundColor: "#5EC27E"
    }).showToast();
  } else {
    Toastify({
      text: "Por favor, seleccione una persona antes de eliminarla.",
      duration: 3000,
      close: true,
      gravity: "bottom",
      position: "left",
      stopOnFocus: true,
      backgroundColor: "#FE0054"
    }).showToast();
  }
}

document.getElementById("eliminar-persona-btn").addEventListener("click", function () {
  mostrarListadoEliminados();
});

function mostrarListadoEliminados() {
  let listadoEliminadosDiv = document.getElementById("listado-eliminados");
  let listaEliminadosUl = document.getElementById("lista-eliminados");
  let restaurarSeleccionadoBtn = document.getElementById("restaurar-seleccionado-btn");

  listaEliminadosUl.innerHTML = "";

  personasEliminadas.forEach(function (persona, index) {
    let listItem = document.createElement("li");
    listItem.innerHTML = `<input type="radio" name="seleccionarEliminado" id="seleccionarEliminado${index}"> ${persona.nombre}`;
    listaEliminadosUl.appendChild(listItem);
  });

  listadoEliminadosDiv.style.display = "block";
  restaurarSeleccionadoBtn.disabled = true;

  listaEliminadosUl.addEventListener("click", function (event) {
    if (event.target.tagName === "INPUT") {
      restaurarSeleccionadoBtn.disabled = false;
    }
  });

  restaurarSeleccionadoBtn.addEventListener("click", function () {
    let radios = document.getElementsByName("seleccionarEliminado");
    let indexSeleccionado = -1;

    for (let i = 0; i < radios.length; i++) {
      if (radios[i].checked) {
        indexSeleccionado = i;
        break;
      }
    }

    if (indexSeleccionado !== -1) {
      let personaRestaurada = personasEliminadas.splice(indexSeleccionado, 1)[0];
      personas.push(personaRestaurada);
      personasGuardadasLocal(personas);
      guardarPersonasEliminadasEnLocalStorage(personasEliminadas);

      mostrarPersonas();
      mostrarListadoEliminados();

      Toastify({
        text: "Persona restaurada correctamente.",
        duration: 3000,
        close: true,
        gravity: "bottom",
        position: "left",
        stopOnFocus: true,
        backgroundColor: "#5EC27E"
      }).showToast();
    }
  });

  document.getElementById("cerrar-listado-btn").addEventListener("click", function () {
    listadoEliminadosDiv.style.display = "none";
  });
}

document.getElementById("eliminar-todas-personas-btn").addEventListener("click", confirmarEliminarTodasLasPersonas);

function confirmarEliminarTodasLasPersonas() {
  Swal.fire({
    icon: 'warning',
    text: '¿Estás seguro de que deseas eliminar todas las personas?',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#5EC27E',
    cancelButtonColor: '#FE0054',
    reverseButtons: true,
    background: "#FFFFFF",
    showClass: {
      popup: 'animate__animated animate__fadeIn'
    },
    hideClass: {
      popup: 'animate__animated animate__fadeOut'
    }
  }).then((result) => {
    if (result.isConfirmed) {
      eliminarTodasLasPersonasConfirmado();
    }
  });
}

function eliminarTodasLasPersonasConfirmado() {
  let mensajeDiv = document.getElementById("mensaje");

  if (personas.length > 0) {
    personasEliminadas = personasEliminadas.concat(personas);
    personas = [];
    personasGuardadasLocal(personas);
    guardarPersonasEliminadasEnLocalStorage(personasEliminadas);
    mostrarPersonas();

    Toastify({
      text: "Todas las personas han sido eliminadas correctamente.",
      duration: 3000,
      close: true,
      gravity: "bottom",
      position: "left",
      stopOnFocus: true,
      backgroundColor: "#5EC27E"
    }).showToast();
  } else {

    Toastify({
      text: "La lista de personas ya está vacía.",
      duration: 3000,
      close: true,
      gravity: "bottom",
      position: "left",
      stopOnFocus: true,
      backgroundColor: "#FE0054"
    }).showToast();
  }
}

function cargarPersonasDesdeServidor() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const datosSimulados = [
        new Persona("Juan", 30),
        new Persona("María", 25),
        new Persona("Luis", 28)
      ];
      resolve(datosSimulados);
    }, 2000);
  });
}

function mostrarToast(mensaje, tipo) {
  Toastify({
    text: mensaje,
    duration: 3000,
    close: true,
    gravity: "bottom",
    position: "left",
    backgroundColor: "#5EC27E",
  }).showToast();
}

function cargarPersonasDesdeServidorYActualizarUI() {
  if (localStorage.getItem("datosCargados") === "true") {
    cargarPersonasLocal();
  } else {
    cargarPersonasDesdeServidor()
      .then(personasCargadas => {
        if (personasCargadas.length > 0) {
          personas = personasCargadas;
          mostrarPersonas();
          localStorage.setItem("datosCargados", "true");
          mostrarToast("Datos cargados exitosamente", "success");
        }
      })
  }
}

cargarPersonasDesdeServidorYActualizarUI();

document.getElementById("toggle-listado-btn").addEventListener("click", () => {
  toggleListado();
});

function toggleListado() {
  const listadoDiv = document.getElementById("resultado");
  if (listadoDiv.style.display === "none" || listadoDiv.style.display === "") {
    listadoDiv.style.display = "block";
  } else {
    listadoDiv.style.display = "none"; 
  }
}

document.getElementById("mostrar-todas-btn").addEventListener("click", mostrarTodasLasPersonas);

function mostrarTodasLasPersonas() {
  mostrarPersonas();
  
  Toastify({
    text: "Todo el listado descubierto.",
    duration: 3000,
    close: true,
    gravity: "bottom",
    position: "left",
    stopOnFocus: true,
    backgroundColor: "#5EC27E"
  }).showToast();
}

document.getElementById("mostrar-btn").addEventListener("click", function() {
  localStorage.setItem("botonClickeado", "true");
  document.querySelector(".container").style.display = "block";
  document.getElementById("mostrar-contenido").style.display = "none";
});
document.addEventListener("DOMContentLoaded", function() {
  if (localStorage.getItem("botonClickeado") === "true") {
    document.getElementById("mostrar-btn").style.display = "none";
    document.querySelector(".container").style.display = "block";
  }
});

function actualizarReloj() {
  const reloj = document.getElementById('reloj');
  const horaSpan = document.getElementById('hora');
  const minutosSpan = document.getElementById('minutos');
  const segundosSpan = document.getElementById('segundos');
  const ahora = new Date();
  const hora = ahora.getHours().toString().padStart(2, '0');
  const minutos = ahora.getMinutes().toString().padStart(2, '0');
  const segundos = ahora.getSeconds().toString().padStart(2, '0');

  horaSpan.textContent = hora;
  minutosSpan.textContent = minutos;
  segundosSpan.textContent = segundos;
}

setInterval(actualizarReloj, 1000);

actualizarReloj();