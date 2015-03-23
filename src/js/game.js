(function() {
  'use strict';

  var textVida,textZombies,textDinero;
  var cash = 0;
  var pressBtnLeft=false;
  var pressBtnRight=false;
  var pressBtnUp=false;
  var pressBtnDown=false;
  var numZombies = 10;
  var ronda = 1;


  var positionsZombies = [
      [818,380],
      [1088,292],
      [1381,358],
      [1333,283],
      [1433,283],
      [1288,95],
      [991,95],
      [661,95],
      [658,95],
      [526,31],
      [526,193],
      [526,196],
      [921,28],
      [1521,166],
      [1521,378],
      [1521,381],
      [1356,503],
      [1081,503],
      [806,503],
      [499,491],
      [569,733],
      [616,643],
      [711,636],
      [1139,636],
      [1141,636],
      [1524,636],
      [1389,598],
      [1386,598],
      [984,831],
      [1094,911],
      [1097,911],
      [1054,978],
      [824,1196],
      [1382,1215],
      [1384,1215],
      [1403,1005],
      [1403,1007],
      [1403,845],
      [1464,978],
      [1464,981],
      [1560,956],
      [1470,1135],
  ];

  function Game() {
    this.player = null;

  }

  Game.prototype = {

    create: function () {
      var x = this.game.width / 2
        , y = this.game.height / 2;
      var positionPlayer = 1, totalZombies= 0, totalZombiesRonda = 0;

      /*this.player = this.add.sprite(x, y, 'player');
      this.player.anchor.setTo(0.5, 0.5);
      this.input.onDown.add(this.onInputDown, this);*/

      this.game.physics.startSystem(Phaser.Physics.ARCADE);
      //this.game.physics.arcade.gravity.y = 485;

      
      
      var arrNotCollision = [
        311, //cesped
        127,128,129,178,179,180,229,230,231,26,27,77,78, //arena
        673,674,675,676,677, //puente
        121,122,123,172,,173,174,223,224,225, //cemento
        256,205, //plantas
        23,24,74,75,124,125,126,175,176,177,226,227,228, // arena oscura
        47,48,98,99,148,149,150,199,200,201,250,251,252,286,287,288,337,338,339,388,389,390, // arena playa
        412,413,414 //escaleras

      ];
      // map
      this.map = this.game.add.tilemap('tilemap1');
      this.map.addTilesetImage('tiles','tiles');
      this.map.setCollisionByExclusion(arrNotCollision,true);
      //this.map.setCollisionBetween(0, this.map.tiles.length);
      this.layer = this.map.createLayer('Capa');
      this.layer.resizeWorld();
      //this.layer.debug = true;

      //sound
      this.shootSound = this.game.add.audio('shootSound');
      this.zombieSound = this.game.add.audio('zombie');
      this.dolorSound = this.game.add.audio('dolor');

      // player
      function setupPlayer(player) {
          player.animations.add('standby-down', [6], 10, false);
          player.animations.add('standby-left', [8], 10, false);
          player.animations.add('standby-right', [8], 10, false);
          player.animations.add('standby-up', [0], 10, false);

          player.animations.add('move-left', [8, 9], 10, false);
          player.animations.add('move-right', [8, 9], 10, false);
          player.animations.add('move-up', [0, 1], 10, false);
          player.animations.add('move-down', [6, 7], 10, false);
          
          player.body.collideWorldBounds = true;
          player.body.setSize(16,16,0,9);
          player.anchor.setTo(0.5,0.5);
          player.fireTimer = 0;
          player.health = 100;
          player.body.debug = true;
          player.animations.play('standby-down');
      }

      this.player = this.game.add.sprite(215, 213, 'marco');
      this.game.physics.enable(this.player, Phaser.Physics.ARCADE);
      setupPlayer(this.player);
      this.game.camera.follow(this.player);


      // enemies
      
      
      this.generateZombies();      
      
      this.totalZombies = this.zombies.length;

      // bullets
      function setupBullet(bullet) {
          this.game.physics.enable(bullet, Phaser.Physics.ARCADE);
          bullet.body.collideWorldBounds = false;
          bullet.body.setSize(13, 13);
          bullet.anchor.setTo(0.5, 0.5);
          bullet.lifespan = 1000;
          bullet.outOfBoundsKill = true;
          bullet.checkWorldBounds = true;
          bullet.body.allowGravity = false;
      }
      this.bullets = this.game.add.group();
      this.bullets.createMultiple(20, 'bala');
      this.bullets.forEach(setupBullet, this);


      // controls
      function createControls(gameContext) {
          gameContext.controls = {
              'left': gameContext.game.input.keyboard.addKey(65), //A
              'right': gameContext.game.input.keyboard.addKey(68), //D
              'down': gameContext.game.input.keyboard.addKey(83), //S
              'up': gameContext.game.input.keyboard.addKey(87), //W
              'killAll': gameContext.game.input.keyboard.addKey(Phaser.Keyboard.K), //K
              'fire': gameContext.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR), // __
              'shop': gameContext.game.input.keyboard.addKey(Phaser.Keyboard.B) // __
          };
      }
      createControls(this);

      var spriteInfo = this.add.sprite(0,0);
      spriteInfo.fixedToCamera = true;

      textVida = this.add.text((x), 5, 'Vida: '+this.player.health+'/100', {
        font: "22px minecraftia",
        fill: "#fff"
      });
      textZombies = this.add.text((x), 30, 'Zombies: '+(this.zombies.length+1) +'/'+(this.zombies.length+1), {
        font: "22px minecraftia",
        fill: "#fff"
      });

      textDinero = this.add.text(5, 5, cash+' $', {
        font: "22px minecraftia",
        fill: "#fff"
      });


      textVida.inputEnabled = true;
      textVida.input.enableDrag();
      textVida.fixedToCamera = true;

      textZombies.inputEnabled = true;
      textZombies.input.enableDrag();
      textZombies.fixedToCamera = true;

      textDinero.inputEnabled = true;
      textDinero.input.enableDrag();
      textDinero.fixedToCamera = true;

      //cargando el gamepad
      var marginLeftBtnsDirection = 10;
      var marginBottomBtnDirection = 30;
      
      var btnLeft = this.add.button(marginLeftBtnsDirection, ((y*2)-(40*2)-marginBottomBtnDirection), 'btnLeft', null, this, null, null, null);
      btnLeft.input.useHandCursor = true;
      btnLeft.events.onInputDown.add(this.activeteBtnLeft);
      btnLeft.events.onInputUp.add(this.desactiveteBtnLeft);
      btnLeft.fixedToCamera = true;

      var btnUp = this.add.button(marginLeftBtnsDirection+40, ((y*2)-(40*3)-marginBottomBtnDirection), 'btnUp', null, this, null, null, null);
      btnUp.input.useHandCursor = true;
      btnUp.events.onInputDown.add(this.activeteBtnUp);
      btnUp.events.onInputUp.add(this.desactiveteBtnUp);
      btnUp.fixedToCamera = true;

      var btnRight = this.add.button(marginLeftBtnsDirection+(40*2), ((y*2)-(40*2)-marginBottomBtnDirection), 'btnRight', null, this, null, null, null);
      btnRight.input.useHandCursor = true;
      btnRight.events.onInputDown.add(this.activeteBtnRight);
      btnRight.events.onInputUp.add(this.desactiveteBtnRight);
      btnRight.fixedToCamera = true;

      var btnDown = this.add.button(marginLeftBtnsDirection + 40, ((y*2)-40-marginBottomBtnDirection), 'btnDown', null, this, null, null, null);
      btnDown.input.useHandCursor = true;
      btnDown.events.onInputDown.add(this.activeteBtnDown);
      btnDown.events.onInputUp.add(this.desactiveteBtnDown);
      btnDown.fixedToCamera = true;

      var btnShot = this.add.button((x*2)-90, ((y*2)-100), 'btnShot', this.activeBtnShot, this, null, null, null);
      btnShot.input.useHandCursor = true;
      btnShot.fixedToCamera = true;



    },

    update: function () {

      //definimos los collides
      this.game.physics.arcade.collide(this.player, this.layer);
      this.game.physics.arcade.collide(this.zombies, this.layer);
      this.game.physics.arcade.collide(this.zombies, this.zombies);


      //si un zombie esta acerca del jugador
      this.zombies.forEach(function (zombie) {
          if (this.game.physics.arcade.distanceBetween(zombie, this.player) < 200) {
              this.game.physics.arcade.accelerateToObject(zombie, this.player, 60, 500, 500);
              // accelerateToObject(objeto, destino, vel, xVelMax, yVelMax)
          } else {
              this.moveZombie(zombie);
          }
      }, this);

      //comprovamos los collides y los enviamos a una funcion
      this.game.physics.arcade.collide(this.zombies, this.player, this.playerIsDamaged, null, this);
      this.game.physics.arcade.collide(this.zombies, this.bullets, this.enemyIsDamaged, null, this);
      this.game.physics.arcade.collide(this.layer, this.bullets, this.destroyBullet, null, this);

      //definimos la velocidad del player para que no se mueva solo
      this.player.body.velocity.x = 0;
      this.player.body.velocity.y = 0;
      //console.log(this.pressBtnLeft);
      if (this.controls.left.isDown || pressBtnLeft == true) {
          this.activeBtnLeft();
      } else if (this.controls.right.isDown || pressBtnRight == true) {
          this.activeBtnRight();
      } else if (this.controls.down.isDown || pressBtnDown == true) {
          this.activeBtnDown();
      } else if (this.controls.up.isDown || pressBtnUp == true) {
          this.activeBtnUp();
      } else if (this.controls.fire.isDown) {
          this.activeBtnShot();
      } else if (this.controls.killAll.isDown) {
          this.zombies.forEach(this.killAll, this);

      } else if(this.controls.shop.isDown){
          
      } else {
          //this.player.animations.play('standby');
          switch(this.positionPlayer) {
              case 1:
                  this.player.animations.play('standby-up');
                  break;
              case 2:
                  this.player.animations.play('standby-right');
                  break;
              case 3:
                  this.player.animations.play('standby-down');
                  break;
              case 4:
                  this.player.animations.play('standby-left');
                  break;
          }
      }

      if(this.totalZombies == 0){
        ronda ++;
        this.generateZombies();
        textZombies.setText('Zombies: '+this.totalZombies +'/'+this.totalZombiesRonda);
      }
      if(this.player.health == 0){
        this.fin();
      }
    },

    playerIsDamaged: function (player) {
      player.damage(1);
      this.dolorSound.play('',0,0.4,false);
      textVida.setText('Vida: '+this.player.health+'/100');
    },

    enemyIsDamaged: function (enemy, bullet) {
        this.zombieSound.play('',0,0.4,false);
        enemy.damage(1);
        bullet.kill();

        if(enemy.health == 0){
          this.totalZombies = this.totalZombies - 1;
          textZombies.setText('Zombies: '+this.totalZombies +'/'+this.totalZombiesRonda);
          cash = cash +10;
          textDinero.setText(cash + '$');
        }
    },

    destroyBullet: function (bullet) {
        bullet.kill();
    },

    fireBullet: function (context) {
        if (context.game.time.now > context.player.fireTimer) {
            var bullet = context.bullets.getFirstExists(false);
            if (bullet) {
                context.shootSound.play('', 0, 0.4, false);
                bullet.reset(context.player.x, context.player.y);
                
                switch(this.positionPlayer){
                  case 1:
                    bullet.body.velocity.y = - 500 * context.player.scale.y;
                    break;
                  case 2:
                    bullet.body.velocity.x = 500 * context.player.scale.x;
                    break;
                  case 3:
                    bullet.body.velocity.y = 500 * context.player.scale.y;
                    break;
                  case 4:
                    bullet.body.velocity.x = 500 * context.player.scale.x;
                    break;
                }                
                context.player.fireTimer = context.game.time.now + 500;
            }
        }
    },

    killAll: function(enemy){
      this.totalZombies = 0;
      enemy.damage(10);
    },


    activeBtnDown: function(){
      this.positionPlayer = 3;
      this.player.body.velocity.y = 150;
      this.player.animations.play('move-down');
      if (this.player.scale.y > 0) {
          this.player.scale.y = 1;
          //this.player.body.setSize(18, 35, 0, 6);
      }
    },
    activeBtnUp: function(){
      this.positionPlayer = 1;
      this.player.body.velocity.y = - 150;
      this.player.animations.play('move-up');
      if (this.player.scale.y < 0) {
          this.player.scale.y = - 1;
          //this.player.body.setSize(18, 35, 0, 6);
      }
    },
    activeBtnLeft: function(){
      this.positionPlayer = 4;
      this.player.body.velocity.x = -150;
      this.player.animations.play('move-left');
      if (this.player.scale.x > 0) {
          this.player.scale.x = - 1;
          //this.player.body.setSize(18, 35, 0, 6);
      }
    },
    activeBtnRight: function(){
      this.positionPlayer = 2;
      this.player.body.velocity.x = 150;
      this.player.animations.play('move-right');
      if (this.player.scale.x < 0) {
          this.player.scale.x = 1;
          //this.player.body.setSize(18, 35, -6, 6);
      }
    },
    activeBtnShot: function(){
      //console.log("Posicion: " + this.player.position.y + " - " + this.player.position.x);
      this.fireBullet(this);
    },
    activeteBtnLeft:function(){
      pressBtnLeft = true;
    },
    activeteBtnRight:function(){
      pressBtnRight = true;
    },
    activeteBtnUp:function(){
      pressBtnUp = true;
    },
    activeteBtnDown:function(){
      pressBtnDown = true;
    },
    desactiveteBtnLeft:function(){
      pressBtnLeft = false;
    },
    desactiveteBtnRight:function(){
      pressBtnRight = false;
    },
    desactiveteBtnUp:function(){
      pressBtnUp = false;
    },
    desactiveteBtnDown:function(){
      pressBtnDown = false;
    },
    generateZombies:function(){
      this.zombies = this.game.add.group();
      this.totalZombies = ronda * numZombies;
      this.totalZombiesRonda = this.totalZombies;
      var position = [];
      for (var i = 1; i <= this.totalZombies; i++) {
        position = positionsZombies[Math.round((Math.random()*(positionsZombies.length-1)))];
        //console.log(position + " - " + i);
        this.zombies.create(position[0],position[1],'zombies');
      };
      this.zombies.forEach(this.setupZombie, this);

    },
    setupZombie:function(enemy){
      this.game.physics.enable(enemy, Phaser.Physics.ARCADE);
      enemy.animations.add('default', [3, 5], 10, true);
      enemy.body.collideWorldBounds = true;
      enemy.body.setSize(32, 23);
      enemy.anchor.setTo(0.5, 0.5);
      enemy.health = 2;
      enemy.animations.play('default');
    },
    moveZombie:function(enemy){
      var numAleat = Math.round(Math.random()*10);

      switch(numAleat){
        case 0:
          enemy.body.velocity.x = 50;
          break;
        case 1:
          enemy.body.velocity.x = -50;
          break;
        case 2:
          enemy.body.velocity.y = 50;
          break;
        case 3:
          enemy.body.velocity.y = -50;
          break;
      }
    },

    fin: function (){      
      this.game.state.start('menu');
    }

  };

  window['zombies2'] = window['zombies2'] || {};
  window['zombies2'].Game = Game;

}());
