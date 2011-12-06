//make file loadable to other files
goog.provide('gc.SideBar');

//request that lime.SideBar definitions are loaded
goog.require('lime.Button');
goog.require('lime.GlossyButton');
goog.require('lime.fill.Fill');
goog.require('lime.Sprite');

//new constructor
gc.SideBar = function (width, height, game, cpu) {
	//call parents constructor
	lime.Sprite.call(this);

	// Overclock sound for when the overclock button is on
	this.overclockMusic = new lime.audio.Audio('assets/Sounds/RainbowTrololol.mp3');
	// Alarm sound for high cpu bar
	this.alarmSound = new lime.audio.Audio('assets/Sounds/alarm-fatal.mp3');

	//initial sideBar values
	this.game = game;
	this.cpu = cpu;
	this.width = width;
	this.height = height;
	this.setFill('#000000');
	this.setSize(width, height);
	this.healthBarWidth = this.width * 0.5;
	this.healthBarHeight = this.height * 0.65;
	var btnWidth = this.width * 0.65;
	var btnHeight = this.height * 0.10;
	var btnPosY = (this.healthBarHeight + btnHeight + this.height * 0.05) / 2;
	
	//initial healthBar values
	var gradient = new lime.fill.LinearGradient().setDirection(0, 0, 0, 1).
		addColorStop(0, 255, 0, 0, 1).addColorStop(0.5, 255, 255, 0, 1).
		addColorStop(1, 0, 255, 0, 1);
	this.healthBar = new lime.RoundedRect().
		setSize(this.healthBarWidth, this.healthBarHeight).setFill(gradient);
	this.appendChild(this.healthBar);
	
	//initial mask values
	this.mask = new lime.Sprite().setSize(this.healthBarWidth, 0).
		setPosition(0, (this.healthBarHeight / 2));
	this.appendChild(this.mask);
	this.healthBar.setMask(this.mask);
	
	//initial soundButton values
	var bgMusic = new lime.audio.Audio('assets/Sounds/Song6Long.mp3');
	var isMusicPlaying = bgMusic.isPlaying();
	
	var soundBtnBg = new lime.Sprite().setFill('assets/sound_0.png').
		setSize(25, 20).setPosition(0, -btnPosY);
	this.appendChild(soundBtnBg);
	
	var soundBtn = new lime.GlossyButton(' ').
		setPosition(0, -btnPosY).setSize(btnWidth, btnHeight).
		setColor('#404040').setOpacity(0.85);
	this.appendChild(soundBtn);
	
	goog.events.listen(soundBtn, ['touchstart', 'mousedown'], function () {
		if (!isMusicPlaying) {
			soundBtnBg.setFill('assets/sound_1.png');
			bgMusic.stop();
			bgMusic.play();
			isMusicPlaying = true;
		} else {
			soundBtnBg.setFill('assets/sound_0.png');
			bgMusic.stop();
			isMusicPlaying = false;
		}
    });

	//initial cpuOverButton values
	this.cpuOverState = false;
	
	this.cpuOverBtn = new lime.GlossyButton('OC').setSize(btnWidth, btnHeight).
		setPosition(0, btnPosY).setColor('#4359C4');
	this.appendChild(this.cpuOverBtn);
		
	goog.events.listen(this.cpuOverBtn, ['touchstart', 'mousedown'], this.OC, true, this);
};

//define parent class
goog.inherits(gc.SideBar, lime.Sprite);

// new method for bar visibility
gc.SideBar.prototype.updateBar = function () {
	// var heightGrowth = (100 - this.cpu.getStatus()) * 10;
	var heightGrowth = this.healthBarHeight*this.cpu.getStatus()*.01*2.05;
	if (heightGrowth <= this.healthBarHeight*2.05) {
		this.mask.setSize(this.healthBarWidth, heightGrowth);
	}
	if(heightGrowth >= 300) {
		this.alarmSound.play();
	} else {
		this.alarmSound.stop();
	}

};

gc.SideBar.prototype.playOverclockMusic = function() {
	this.overclockMusic.stop();
	this.overclockMusic.play();
}

gc.SideBar.prototype.stopOverclockMusic = function() {
	this.overclockMusic.stop();
}

gc.SideBar.prototype.OC = function(){
	if (!this.cpuOverState) {
		this.playOverclockMusic();
		this.cpuOverState = true;
		this.cpuOverBtn.setColor('#D71413').setText('!!!');
		this.game.startOC();
	} else {
		this.stopOverclockMusic();
		this.cpuOverState = false;
		this.cpuOverBtn.setColor('#4359C4').setText('OC');
		this.game.endOC();
	}
}

gc.SideBar.prototype.startOC = function() {

}

gc.SideBar.prototype.endOC = function(){
	
}
