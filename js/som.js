/*********************************************
 *             SESION 30
 *        MÚSICA Y EFECTOS DE SONIDO
 *
 **********************************************/
var sonido1, sonido2, sonido3;

// Creación de objetos Howler (en howler.core.js)
sonido1 = new Howl({
  src: ['sound/efecto1.wav'],
  loop: false
});

sonido2 = new Howl({
  src: ['sound/efecto2.wav'],
  loop: false
});

musica = new Howl({
  src: ['music/01.mp3'],
  loop: true
});

// *******************FUNCIONES ****************************
// *******************************************************
function inicializa() {
  musica.play();

  //LECTURA DEL TECLADO
  document.addEventListener('keydown', function(tecla) {
    if (tecla.keyCode == 38) {
      //arriba
      sonido1.play(); // llamamos al método play del objeto Howl
    }
    if (tecla.keyCode == 40) {
      //abajo
      sonido2.play();
    }
    if (tecla.keyCode == 37) {
      //izquierda
    }
    if (tecla.keyCode == 39) {
      //derecha
    }

  });

};
