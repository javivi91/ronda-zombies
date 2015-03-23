(function() {
  'use strict';

  function Menu() {
    this.titleTxt = null;
    this.startTxt = null;
    this.btnStartGame = null;
    this.btnShop = null;
  }

  Menu.prototype = {

    create: function () {
      var x = this.game.width / 2
        , y = this.game.height / 2;

      this.bg = this.game.add.tileSprite(0, 0, x*2, y*2, 'fondo-menu');

      //var imageShop = this.add.image(((this.game.world.width/2)+70), 300, 'btn-shop', 'btn-shop');
      this.btnStartGame = this.add.button((x-146), 450, 'btn', this.onDown, this, null, null, null);
      this.btnStartGame.input.useHandCursor = true;

      this.btnShop = this.add.button((x+30), 450, 'btn-shop', this.onDown, this, null, null, null);
      this.btnShop.input.useHandCursor = true;
    },

    update: function () {

    },

    onDown: function () {
      this.game.state.start('game');
    }
  };
  window['zombies2'] = window['zombies2'] || {};
  window['zombies2'].Menu = Menu;

}());
