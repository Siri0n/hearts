import Phaser from 'phaser';
import Controller from './controller';
import Heart from './heart';
import HeartImage from './assets/heart.png';

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create
    }
};

const game = new Phaser.Game(config);

function preload(){
    this.load.image('heart', HeartImage);
}

function create(){
    const controller = new Controller(this, 128);
    for(let i = 0; i < 4; i++){
        for(let j = 0; j < 4; j++){
            this.add.heart({x: i, y: j, angle: 0, controller});
        }
    }
}

function init(){

}