window.onload = function () {
  'use strict';

  var game
    , ns = window['zombies2'];

  game = new Phaser.Game(350, 580, Phaser.AUTO, 'zombies2-game');
  game.state.add('boot', ns.Boot);
  game.state.add('preloader', ns.Preloader);
  game.state.add('menu', ns.Menu);
  game.state.add('game', ns.Game);
  /* yo phaser:state new-state-files-put-here */

  game.state.start('boot');
};
