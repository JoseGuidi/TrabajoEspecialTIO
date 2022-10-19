"use strict"

const url = "https://62b6205442c6473c4b3feea0.mockapi.io/api/v1/datos";
let tbody = document.querySelector("#cuerpo-tabla");
document.addEventListener("DOMContentLoaded", function () { mostrarTabla(1) });
let btnAgregar = document.querySelector("#boton-agregar").addEventListener("click", agregarFila);
let btnTres = document.querySelector("#boton-tres").addEventListener("click", agregarTresFila);
let btnFiltrar = document.querySelector("#boton-filtrar").addEventListener("click", filtrarTabla);
let btnAnterior = document.querySelector("#anterior").addEventListener("click", function () { paginarTabla(-1) }); 
let btnSiguiente = document.querySelector("#siguiente").addEventListener("click", function () { paginarTabla(1) });
let pagina = 1; // empieza con valor 1 pero va cambiando, se usa en paginarTabla();

async function mostrarTabla(pagina) {
    try {
        tbody.innerHTML = "";
        let response = await fetch(url + "?page=" + pagina + "&limit=5"); //pagina indica en la pag que estoy
        if (response.ok) {
            let datos = await response.json();
            for (let pos of datos) {
                let palabraTandil = pos.localidad.toLowerCase();
                if (palabraTandil == "tandil") { //si la localidad es "tandil" si resalta la fila
                    tbody.innerHTML += `<tr class="filatandil"><td>${pos.carrera}</td><td>${pos.universidad}</td><td>${pos.localidad}</td><td>${pos.duracion}</td><td><button class="boton-borrar" data-id='${pos.id}'>Borrar</button></td><td><button class="boton-editar" data-id='${pos.id}'>Editar</button></td></tr>`
                } else {
                    tbody.innerHTML += `<tr><td>${pos.carrera}</td><td>${pos.universidad}</td><td>${pos.localidad}</td><td>${pos.duracion}</td><td><button class="boton-borrar" data-id='${pos.id}'>Borrar</button></td><td><button class="boton-editar" data-id='${pos.id}'>Editar</button></td></tr>`
                }
            }
            document.querySelectorAll(".boton-borrar").forEach(button => { //Asigna evento de Click a cada botón con clase boton borrar
                button.addEventListener("click", function () { eliminarFila(button.dataset.id) });
            });
            document.querySelectorAll(".boton-editar").forEach(button => { //Asigna evento de Click a cada botón con clase boton editar
                button.addEventListener("click", function () { editarFila(button.dataset.id) });
            });
        } else {
            tbody.innerHTML = "Url erronea";
        }
    }
    catch (error) {
        tbody.innerHTML = error;
    }
}

async function paginarTabla(accion) { // Tiene que ser funcion async ya que voy a recibir una promesa para saber la cantidad de paginas que hay
    try {                             // Solamente disponible cuando el filtrar es todas
        document.querySelector("#contenedor-botonera-paginar").classList.remove("botonera-inhabilitada"); // Vuelve a aparecer la botonera
        if (accion == -1) {
            if (pagina > 1) {
                pagina = pagina - 1;
            }
        } else {
            let cantidadPaginas = await calcularPaginasTotales(); // llamo a otra funcion async para obtener length
            if (pagina < cantidadPaginas) {
                pagina = pagina + 1;
            }
        }
        mostrarTabla(pagina); // actualizo tabla
    } catch (error) {
        tbody.innerHTML = error;
    }
}
async function calcularPaginasTotales() {
    try {
        let response = await fetch(url);
        if (response.ok) {
            let datos = await response.json();
            return Math.ceil(datos.length / 5);   //obtengo tamaño de arreglo, divido por 5 ya que se muestran 5 por pagina y con math ceil aproximo hacia arriba
        } else {
            tbody.innerHTML = "Url erronea";
        }
    } catch (error) {
        tbody.innerHTML = error;
    }
}

async function agregarFila(e) {
    try {
        e.preventDefault();

        let car = document.querySelector("#carrera").value;
        let uni = document.querySelector("#universidad").value;
        let loc = document.querySelector("#localidad").value;
        let dur = document.querySelector("#duracion").value;
        let objeto = {
            "carrera": car,
            "universidad": uni,
            "localidad": loc,
            "duracion": dur
        };
        let response = await fetch(url, {
            "method": "POST",
            "headers": { "Content-Type": "application/JSON" },
            "body": JSON.stringify(objeto)
        });
        if (response.ok) {
            paginarTabla()
        } else {
            tbody.innerHTML = "Url erronea";
        }
    }
    catch (error) {
        tbody.innerHTML = error;
    }
}

async function eliminarFila(id) { //borra la fila
    try {
        let response = await fetch(`${url}/${id}`, {
            "method": "DELETE"
        })
        if (response.ok) {
            paginarTabla()
        } else {
            tbody.innerHTML = "Url erronea";
        }
    }
    catch (e) {
        tbody.innerHTML = "Error al ingresar dato";
    }
}

async function editarFila(id) { //editamos una fila especifica
    try {
        let car = document.querySelector("#carrera").value;
        let uni = document.querySelector("#universidad").value;
        let loc = document.querySelector("#localidad").value;
        let dur = document.querySelector("#duracion").value;
        let objeto = {
            "carrera": car,
            "universidad": uni,
            "localidad": loc,
            "duracion": dur
        };
        let response = await fetch(`${url}/${id}`, {
            "method": "PUT",
            "headers": { "Content-Type": "application/JSON" },
            "body": JSON.stringify(objeto)
        });
        if (response.ok) {
            paginarTabla()
        } else {
            tbody.innerHTML = "Url erronea";
        }
    }
    catch (error) {
        tbody.innerHTML = error;
    }
}

async function agregarTresFila(e) {
    try {
        e.preventDefault();
        let car = "--";
        let uni = "--";
        let loc = "--";
        let dur = "--";
        let objeto = {
            "carrera": car,
            "universidad": uni,
            "localidad": loc,
            "duracion": dur
        };
        for (let i = 0; i < 3; i++) {
            let response = await fetch(url, {
                "method": "POST",
                "headers": { "Content-Type": "application/JSON" },
                "body": JSON.stringify(objeto)
            });
            if (response.ok) {
                paginarTabla()
            } else {
                tbody.innerHTML = "Url erronea";
            }
        }
    }
    catch (error) {
        tbody.innerHTML = error;
    }
}

function filtrarTabla() {
    let select = document.querySelector("#eleccionFiltrar").value;
    if (select == "todas") {
        paginarTabla();
    } else if (select == "tandil") {
        mostrarTablaFiltrada(select)
        document.querySelector("#contenedor-botonera-paginar").classList.add("botonera-inhabilitada");
    } else if (select == "olavarria") {
        mostrarTablaFiltrada(select)
        document.querySelector("#contenedor-botonera-paginar").classList.add("botonera-inhabilitada");
    } else if (select == "azul") {
        mostrarTablaFiltrada(select)
        document.querySelector("#contenedor-botonera-paginar").classList.add("botonera-inhabilitada");
    }
}
async function mostrarTablaFiltrada(eleccion) {
    try {
        tbody.innerHTML = "";
        let response = await fetch(url);
        if (response.ok) {
            let datos = await response.json();
            for (let pos of datos) {
                if (eleccion == pos.localidad.toLowerCase()) {
                    tbody.innerHTML += `<tr><td>${pos.carrera}</td><td>${pos.universidad}</td><td>${pos.localidad}</td><td>${pos.duracion}</td><td><button class="boton-borrar" data-id='${pos.id}'>Borrar</button></td><td><button class="boton-editar" data-id='${pos.id}'>Editar</button></td></tr>`
                } else {
                    tbody.innerHTML += `<tr class="ocultarfila"><td>${pos.carrera}</td><td>${pos.universidad}</td><td>${pos.localidad}</td><td>${pos.duracion}</td><td><button class="boton-borrar" data-id='${pos.id}'>Borrar</button></td><td><button class="boton-editar" data-id='${pos.id}'>Editar</button></td></tr>`
                }
            }
            document.querySelectorAll(".boton-borrar").forEach(button => { //Asigna evento de Click a cada botón con clase boton borrar
                button.addEventListener("click", function () { eliminarFila(button.dataset.id) });
            });
            document.querySelectorAll(".boton-editar").forEach(button => { //Asigna evento de Click a cada botón con clase boton editar
                button.addEventListener("click", function () { editarFila(button.dataset.id) });
            });
        } else {
            tbody.innerHTML = "Url erronea";
        }
    } catch (error) {
        tbody.innerHTML = error;
    }
}





