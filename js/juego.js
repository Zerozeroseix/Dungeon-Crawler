/***************************************************************************************
 *             SESIONES 21 y 22 + 30 + 31
 *              MAZMORRA (II) - LÓGICA DEL JUEGO + MUSICA & SONIDOS + GUARDAR PARTIDA
 * *************************************************************************************/
// VAR GLOBALES
var canvas;
var ctx; // contexto del CANVAS
var FPS = 50;
var protagonista; // o jogador protagonista (ver OBJ. JUGADOR)
var enemigo = []; // VAR ENEMIGO (como matriz) (ver OBJ ENEMIGO)
var imagenAntorcha;

var tileMap;

var musica;
var sonido1, sonido2, sonido3;



// ESCENARIO JUEGO
var anchoF = 50 // ancho da Cela ou Ficha
var altoF = 50 // alto da Cela ou Ficha

var muro = '#044f14';
var puerta = '#3a1700';
var tierra = '#c6892f';
var llave = '#c6bc00';

var escenario = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 2, 2, 0, 0, 0, 2, 2, 2, 2, 0, 0, 2, 2, 0],
  [0, 0, 2, 2, 2, 2, 2, 0, 0, 2, 0, 0, 2, 0, 0],
  [0, 0, 2, 0, 0, 0, 2, 2, 0, 2, 2, 2, 2, 0, 0],
  [0, 0, 2, 2, 2, 0, 0, 2, 0, 0, 0, 2, 0, 0, 0],
  [0, 2, 2, 0, 0, 0, 0, 2, 0, 0, 0, 2, 0, 0, 0],
  [0, 0, 2, 0, 0, 0, 2, 2, 2, 0, 0, 2, 2, 2, 0],
  [0, 2, 2, 2, 0, 0, 2, 0, 0, 0, 1, 0, 0, 2, 0],
  [0, 2, 2, 3, 0, 0, 2, 0, 0, 2, 2, 2, 2, 2, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
];
//***************************************************************************/
// Creación de objetos Howler (en howler.core.js) para MUSICA y EFECTOS DE SONIDO
musica = new Howl({
  src: ['music/fortaleza.mp3'],
  loop: true
});

sonido1 = new Howl({
  src: ['sound/fuego.wav'],
  loop: false
});

sonido2 = new Howl({
  src: ['sound/llave.wav'],
  loop: false
});

sonido3 = new Howl({
  src: ['sound/puerta.wav'],
  loop: false
});



// ********************************************************************/
// OBJETO ENEMIGO
var malo = function(x, y) {
  this.x = x;
  this.y = y;

  this.direccion = Math.floor(Math.random() * 4); // Direccion RANDOM-> 4 Valores= 0,1,2,3

  this.retraso = 50; // Como los enemigos se mueven 10xSegundo tenemos que ralentizarlos. El valor 50 hará que se muevan 1xSegundo
  this.contador = 0; // contador de *fotogramas* que irá de 0 a 50, esto es, al valor de "this.retraso".


  /*****METODOS OU FUNÇONS DE OBJECTO******/


  // Metodo LER coordenadas do inimigo
  this.getCoordenadas = function() {
    var coordenadas = [];
    coordenadas.push(this.x);
    coordenadas.push(this.y);


    return (coordenadas);
  };

  // Metodo ESTABELECER coordenadas do inimigo
  this.setCoordenadas = function(x, y) {
    if (this.compruebaColision() == true) {
      console.log('ERRO COLOCAÇOM!!!!!');

    } else {
      this.x = x;
      this.y = y;
    }
  };

  // METODO DIBUJA ENEMIGO
  this.dibuja = function() {
    ctx.drawImage(tileMap, 0, 32, 32, 32, this.x * anchoF, this.y * altoF, anchoF, altoF);
  }

  // METODO COMPROBAR COLISION
  this.compruebaColision = function(x, y) {
    var colisiona = false;
    if (escenario[y][x] == 0) {
      colisiona = true;
    }
    return colisiona;
  }

  //METODO MUEVE (comprobando si hay colision con la direccion aleatoria)
  this.mueve = function() {
    protagonista.colisionEnemigo(this.x, this.y); // os inimigos mandam os seus datos por parámetro à funçom colisionEnemigo()
    // Retrasa o movemento dos inimigos
    if (this.contador < this.retraso) {
      this.contador++;
    } else {
      this.contador = 0;

      // ARRIBA
      if (this.direccion == 0) {
        if (this.compruebaColision(this.x, this.y - 1) == false) {
          this.y--;
        } else {
          this.direccion = Math.floor(Math.random() * 4);
        }
      }

      // ABAJO
      if (this.direccion == 1) {
        if (this.compruebaColision(this.x, this.y + 1) == false) {
          this.y++;
        } else {
          this.direccion = Math.floor(Math.random() * 4);
        }
      }

      // IZQUIERDA
      if (this.direccion == 2) {
        if (this.compruebaColision(this.x - 1, this.y) == false) {
          this.x--;
        } else {
          this.direccion = Math.floor(Math.random() * 4);
        }
      }

      // DERECHA
      if (this.direccion == 3) {
        if (this.compruebaColision(this.x + 1, this.y) == false) {
          this.x++;
        } else {
          this.direccion = Math.floor(Math.random() * 4);
        }
      }
    }
  };
} // FIN CLASE malo

// OBJETO JUGADOR
var jugador = function() {
  this.x = 1;
  this.y = 1;
  this.color = '#820c01';
  this.llave = false;

  /*****METODOS OU FUNÇONS DE OBJECTO******/

  // Metodo LER coordenadas do jogador y comprobar si tiene la llave
  this.getCoordenadas = function() {
    var coordenadas = [];
    coordenadas.push(this.x);
    coordenadas.push(this.y);
    coordenadas.push(this.llave);

    return (coordenadas);
  };

  // Metodo ESTABELECER coordenadas do jogador
  this.setCoordenadas = function(x, y, llave) {
    this.x = x;
    this.y = y;
    this.llave = llave;
  };



  // METODO DIBUJA JUGADOR
  this.dibuja = function() {
    ctx.drawImage(tileMap, 32, 32, 32, 32, this.x * anchoF, this.y * altoF, anchoF, altoF);
    // ctx.fillStyle = this.color;
    // ctx.fillRect(this.x * anchoF, this.y * altoF, anchoF, altoF);
  };

  // METODO COLISION ENEMIGO
  // A lógica é a seguinte: o jogador comprova as suas coordenadas coas dos inimigos. Se hai coincidencia, o jogador PERDE.
  this.colisionEnemigo = function(x, y) {
    if (this.x == x && this.y == y) {
      console.log('MUERTO');
      this.muerte();
    }
  }

  //METODO CONTROL MARGENES


  this.margenes = function(x, y) {
    var colision = false;

    if (escenario[y][x] == 0) {
      colision = true;
    }
    return (colision);
  }

  // METODOS MOVIMENTO
  this.arriba = function() {
    if (this.margenes(this.x, this.y - 1) == false) {
      this.y--;
      this.logicaObjetos(); // Está a CHAVE?
    }
  }
  this.abajo = function() {
    if (this.margenes(this.x, this.y + 1) == false) {
      this.y++;
      this.logicaObjetos(); // Está a CHAVE?
    }

  }
  this.izquierda = function() {
    if (this.margenes(this.x - 1, this.y) == false) {
      this.x--;
      this.logicaObjetos(); // Está a CHAVE?
    }

  }
  this.derecha = function() {
    if (this.margenes(this.x + 1, this.y) == false) {
      this.x++;
      this.logicaObjetos(); // Está a CHAVE?
    }

  }

  // METODO RECOGER LLAVE
  this.logicaObjetos = function() {
    var objeto = escenario[this.y][this.x];
    // OBTIENE LLAVE
    if (objeto == 3) {
      this.llave = true;
      escenario[this.y][this.x] = 2;
      sonido2.play();
      console.log('Obtuviste la llave!!!');
    }
    if (objeto == 1) {  // comprova se podes abrir a porta (objecto valor=1)
      if (this.llave == true) {
        this.victoria();
      } else {
        console.log('TE FALTA LA LLAVE! NO PUEDES PASAR.');
      }
    }
  }
  // METODO ABRIR PUERTA Y REINICIAR
  this.victoria = function() {
    sonido3.play();
    console.log('GANASTE!!!!');
    this.y = 1;
    this.x = 1;
    this.llave = false;
    escenario[8][3] = 3; // recolocamos la llave
  }

  // METODO MUERTE POR ENEMIGO (en realidad aquí igual a Victoria)
  this.muerte = function() {
    sonido1.play();
    console.log('PERDISTE!!!!');
    this.y = 1;
    this.x = 1;
    this.llave = false;
    escenario[8][3] = 3; // recolocamos la llave
  }



} // FIN CLASE jugador

// OBJETO antorcha
var antorcha = function(x, y) {
  this.x = x;
  this.y = y;
  this.retraso = 10;
  this.contador = 0;
  this.fotograma = 0; // 0-3  Para ir alternando a image do facho e fazer umha animaçom

  this.cambiaFotograma = function() {
    if (this.fotograma < 3) {
      this.fotograma++
    } else {
      this.fotograma = 0;
    }
  }

  //metodo DIBUJA
  this.dibuja = function() {
    if (this.contador < this.retraso) {
      this.contador++;
    } else {
      this.contador = 0;
      this.cambiaFotograma();
    }
    ctx.drawImage(tileMap, this.fotograma * 32, 64, 32, 32, this.x * anchoF, this.y * altoF, anchoF, altoF);

  }

} // FIN CLASE antorcha



/***************************************************************************/

// FUNCIONES

function dibujaEscenario() {

  for (y = 0; y < 10; y++) {
    for (x = 0; x < 15; x++) {
      var tile = escenario[y][x];


      // ctx.fillStyle = color;
      // ctx.fillRect(x * anchoF, y * altoF, anchoF, altoF);

      ctx.drawImage(tileMap, tile * 32, 0, 32, 32, anchoF * x, altoF * y, anchoF, altoF);

      // Explicaçom: drawImage(image, valorCela*32 para situar o inicio do recorte no eixo X, 0 no eixo Y, dimensons de recorte image 32x32, posicion 50*valorX, posicion 50*valorY, dimensons recorte 50x50)
    }
  }
}


function guardarPartida() {
  var coordenadasJugador = [];
  var coordenadasEnemigo_0 = [];
  var coordenadasEnemigo_1 = [];
  var coordenadasEnemigo_2 = [];

  coordenadasJugador = protagonista.getCoordenadas();
  coordenadasEnemigo_0 = enemigo[0].getCoordenadas();
  coordenadasEnemigo_1 = enemigo[1].getCoordenadas();
  coordenadasEnemigo_2 = enemigo[2].getCoordenadas();

  localStorage.setItem("jx", coordenadasJugador[0]); // guarda X de jogador
  localStorage.setItem("jy", coordenadasJugador[1]); // guarda Y de jogador
  localStorage.setItem("jugadorLlave", coordenadasJugador[2]); // guarda info sobre "tiene llave?"" (true/false)

  localStorage.setItem("e0x", coordenadasEnemigo_0[0]); // guarda X de Enemigo_0
  localStorage.setItem("e0y", coordenadasEnemigo_0[1]); // guarda Y de Enemigo_0



  localStorage.setItem("e1x", coordenadasEnemigo_1[0]); // guarda X de Enemigo_1
  localStorage.setItem("e1y", coordenadasEnemigo_1[1]); // guarda Y de Enemigo_1

  localStorage.setItem("e2x", coordenadasEnemigo_2[0]); // guarda X de Enemigo_2
  localStorage.setItem("e2y", coordenadasEnemigo_2[1]); // guarda Y de Enemigo_2

  console.log('PARTIDA GUARDADA');
  console.log('tem a chave?: ' + coordenadasJugador[2]);
};

function cargarPartida() {
  var jx, jy, e0x, e0y, e1x, e1y, e2x, e2y;
  var jugadorLlave;

  jx = localStorage.getItem("jx"); // carga X de jogador
  jy = localStorage.getItem("jy"); // carga Y de jogador
  jugadorLlave = localStorage.getItem("jugadorLlave");

  e0x = localStorage.getItem("e0x"); // carga X de inimigo 0
  e0y = localStorage.getItem("e0y"); // carga Y de inimigo 0

  e1x = localStorage.getItem("e1x"); // carga X de inimigo 1
  e1y = localStorage.getItem("e1y"); // carga Y de inimigo 1

  e2x = localStorage.getItem("e2x"); // carga X de inimigo 2
  e2y = localStorage.getItem("e2y"); // carga Y de inimigo 2

  protagonista.setCoordenadas(jx, jy, jugadorLlave);
  enemigo[0].setCoordenadas(e0x, e0y);
  enemigo[1].setCoordenadas(e1x, e1y);
  enemigo[2].setCoordenadas(e2x, e2y);

  console.log('PARTIDA CARGADA');
  console.log('tem a chave?: ' + jugadorLlave);

};

function inicializa() {
  canvas = document.getElementById('canvas');
  ctx = canvas.getContext('2d');

  tileMap = new Image();
  tileMap.src = 'img/tilemap.png';


  // CREAMOS ENEMIGOS.
  // Criaçom (new) de 3 Filhos da Classe (objecto) "malo" usando umha variavel ARRAY.
  enemigo.push(new malo(3, 3));
  enemigo.push(new malo(5, 7));
  enemigo.push(new malo(7, 7));

  // CREAMOS JUGADOR
  protagonista = new jugador();

  // CREAMOS ANTORCHAS
  imagenAntorcha = new antorcha(0, 0);

  // LECTURA DEL TECLADO
  document.addEventListener('keydown', function(tecla) {
    if (tecla.keyCode == 38) {
      protagonista.arriba();
    }
    if (tecla.keyCode == 40) {
      protagonista.abajo();
    }
    if (tecla.keyCode == 37) {
      protagonista.izquierda();
    }
    if (tecla.keyCode == 39) {
      protagonista.derecha();
    }

    // TECLAS PARA FUNÇONS DE GUARDAR, CARGAR E BORRAR

    if (tecla.keyCode == 71) {
      // guardar (tecla G)
      guardarPartida();
    }

    if (tecla.keyCode == 67) {
      // cargar (tecla C)}
      cargarPartida();
    }

    if (tecla.keyCode == 66) {
      // borrar (tecla B)}
    }
  });

  setInterval(function() {
    principal();
  }, 1000 / FPS);
}

function borraCanvas() {
  canvas.width = 750;
  canvas.height = 500;
}

function principal() {
  borraCanvas();
  dibujaEscenario();
  imagenAntorcha.dibuja();

  protagonista.dibuja();

  for (a = 0; a < enemigo.length; a++) {
    //  console.log(enemigo[a]);
    enemigo[a].dibuja();
    enemigo[a].mueve();
  }


}

// FUNÇOM activar/desactivar música

function activaMusica() {

  if (musica.playing() == true) {
    musica.pause();
    console.log(musica.playing());
    console.log('MUSICA OFF');
  } else {
    musica.play();
    console.log(musica.playing());
    console.log('MUSICA ON');

  }


};
