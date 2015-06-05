(function() {
  'use strict';



  function Preloader() {
    this.asset = null;
    this.ready = false;
  }

  Preloader.prototype = {

    preload: function () {
      this.asset = this.add.sprite(this.game.width * 0.5 - 110, this.game.height * 0.5 - 10, 'preloader');

      this.load.image('fondo-menu', 'assets/menu/background2.png');
      this.load.image('btn-shop', 'assets/menu/btn-shop.png');
      //this.load.image('btn', 'assets/menu/btn.png');
      this.load.spritesheet('btn', 'assets/menu/btn.png', 128, 128);
      this.load.spritesheet('tiles', 'assets/escenario/tiles3.png', 16, 16, 1, 1);
      this.load.tilemap('tilemap1', 'assets/escenario/mapa3.json', null, Phaser.Tilemap.TILED_JSON);
      this.load.spritesheet('marco', 'assets/character/player.png', 18, 26);
      this.load.spritesheet('zombies', 'assets/character/zombies.png', 32, 32);
      this.load.image('bala', 'assets/character/bala.png');

      this.load.audio('shootSound', 'assets/audio/pistola.wav');
      this.load.audio('dolor', 'assets/audio/dolor.ogg');
      this.load.audio('zombie', 'assets/audio/zombie.ogg');

      this.load.image('btnLeft', 'assets/escenario/left.png');
      this.load.image('btnRight', 'assets/escenario/right.png');
      this.load.image('btnUp', 'assets/escenario/up.png');
      this.load.image('btnDown', 'assets/escenario/down.png');
      this.load.image('btnShot', 'assets/escenario/btnShot.png');


      //shop
      /*this.load.image('img-escopeta', 'assets/armas/escopeta.jpg');
      this.load.image('img-llamas', 'assets/armas/lanza-llamas.jpg');*/

      this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
      this.load.setPreloadSprite(this.asset);
      
      this.loadResources();

      

    },
      
    loadResources: function () {
      this.load.bitmapFont('minecraftia', 'assets/minecraftia.png', 'assets/minecraftia.xml');
    },

    create: function () {
      this.asset.cropEnabled = false;
    },

    update: function () {
      if (!!this.ready) {
        this.game.state.start('menu');
      }
    },

    onLoadComplete: function () {
      this.ready = true;
    }
  };

  window['zombies2'] = window['zombies2'] || {};
  window['zombies2'].Preloader = Preloader;

}());

