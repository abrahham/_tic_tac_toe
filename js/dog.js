class Juego {    
    constructor(ficha) {
        this.ficha = ficha;
        this.fichaContraria = (this.ficha === 'x') ? 'o' : 'x';
        this.restablecer();
        this.numeroPartidasJugadas = 0;
        this.movsGanadores = [
            {pini : 0, pmed: 1, pfin: 2},
            {pini : 0, pmed: 4, pfin: 8},
            {pini : 0, pmed: 3, pfin: 6},        
            {pini : 1, pmed: 4, pfin: 7},
            {pini : 2, pmed: 4, pfin: 6},
            {pini : 2, pmed: 5, pfin: 8},
            {pini : 3, pmed: 4, pfin: 5},
            {pini : 6, pmed: 7, pfin: 8},
        ];
        this.victorias = {
            enemigo: 0, jugador: 0
        }
    }
    obtenerNumeroDeTiros() {
        var arre = this.tablero.filter(function (x) { return x != "*"; });
        return arre.length;
    }
    restablecer() {
        this.tablero = new Array(9).fill("*");
        this.juegoFinalizado = false;
        document.querySelectorAll("#juego-botones button").forEach(
            boton => {
                boton.classList.remove("b-circulo","b-cruz");
                boton.disabled = false;
            }
        );
        this.textoJuego("");        
    }
    tirar(e, posicion) {
        this.tablero[posicion] = this.ficha;
        e.disabled = true;
        this.validarVictoria(this.ficha);
    }
    tiroEnemigo() {
        document.querySelector("#mensaje-turno").innerText = "Mi turno pequeño humano";
        setTimeout(() => {
            var posicion = this.obtenerTiro();
            var boton = document.querySelectorAll("#panel-juego .btn")[posicion];
            this.tablero[posicion] = this.fichaContraria;
            boton.classList.add((this.fichaContraria == 'o') ? "b-circulo" : "b-cruz");
            boton.disabled = true;
            this.validarVictoria(this.fichaContraria);
            document.querySelector("#mensaje-turno").innerText = "Tu turno";
        }, 600);
    }
    /* métodos viejos */
    estaDisponible(posicion) {
        /* Verifica si la posicion recibida está ocupada por una ficha */
        return this.tablero[posicion] == "*";
    }
    obtenerTiro() {        
        var arreglo = (this.tiroOfensivo().length > 0) ? this.tiroOfensivo() : this.tiroDefensivo();
        if(arreglo.length == 0) arreglo = this.posibleJugada(this.fichaContraria);
        if(arreglo.length == 0) arreglo = this.posibleJugada(this.ficha);
        if(arreglo.length == 0) arreglo = this.obtenerPosicionesDisponibles(this.tablero);               
        var x = Math.floor(Math.random() * arreglo.length);        
        var tiro = (arreglo.includes(4)) ? 4 : arreglo[x];  //areglar, analizar casos para el uso del centro
        return tiro;
    }  
    obtenerPosicionesDisponibles(arreglo) {
        /* Retorna un arreglo con todas las posiciones libres */
        var arre = arreglo.reduce( (arre,reg,idx) => {
            if(reg === "*") arre.push(idx);
            return arre;
        },[])
        return arre;
    }
    posibleJugada(ficha) {
        var arreglo = this.movsGanadores.reduce((arre, reg, idx) => {  
            if(this.tablero[reg.pini] == ficha && this.estaDisponible(reg.pmed) && this.estaDisponible(reg.pfin)) {
                arre.push(reg.pmed);
                arre.push(reg.pfin);
            }
            if(this.tablero[reg.pmed] == ficha && this.estaDisponible(reg.pini) && this.estaDisponible(reg.pfin)) {
                arre.push(reg.pini);
                arre.push(reg.pfin);
            }             
            if(this.tablero[reg.pfin] == ficha && this.estaDisponible(reg.pmed)  && this.estaDisponible(reg.pini))  {
                arre.push(reg.pmed);
                arre.push(reg.pini);
            }         
            return arre;
        },[])
        return arreglo;
    }
    posicionesDeTiroGanador(ficha) {
        var arreglo = this.movsGanadores.reduce((arre, reg, idx) => {  
           var tiro;      
           if(this.tablero[reg.pini] == ficha && this.tablero[reg.pmed] == ficha && this.tablero[reg.pfin] != ficha)
               tiro = reg.pfin;
           if(this.tablero[reg.pini] == ficha && this.tablero[reg.pmed] != ficha && this.tablero[reg.pfin] == ficha)  
               tiro = reg.pmed;
           if(this.tablero[reg.pini] != ficha && this.tablero[reg.pmed] == ficha && this.tablero[reg.pfin] == ficha)  
               tiro = reg.pini;
           if(this.estaDisponible(tiro))
               arre.push(tiro);        
           return arre;
       },[])
       return arreglo;
    }
    tiroDefensivo() {
       return this.posicionesDeTiroGanador(this.ficha);
    }
    tiroOfensivo() {
       return this.posicionesDeTiroGanador(this.fichaContraria);
    }
    bloquearTablero() {
        document.querySelectorAll("#juego-botones button").forEach(boton => boton.disabled = true);
    }
    textoJuego(mensaje) {
        document.querySelector("#mensaje-turno").innerText = mensaje;
    }
    validarVictoria(ficha) {
        /* Verificar si uno de los participantes ha hecho un cruce ganador */
        var paneles = document.querySelectorAll("#juego-resultado > div");
        this.movsGanadores.forEach(fila => {
            if(this.tablero[fila.pini] == ficha && this.tablero[fila.pmed] == ficha && this.tablero[fila.pfin] == ficha)
            {                
                if(ficha == this.ficha){
                    this.textoJuego("Haz ganado :(");
                    this.victorias.jugador += 1;
                    paneles[this.numeroPartidasJugadas].classList.add((this.ficha== 'o')  ? "b-circulo" : "b-cruz");
                } else {
                    this.textoJuego("He ganado ;)");
                    this.victorias.enemigo += 1;
                    paneles[this.numeroPartidasJugadas].classList.add((this.fichaContraria == 'o')  ? "b-circulo" : "b-cruz");
                }
                this.juegoFinalizado = true;
                this.bloquearTablero();                
            }
        })
        if(this.obtenerNumeroDeTiros() == 9) {
        
        }
    }
}
var juego;
var ficha;
function iniciarPartida() {
    juego = new Juego(ficha);
    var panelSeleccion = document.querySelector("#panel-inicio");
    var panelJuego = document.querySelector("#panel-juego");
    panelSeleccion.style.display = 'none';
    panelJuego.style.display = 'block';
    juego.restablecer();
}
function irAInicio() {
    var panelSeleccion = document.querySelector("#panel-inicio");
    var panelJuego = document.querySelector("#panel-juego");
    panelSeleccion.style.display = 'flex';
    panelJuego.style.display = 'none';
    document.querySelectorAll("#panel-inicio .btn").forEach(
        boton => boton.style.backgroundColor = 'transparent'
    );
}
function elegirFicha(e) {
    document.querySelectorAll("#panel-inicio .btn").forEach(boton => boton.style.backgroundColor = 'transparent'); 
    ficha = e.classList.contains("b-circulo") ? 'o' : 'x';
    e.style.backgroundColor = "red";
}
function tirar(e, posicion) {
    juego.tirar(e, posicion);
    if(juego.obtenerNumeroDeTiros() < 9 && !juego.juegoFinalizado) juego.tiroEnemigo();
    e.classList.add((juego.ficha == 'o') ? "b-circulo" : "b-cruz");
}
function resetear() {
    if(!juego.juegoFinalizado) {
        var paneles = document.querySelectorAll("#juego-resultado > div");
        paneles[juego.numeroPartidasJugadas].classList.add("b-cancelado");
    }
    juego.restablecer();
    juego.numeroPartidasJugadas += 1;     
}