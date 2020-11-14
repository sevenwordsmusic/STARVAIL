import Audio from "./Audio.js";

export default class Chatter extends Phaser.Scene {
    constructor() {
        super("Chatter");
    }

	static male=[];
    static female=[];
    static counter=0;

    static letsTalk(words, scene, genre, size, weight){
    	Chatter.counter=0;
    	for(var i=0; i<words; i++){
    		scene.time.addEvent({
                delay: (Audio.barRateDiv[3]*i)/(1.5-size),
                callback: () => {
                    Chatter.speakWord(genre, size, weight);
                },
                callbackScope: this,
                loop: false,
            });

    	}
    }


    static speakWord(genre, size, weight){
        var rnd=Math.floor(Math.random()*Chatter.male.length);

        switch(genre){
          case 0:
                Chatter.male[rnd].setRate(1.5-size);
                Chatter.male[rnd].setDetune(1200-(weight*2400));
                Chatter.male[rnd].play();
            break;
          case 1:
            Chatter.female[rnd].setRate(1.5-size);
            Chatter.female[rnd].setDetune(1200-(weight*2400));
            Chatter.female[rnd].play();
            break
    	}
    	Chatter.counter++;
    }

    preload() {
     	this.load.audio('male_00', 'assets/audio/0F/male/0.ogg');
        this.load.audio('male_01', 'assets/audio/0F/male/1.ogg');
        this.load.audio('male_02', 'assets/audio/0F/male/2.ogg');
        this.load.audio('male_03', 'assets/audio/0F/male/3.ogg');
        this.load.audio('male_04', 'assets/audio/0F/male/4.ogg');
        this.load.audio('male_05', 'assets/audio/0F/male/5.ogg');
        this.load.audio('male_06', 'assets/audio/0F/male/6.ogg');
        this.load.audio('male_07', 'assets/audio/0F/male/7.ogg');
        this.load.audio('male_08', 'assets/audio/0F/male/8.ogg');
        this.load.audio('male_09', 'assets/audio/0F/male/9.ogg');
        this.load.audio('male_10', 'assets/audio/0F/male/A.ogg');
        this.load.audio('male_11', 'assets/audio/0F/male/B.ogg');
        this.load.audio('male_12', 'assets/audio/0F/male/C.ogg');
        this.load.audio('male_13', 'assets/audio/0F/male/D.ogg');
        this.load.audio('male_14', 'assets/audio/0F/male/E.ogg');
        this.load.audio('male_15', 'assets/audio/0F/male/F.ogg');
        this.load.audio('female_00', 'assets/audio/0F/female/0.ogg');
        this.load.audio('female_01', 'assets/audio/0F/female/1.ogg');
        this.load.audio('female_02', 'assets/audio/0F/female/2.ogg');
        this.load.audio('female_03', 'assets/audio/0F/female/3.ogg');
        this.load.audio('female_04', 'assets/audio/0F/female/4.ogg');
        this.load.audio('female_05', 'assets/audio/0F/female/5.ogg');
        this.load.audio('female_06', 'assets/audio/0F/female/6.ogg');
        this.load.audio('female_07', 'assets/audio/0F/female/7.ogg');
        this.load.audio('female_08', 'assets/audio/0F/female/8.ogg');
        this.load.audio('female_09', 'assets/audio/0F/female/9.ogg');
        this.load.audio('female_10', 'assets/audio/0F/female/A.ogg');
        this.load.audio('female_11', 'assets/audio/0F/female/B.ogg');
        this.load.audio('female_12', 'assets/audio/0F/female/C.ogg');
        this.load.audio('female_13', 'assets/audio/0F/female/D.ogg');
        this.load.audio('female_14', 'assets/audio/0F/female/E.ogg');
        this.load.audio('female_15', 'assets/audio/0F/female/F.ogg');
    }
    create() {
    	for(var i=0; i<10; i++){
    		Chatter.male[i]=this.sound.add('male_0' + i);
    	}
    	for(var i=10; i<16; i++){
    		Chatter.male[i]=this.sound.add('male_' + i);
    	}
    	for(var i=0; i<10; i++){
    		Chatter.female[i]=this.sound.add('female_0' + i);
    	}
    	for(var i=10; i<16; i++){
    		Chatter.female[i]=this.sound.add('female_' + i);
    	}
        this.scene.start("SceneLoading");
    }
}
