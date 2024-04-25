var fondoJuego;
var personaje; 
var cursores;
var balas;
var tiempoBala = 0;
var botonDisparo;
var enemigos;
var juego = new Phaser.Game(500, 750, Phaser.CANVAS, 'bloque_juego'); 
var puntos = 0;
var puntosText;
var velocidadMovimientoEnemigos = 0.09;

var estadoPrincipal = {
    preload: function() {
        juego.load.image('fondo', 'img/space.png');
        juego.load.spritesheet('animacion', 'img/Nave-export.png', 30, 38); 
        juego.load.image('laser', 'img/laser.png');
        juego.load.spritesheet('enemigo', 'img/catlienSH.png', 21, 21, 4);
        juego.load.audio('disparo', 'audio/disparo.wav');
        juego.load.audio('explosion', 'audio/explosion.wav');
    },

    create: function() {
        fondoJuego = juego.add.tileSprite(0, 0, 500, 750, 'fondo');


        personaje = juego.add.sprite(200, 600, 'animacion'); 
        personaje.scale.setTo(1.5, 1.5); 
        personaje.animations.add('volar', [0, 1, 2, 3], 10, true); 
        personaje.animations.play('volar'); 

        cursores = juego.input.keyboard.createCursorKeys();
        botonDisparo = juego.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

        balas = juego.add.group();
        balas.enableBody = true;
        balas.physicsBodyType = Phaser.Physics.ARCADE;
        balas.createMultiple(20, 'laser');
        balas.setAll('anchor.x', 0.5);
        balas.setAll('anchor.y', 1);
        balas.setAll('outOfBoundsKill', true);
        balas.setAll('checkWorldBounds', true);

        enemigos = juego.add.group();
        enemigos.enableBody = true;
        enemigos.physicsBodyType = Phaser.Physics.ARCADE;

     
        for (var y = 0; y < 6; y++) {
            for (var x = 0; x < 7; x++) {
                var enemigo = enemigos.create(x * 40, y * 20, 'enemigo');
                enemigo.anchor.setTo(0.5);
                enemigo.animations.add('movimiento', [0, 1, 2, 3], 10, true); 
                enemigo.animations.play('movimiento'); 
                enemigo.scale.setTo(1.5, 1.5); 
            }
        }
        enemigos.x = 50;
        enemigos.y = 30;
        var animacion = juego.add.tween(enemigos).to({ x: 100 }, 1000, Phaser.Easing.Linear.None,
            true, 0, 1000, true);

        puntosText = juego.add.text(10, 700, 'Puntos: 0', { font: '24px Arial', fill: '#ffffff' }); 
        nombreText = juego.add.text(juego.width - 10, juego.height - 10, 'Diego Alonso Miñano Lavado', { font: '16px Arial', fill: '#ffffff' });
        nombreText.anchor.setTo(1, 0.5); 
        juego.sound.add('disparo');
        juego.sound.add('explosion');
    },

    update: function() {

        if (cursores.right.isDown) {
            personaje.position.x += 3; 
        } else if (cursores.left.isDown) {
            personaje.position.x -= 3; 
        }


        enemigos.y += velocidadMovimientoEnemigos;

   
        enemigos.forEach(function(enemigo) {
            if (enemigo.y >= juego.world.height) {
                reiniciarJuego();
            }
        });


        if (botonDisparo.isDown && juego.time.now > tiempoBala) {
            var bala = balas.getFirstExists(false);
            if (bala) {
                bala.reset(personaje.x, personaje.y); 
                bala.body.velocity.y = -300;
                tiempoBala = juego.time.now + 100;
                juego.sound.play('disparo');
            }
        }

        fondoJuego.tilePosition.y += 1; 
        juego.physics.arcade.overlap(balas, enemigos, colision, null, this);
    }
};

function colision(bala, enemigo) {
    bala.kill();
    enemigo.kill();
    puntos += 100;
    puntosText.text = 'Puntos: ' + puntos;

    juego.sound.play('explosion');

    if (enemigos.countLiving() === 0) {
        var ganasteText = juego.add.text(juego.world.centerX, juego.world.centerY, 'GANASTE', {
            font: '32px Arial',
            fill: '#ffffff'
        });
        ganasteText.anchor.setTo(0.5);

        juego.time.events.add(Phaser.Timer.SECOND * 5, reiniciarJuego, this);
    }
}

function reiniciarJuego() {
    juego.state.start('principal');
    puntos = 0;
}
juego.state.add('principal', estadoPrincipal);
juego.state.start('principal');