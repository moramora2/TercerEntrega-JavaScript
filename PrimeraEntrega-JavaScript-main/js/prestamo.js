// Declaro variables necesarias


let nombre;
let apellido;
let edad;
let email;
let valorVivienda;
let montoSolicitado;
let valorviviendaCalculada;
let montoConInteres;
let listaAnos=[];
let textoFinalUsuario;
let prestamos=[];


//clase prestamo que contiene los datos a guardar
class prestamo{
    constructor(valorVivienda, montoSolicitado, valorCuota, periodoPrestamo) {
        this.valorVivienda = valorVivienda;
        this.montoSolicitado = montoSolicitado;
        this.valorCuota = valorCuota;
        this.periodoPrestamo = periodoPrestamo;
    }

    toString() {
        return  "Valor de la cuota mensual: " +  this.valorCuota + " en " + this.periodoPrestamo + " años."
      }
}

// Se cargaran las variables desde un prompt, mas adelante se cargaran desde los controles html
function cargarVariables(){
    nombre = document.getElementById("nombre").value;
    apellido = document.getElementById("apellido").value;
    email =document.getElementById("email").value;
    edad = document.getElementById("edad").value;
    valorVivienda = document.getElementById("valor").value;
    montoSolicitado =  document.getElementById("monto").value;
    listaAnos = [];
    listaAnos.push(5);
    listaAnos.push(10);
    listaAnos.push(15);
    textoFinalUsuario ="";
}

//valido los datos
function validarDatos(){
    //valida el nombre
    if(validarTextoVacio(nombre) == true){
        mostrarMensaje("error","Dato incorrecto","Ingrese nombre");
        return false
    }

    //valida el apellido
    if(validarTextoVacio(apellido) == true){
        mostrarMensaje("error","Dato incorrecto","Ingrese apellido");
        return false
    }

    //valida la edad
    if (verificarNumerico(edad) == false || edad < 18 || edad >= 50 ) {
        mostrarMensaje("error","Dato incorrecto","Ingrese su edad");
        return false
    }

    //valida el email
    if(validarTextoVacio(email ) == true){
        mostrarMensaje("error","Dato incorrecto","Ingrese el correo");
        return false
    }


    //valida el valor de la vivienda
    if (verificarNumerico(valorVivienda) == false) {
        mostrarMensaje("error","Dato incorrecto","Ingrese el valor de la vivienda");
        return false
    }

    //valida el monto solicitado
    if (verificarNumerico(montoSolicitado) == false) {
        mostrarMensaje("error","Dato incorrecto","Ingrese el monto solicitado");
        return false
    }

    return true    
}


//retorna true si la variable de tipo texto esta vacia
function validarTextoVacio(tmp){
    if(tmp==""){
        return true
    }
}

//esto verifica que la variable de tipo numerica tenga algo cargado
function verificarNumerico(num){
    if (isNaN(num) || num=="") {
        return false
    } 
}

//verifico que el monto no supere el valor de la vivienda
function montoSuperior(solicitado, vivienda){
    if(solicitado > vivienda){
        return true
    }
}

//calculo el interes segun los anos del prestamo
function calculoRecargo(importe, anos){
    switch(anos){
        case 5:
            //10% recargo
            return importe * 1.1
        break
        case 10:
            //20% recargo
            return importe * 1.2
        break
        case 15:
            //30% recargo
            return importe * 1.3
        break
    }


}
function calcularPrestamo(){
    //llamo a las funciones
    //cargo las variables
    cargarVariables()

    //valido los datos
    if (validarDatos()){
        //el prestamo se otorga hasta en un 80% del valor total de la vivienda
        //ej: vivienda 1000, se presta solo 800
        //guardo en la variable el 80% 
        valorviviendaCalculada = valorVivienda * 0.8
    
        if(montoSuperior(montoSolicitado, valorviviendaCalculada)){
            mostrarMensaje("error","Dato incorrecto","El prestamo solicitado supera el límite");
        }
    
        //si llega acà es que tiene aprobado el prestamo
        else { 
            //vacio el array;
            prestamos = [];
            localStorage.removeItem("prestamos");

            //recorremos el objeto listaAnos para calcular el prestamo en sus diferentes opciones.
            for (let index = 0; index < listaAnos.length; index++) {
                montoConInteres = calculoRecargo(montoSolicitado, listaAnos[index]) 
                valorCuota = ((montoConInteres) / (listaAnos[index].toString() * 12)).toFixed(2).toString();
                periodoPrestamo = listaAnos[index].toString();
                textoFinalUsuario = textoFinalUsuario + "Valor de la cuota mensual: " +  valorCuota + " en " + periodoPrestamo + " años.";

                //guardo el prestamo en el storage
                guardarPrestamo(valorVivienda, montoSolicitado, valorCuota, periodoPrestamo);
            }
            
            //guardo en el storage
            let datosJson = JSON.stringify(prestamos);
            localStorage.setItem("prestamos", datosJson);
            
            //muestro el resultado con todas las opciones de los años posibles para financiar el prestamo
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: "Prestamo aceptado.\n",
                text: textoFinalUsuario,
                showConfirmButton: true,
                timer: 60000
              })

              //recupero prestamo guardado siempre que hay un ok en prestamos
              mostrarResultado(recuperarPrestamo());
        }
    }
}


function eliminarStorage(){
    localStorage.removeItem("prestamos");
    mostrarResultado(recuperarPrestamo());
}

//recupero prestamos guardados.
mostrarResultado(recuperarPrestamo());

//mostrar resultado
function mostrarResultado(resultado){
    document.getElementById("resultadoPrestamoSolicitado").innerHTML ="";
    document.getElementById("resultadoPrestamoValorVivienda").innerHTML ="";
    document.getElementById("resultadoPrestamo").innerHTML ="";

    if (resultado != null){
        //recorro el array resultado
        for (let index = 0; index < resultado.length; index++) {
            document.getElementById("resultadoPrestamo").innerHTML += "<br />" + resultado[index].toString();
        }
        document.getElementById("resultadoPrestamoSolicitado").innerHTML = "Monto Solicitado: " + resultado[0].montoSolicitado;
        document.getElementById("resultadoPrestamoValorVivienda").innerHTML = "Valor Vivienda: " + resultado[0].valorVivienda;
    }
}


//function para guardar prestamo en JSON
function guardarPrestamo(Vivienda, Solicitado, Cuota, periodo){
    //Creo variable de tipo prestamo con los datos
    let datos = new prestamo(Vivienda, Solicitado, Cuota, periodo);
    
    //agrego al array
    prestamos.push(datos);
}

//recuperar datos del storage
function recuperarPrestamo(){
    
    if (localStorage.getItem("prestamos") != null){
        let prestamoStorage = localStorage.getItem("prestamos");
        
        //paso del json al objeto
        let prestamoRecuperado = JSON.parse(prestamoStorage);
        let arrayTmp = [];
        
        //recorro el array para convertir lo recuperado en objetos de tipo "prestamo"
        //debe existir una forma mas simple AVERIGUAR
        for (let index = 0; index < prestamoRecuperado.length; index++) {
            let datos = new prestamo(prestamoRecuperado[index].valorVivienda, prestamoRecuperado[index].montoSolicitado, prestamoRecuperado[index].valorCuota, prestamoRecuperado[index].periodoPrestamo);
            arrayTmp.push (datos);
        }
        
        //muestro en la consola para ver si estoy recuperando bien
        //console.table(prestamoRecuperado);
        
        return arrayTmp;
    }else{
        //si no hay nada guardad retorno null
        return null;
    }
}

//Agrego el evento de calcular al boton.
let btnCalcular = document.getElementById("btnCalcular");
btnCalcular.addEventListener("click",calcularPrestamo);

//Creo funcion generica para mensajes
function mostrarMensaje(icono, titulo, texto){
    Swal.fire({
        icon: icono,
        title: titulo,
        text: texto
  })
}

