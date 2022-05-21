/*	Ignacio Portas  (259779)		*/
/*	Franco Piriz    (269387)		*/

window.addEventListener("load", inicio);

let sistema = new Sistema();

function inicio() {
    document.getElementById("idLiSeries").addEventListener("click", mostrarSeries);
    document.getElementById("idLiOpiniones").addEventListener("click", mostrarOpiniones);
    document.getElementById("idLiEstadisticas").addEventListener("click", mostrarEstadisticas);
    document.getElementById("idAgregarSerie").addEventListener("click", agregarModificarSeries);
    document.getElementById("idLogoImdb").addEventListener("click", abrirBuscarPagina);
    document.getElementById("idPrevio").addEventListener("click", previoSerie);
    document.getElementById("idSiguiente").addEventListener("click", siguienteSerie);
    document.getElementById("idAgregarOpinion").addEventListener("click", agregarOpinion);
    document.getElementById("idSerieOpiniones").addEventListener("change", cargarOpiniones);
    document.getElementById("idReset").addEventListener("click", resetOpiniones);
    document.getElementById("idNombreSerie").addEventListener("click", infoDetalladaNombre);
    document.getElementById("idCantMegusta").addEventListener("click", infoDetalladaOpiniones);
}
function mostrarSeries() {
    mostrar("idSeries");
    ocultar("idOpiniones");
    ocultar("idEstadisticas");
    sistema.ordenarPorNombre();
}
function mostrarOpiniones() {
    ocultar("idSeries");
    mostrar("idOpiniones");
    ocultar("idEstadisticas");
}
function mostrarEstadisticas() {
    ocultar("idSeries");
    ocultar("idOpiniones");
    mostrar("idEstadisticas");
    agregarEnLista("idSeriesSinOpiniones", sistema.seriesSinOpiniones());
    agregarEnLista("idSeriesTop3", sistema.top3deSeries());
    if (sistema.listadoSeries.length > 0) {
        actualizarTablaEstadisticas();
    }
}
function mostrar(id) {
    document.getElementById(id).style.display = "block";
}
function ocultar(id) {
    document.getElementById(id).style.display = "none";
}
function agregarModificarSeries() {
    if(formValido("idFormSeries")){
        let nombreSerie = document.getElementById("idNombre").value;
        let descripcion = document.getElementById("idDescripcion").value;
        let temporadas  = parseInt(document.getElementById("idTemporadas").value);
        let capitulos   = parseInt(document.getElementById("idCapitulos").value);
        let serie       = new Serie(nombreSerie, descripcion, temporadas, capitulos);
        sistema.agregarModificarSeries(serie);
        limpiarForm("idFormSeries");
        actualizarSeriesOpiniones();
        
    }

}
function abrirBuscarPagina() {
    let nombre = document.getElementById("idNombre").value;
    let link   = "https://www.imdb.com/";
    if (nombre != "") {
        link += "/find?q=" + nombre;
    }
    window.open(link,"_blank");
}
function limpiarForm (id) {
    document.getElementById(id).reset();
}
function formValido(id) {
    return document.getElementById(id).reportValidity();
}
function previoSerie() {
    if (sistema.existenSeries()) {
        let nombreSerie = document.getElementById("idNombre").value;
        let serieAnterior = sistema.previo(nombreSerie);
        mostrarSerieEnFormulario(serieAnterior);
    }
    else {
        alert ("No hay datos ingresados");
    }

}
function siguienteSerie() {
    if (sistema.existenSeries()) {
        let nombreSerie = document.getElementById("idNombre").value;
        let serieSiguiente = sistema.siguiente(nombreSerie);
        mostrarSerieEnFormulario(serieSiguiente);
    }
    else {
        alert ("No hay datos ingresados");
    }
}
function mostrarSerieEnFormulario(serie) {
    document.getElementById("idNombre").value       = serie.nombre;
    document.getElementById("idDescripcion").value  = serie.descripcion;
    document.getElementById("idTemporadas").value   = serie.temporadas;
    document.getElementById("idCapitulos").value    = serie.capitulos;
}
function actualizarSeriesOpiniones(){ // actualiza opciones del select de opiniones
    let select = document.getElementById("idSerieOpiniones");
    select.innerHTML = "";
    let option = document.createElement("option");
    option.innerHTML = "elija una serie";
    select.appendChild(option);

    for(let i=0; i < sistema.listadoSeries.length; i++) {
        let option = document.createElement("option");
        option.innerHTML = sistema.listadoSeries[i].nombre;
        select.appendChild(option);
    }
    limpiarLista("idListaOpiniones");
}
function agregarOpinion() {
    if (sistema.existenSeries() && formValido("idFormOpiniones")) {
        let serie       = document.getElementById("idSerieOpiniones").value;
        let temporada   = parseInt(document.getElementById("idTemporadaOpiniones").value);
        let capitulo    = parseInt(document.getElementById("idCapituloOpiniones").value);
        let puntaje     = parseInt(document.getElementById("idPuntaje").value);
        let comentario  = document.getElementById("idCometario").value;

        let opinion = new Opiniones(temporada,capitulo,puntaje,comentario);
        let serieActual = sistema.darSerie(serie);

        serieActual.agregarAtualizarOpinion(opinion);
        agregarEnLista("idListaOpiniones",serieActual.opiniones);
        limpiarForm("idFormOpiniones");
        document.getElementById("idSerieOpiniones").value = serie;
    }
}
function agregarEnLista(id,array) {
    limpiarLista(id);

    for (let elem of array) {
        let li = document.createElement("li");
        let nodoTexto = document.createTextNode(elem.toString());
        li.appendChild(nodoTexto);
        document.getElementById(id).appendChild(li);
    }
}
function cargarOpiniones() {
    let serie = document.getElementById("idSerieOpiniones").value;
    if (serie != "elija una serie") {
        let serieActual = sistema.darSerie(serie);
        document.getElementById("idTemporadaOpiniones").setAttribute("max", serieActual.temporadas)
        document.getElementById("idCapituloOpiniones").setAttribute("max", serieActual.capitulos)
        agregarEnLista("idListaOpiniones",serieActual.opiniones);
    }
    else {
        limpiarLista("idListaOpiniones");
    }
}
function limpiarLista(id) {
    let lista = document.getElementById(id);
    lista.innerHTML = "";
}
function resetOpiniones() {
    limpiarLista("idListaOpiniones");
}
function ordenElejido(){
    let seleccion = document.getElementsByName("Orden");
    let pos = -1;
    for (let i = 0; i < seleccion.length; i++) {
        if (seleccion[i].checked) {
            pos = i;
        }
    }
    return seleccion[pos].value;
}
function infoDetalladaNombre() {
    sistema.ordenarPorNombre();
    let id = "idTablaInfoDetallada";
    limpiarTabla(id);
    for (let serie of sistema.listadoSeries) {
        mostrarEnTabla("idTablaInfoDetallada", serie);
    }  
}
function infoDetalladaOpiniones() {
    sistema.ordenarPorOpiniones();
    let id = "idTablaInfoDetallada";
    limpiarTabla(id);
    for (let serie of sistema.listadoSeries) {
        mostrarEnTabla(id, serie);
    }
}
function limpiarTabla(id) {
    let tabla = document.getElementById(id);
    tabla.textContent = "";
}
function mostrarEnTabla (id,dato) {
    let tabla = document.getElementById(id);
    let fila = tabla.insertRow();

    let celda = fila.insertCell();
    celda.textContent = dato.nombre;

    let celda2 = fila.insertCell();
    celda2.textContent = dato.cantidadOpiniones();

    let celda3 = fila.insertCell();
    celda3.textContent = dato.promedio();
}
function actualizarTablaEstadisticas() {
    if (ordenElejido() === "nombre_serie") {
        infoDetalladaNombre();
    }
    else {
        infoDetalladaOpiniones();
    }
}