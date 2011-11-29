goog.provide('gc.Game');

goog.require('lime.Scene');
goog.require('gc.Board');
goog.require('gc.SideBar');
goog.require('gc.Cpu');
goog.require('gc.Player');
goog.require('gc.Enemy');
goog.require('gc.EnemyFactory');

gc.Game = function(){
	lime.Scene.call(this);
	
	this.SIDEBAR_WIDTH = gc.WIDTH/5.0;
	this.SPAWN_RATE = 2000; 
	this.RECOVERY_RATE = 1000;
	
	// Background layer
	this.backLayer = new lime.Layer().setPosition(gc.WIDTH/2.0 + this.SIDEBAR_WIDTH/2 , gc.HEIGHT/2.0);
	this.appendChild(this.backLayer);
	
	// Sidebar layer
	this.sideLayer = new lime.Layer().setPosition(this.SIDEBAR_WIDTH/2.0, gc.HEIGHT/2.0);
	this.appendChild(this.sideLayer);
	
	// Player Layer
	this.playerLayer = new lime.Layer().setPosition(this.SIDEBAR_WIDTH,0);
	this.appendChild(this.playerLayer);
	
	// Main board
	this.board = new gc.Board(this.getBoardWidth(), this.getBoardHeight(), this);
	this.backLayer.appendChild(this.board);
	
	// CPU 
	this.cpu = new gc.Cpu().setSize(60,60).setPosition(0,0);
	this.board.appendChild(this.cpu);
	
	// Side bar
	this.sidebar = new gc.SideBar(this.SIDEBAR_WIDTH, gc.HEIGHT, this, this.cpu);
	this.sideLayer.appendChild(this.sidebar);
	
	// Player
	this.player = new gc.Player(this).setPosition(0, 50);
	this.backLayer.appendChild(this.player);
	
	// Enemies
	this.enemies = new Array();
	
	// Enemy Factory
	this.enemyFactory = new gc.EnemyFactory(this, this.cpu);
	
	goog.events.listen(this, 'mousedown', this.moveToPos);
}
goog.inherits(gc.Game, lime.Scene);

gc.Game.prototype.start = function(){
	lime.scheduleManager.scheduleWithDelay(this.scheduleSpawn, this, this.SPAWN_RATE);
	lime.scheduleManager.scheduleWithDelay(this.recoverCpu, this, this.RECOVERY_RATE);
	lime.scheduleManager.schedule(this.step_, this);
}

gc.Game.prototype.step_ = function(dt){
	
	this.sidebar.updateBar();
// 	
	// if(cpu.getStatus() >= 100){
		// endGame();
	// }     
// 	
	// this.player.timeStep();
	
	
	 for(i=0; i<this.enemies.length; ++i){
		 this.enemies[i].timeStep();
		 var pos = this.enemies[i].getPosition();
		 if(Math.abs(pos.x) < 20 && Math.abs(pos.y < 20)){
		 	this.backLayer.removeChild(this.enemies[i]);
		 	this.enemies.splice(i, 1);	
		 }
	 }
}

gc.Game.prototype.moveToPos = function(e) {
	
	var target = e.position;
	var speed = this.player.getSpeed();
	// Compensate target coordinate for board location
	var pos = this.player.getPosition();	
	var sbdist = this.board.getSize().width/2 + this.SIDEBAR_WIDTH;

	target.x -= sbdist;
	target.y -= this.board.getSize().height/2;
	
	var distance = goog.math.Coordinate.distance(pos, target);
	var duration = Math.abs(distance)/speed;
	
	
	if(target.x >= -sbdist){
  	this.player.runAction( 
    	new lime.animation.Spawn(
          	new lime.animation.MoveTo(target).setDuration(duration),
          	new lime.animation.RotateBy(-720).setDuration(duration)
      	)
    );
   }
}

gc.Game.prototype.scheduleSpawn = function(){
	this.enemyFactory.spawnEnemies();
}

gc.Game.prototype.recoverCpu = function(){
	this.cpu.incRecover();
}

gc.Game.prototype.endGame = function(){
	
}

gc.Game.prototype.createEnemy = function(x,y,enemy){
	this.enemies.push(enemy);
	enemy.setPosition(x,y);
	this.backLayer.appendChild(enemy);
}

gc.Game.prototype.getBoardWidth = function(){
	return gc.WIDTH - this.SIDEBAR_WIDTH;
}

gc.Game.prototype.getBoardHeight = function(){
	return gc.HEIGHT;
}

gc.Game.prototype.getSideBarWidth = function(){
	return this.SIDEBAR_WIDTH;
}
gc.Game.prototype.getSideLayer = function(){
	return this.sideLayer;
}