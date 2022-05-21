/*	Ignacio Portas  (259779)		*/
/*	Franco Piriz    (269387)		*/

class Sistema {
    constructor() {
        this.listadoSeries = [];
    }
    agregarModificarSeries(serie){
        let nombre = serie.nombre.toUpperCase();
        let existeSerie = false;
        for (let i = 0; i < this.listadoSeries.length; i++) {
            if (nombre === this.listadoSeries[i].nombre.toUpperCase()) {
                //actualiza serie
                existeSerie = true;
                this.listadoSeries[i].descripcion = serie.descripcion;
                this.listadoSeries[i].capitulos = serie.capitulos;
                this.listadoSeries[i].temporadas = serie.temporadas;
            }
        }
        if (!existeSerie) {         //agrega y ordena la serie
            this.listadoSeries.push(serie);
            this.ordenarPorNombre();
        }
    }
    previo (nombre) {
        let index = this.posicionSerie(nombre);  // posicion de la serie actual
        if (index === -1 || index === 0) { 
            // si es la primera o no existe devuelve la ultima posicion
            return this.listadoSeries[this.listadoSeries.length-1];
        }
        else {
            return this.listadoSeries[index - 1];
        }
    }
    siguiente (nombre) {
        let index = this.posicionSerie(nombre);  
        if (index === -1 || index === this.listadoSeries.length-1) {
            // si es la ultima o no existe devuelve la primer posicion
            return this.listadoSeries[0];
        }   
        else {
            return this.listadoSeries[index + 1];
        }                                     
    }
    posicionSerie (nombre) { 
        let posicion = -1;
        let estaNombre = false;
        for (let i = 0; i < this.listadoSeries.length && !estaNombre; i++) {
            if (nombre.toUpperCase() === this.listadoSeries[i].nombre.toUpperCase()) {
                estaNombre = true;
                posicion = i;
            }
        }
        return posicion;
    }
    existenSeries () {
        let existen = false;
        if (this.listadoSeries.length != 0) {
            existen = true;
        }
        return existen;
    }
    darSerie(serie) { // dado un nombre devuelve un objeto Serie
        let res = {};
        for (let i = 0; i < this.listadoSeries.length; i++) {
            if (this.listadoSeries[i].nombre === serie) {
                res = this.listadoSeries[i];
            }
        }
        return res;
    }
    agregarOpinion (serie,opinion) { // dado un objeto serie y opinion, los vincula
        for (let elem of this.listadoSeries) {
            if (elem.nombre.toUpperCase() === serie.nombre.toUpperCase()) {
                elem.agregarAtualizarOpinion(opinion);
            }
        }
    }
    seriesSinOpiniones(){ // devuelve un array con las series sin opiniones
        let res = [];
        for (let elem of this.listadoSeries) {
            if (elem.opiniones.length === 0) {
                res.push(elem);
            }
        }
        if (res.length === 0) {
            res.push("Sin datos");
        }
        return res;
    }
    top3deSeries(){ // devuelve un array con el top 3
        let res = [];
        this.ordenarPorOpiniones();
        for (let i = 0; i < this.listadoSeries.length && i < 3; i++) {
            if (this.listadoSeries[i].cantidadOpiniones() > 0) {
                res.push(this.listadoSeries[i]);
            }
        }
        if (res.length === 0) {
            res.push("Sin datos");
        }
        return res;
    }
    ordenarPorOpiniones (){
        let res = this.listadoSeries;
        res.sort(function (a, b) { return b.opiniones.length - a.opiniones.length});
        return res;
    }
    ordenarPorNombre () {
        let res = this.listadoSeries;
        res.sort(function (a, b) { 
            if (a.nombre.toUpperCase() < b.nombre.toUpperCase()) {
              return -1;
            }
            if (a.nombre > b.nombre) {
              return 1;
            }
            return 0;
          });
        return res;
    }
}
class Serie {
    constructor(nombre, descripcion, cantidadTemporadas, cantidadCapitulos) {
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.temporadas = cantidadTemporadas;
        this.capitulos = cantidadCapitulos;
        this.opiniones = [];
    }
    toString(){
        let resultado = this.nombre + " - " + this.descripcion 
                    + " (Temporadas: " + this.temporadas 
                    + ", capitulos: " + this.capitulos + ")";
        return resultado;
    }
    agregarAtualizarOpinion(opinion){
        let existeOpinion = false;
        for (let i = 0; i < this.opiniones.length; i++) {
            let opinionActual = this.opiniones[i];
            if (opinionActual.temporada === opinion.temporada && opinionActual.capitulo === opinion.capitulo) {
                //actualiza opinion
                existeOpinion = true;
                this.opiniones[i].puntaje = opinion.puntaje;
                this.opiniones[i].opinion = opinion.opinion;
            }
        }
        if (!existeOpinion) {
            this.opiniones.push(opinion);
        }
        this.opiniones.sort(function (a, b) { 
            return a-b
          });
    }
    cantidadOpiniones(){ // calcula cantidad de opiniones de la serie
        return this.opiniones.length;
    }
    promedio(){
        let res = "";
        if (this.cantidadOpiniones() > 0) {
            let sumaPuntaje = 0;
            let promedio = 0;
            for (let elem of this.opiniones) {
                sumaPuntaje += elem.puntaje;
            }
            promedio = sumaPuntaje/this.cantidadOpiniones();
            res = parseInt(promedio.toFixed(0));
        }
        return res;
    }
}
class Opiniones {
    constructor(temporada, capitulo, puntaje, opinion) {
        this.temporada = temporada;
        this.capitulo = capitulo;
        this.puntaje = puntaje;
        this.opinion = opinion;
    }
    toString(){
        let resultado = "Temp: " + this.temporada + " Cap: " + this.capitulo + " Puntaje: " + this.puntaje + " " + this.opinion;
        return resultado;
    }
}