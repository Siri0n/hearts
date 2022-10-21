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
    const controller = new Controller(this, 256);
    this.add.heart({x: 1, y: 1, angle: 1, controller});
    this.add.heart({x: 2, y: 2, angle: 2, controller});
}

function init(){

}