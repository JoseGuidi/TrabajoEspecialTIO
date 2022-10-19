"use strict"
/* captcha */
let form = document.querySelector("#form-captcha").addEventListener("submit",mostrarCaptcha);
let btnverificar = document.querySelector("#boton-verificar").addEventListener("click",comprobarCaptcha);
let textoaleatorio = document.querySelector("#numeroaleatorio");
let textoresultado = document.querySelector("#resultado-captcha");
let numeroaleatorio;
function mostrarCaptcha(e){
    e.preventDefault();
    document.querySelector("#captcha-oculto").classList.add("captcha-mostrar");
    textoaleatorio.innerHTML="Ingrese el siguiente numero:  " + generarNumero() ;
}
function generarNumero(){
    numeroaleatorio = Math.floor(Math.random()*605813);
    return numeroaleatorio;
}
function comprobarCaptcha(){
    let entrada = document.querySelector("#input-captcha").value;
    if (entrada == numeroaleatorio) {   
        setTimeout(ocultarCaptcha,0) // Se ejecuta la funcion al instante
    }else{
        textoresultado.innerHTML="Numero erroneo, intente de nuevo";
        textoaleatorio.innerHTML = "Ingrese el siguiente numero:  " + generarNumero() ;
    }
}

function ocultarCaptcha(){
    let i=5;
    let intervalo = setInterval(function() {    // cada 1 segundo se va a ejecutar lo siguiente,actualizando el contador
        textoresultado.innerHTML= "Numero correcto, espere "+i+" segundos";
            if (i === 0) {
                clearInterval(intervalo); 
                document.querySelector("#captcha-oculto").classList.remove("captcha-mostrar");
                location.reload();
            }
            else {
                i--;
            }
        }, 1000);
}
