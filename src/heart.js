import Phaser from 'phaser';

const {TWEEN_REPEAT} = Phaser.Tweens.Events;

const SCALE_BIG = 1.2;
const SCALE_NORMAL = 1;

class Heart extends Phaser.GameObjects.Sprite{

  constructor({scene, x, y, angle, controller}){
    const s = controller.cellSize;
    super(scene, x * s, y * s, `heart`);
    this.gridX = x;
    this.gridY = y;
    this.controller = controller;
    this.scene = scene;
    this.setOrientation(angle);
    this.setAngle(this.orientation * 90);
    this.setInteractive()
    this.on(`pointerdown`, (e) => {
      controller.onClick(e, this)
    });
    controller.add(this);
  }

  setOrientation(angle){
    this.orientation = angle % 4;
  }

  rotate(angle){
    const start = this.orientation * 90;
    const end = start + angle * 90;
    this.setOrientation(this.orientation + angle);
    return new Promise((resolve, reject) => {
      this.scene.tweens.add({
        targets: this,
        duration: 250,
        onComplete: resolve,
        angle: {
          getStart: () => start,
          getEnd: () => end
        }
      });
    });
  }
  startBeat(){
    this.scale = SCALE_NORMAL; //foolproof
    this.beat = this.scene.tweens.add({
      targets: this,
      duration: 250,
      repeat: -1,
      yoyo: true,
      scale: SCALE_BIG,
      repeatDelay: 250
    });
  }
  stopBeat(){
    this.beat && this.beat.once(TWEEN_REPEAT, () => {
      this.beat.remove();
      this.beat = null;
    });
  }
  isBeating(){
    return !!this.beat;
  }
  select(){
    this.selected = true;
    return new Promise((resolve, reject) => {
      this.scene.tweens.add({
        targets: this,
        duration: 100,
        onComplete: resolve,
        scale: SCALE_BIG
      });
    });
  }
  unselect(){
    this.selected = false;
    return new Promise((resolve, reject) => {
      this.scene.tweens.add({
        targets: this,
        duration: 100,
        onComplete: resolve,
        scale: SCALE_NORMAL
      });
    });
  }
  
  disappear(){
    return new Promise((resolve, reject) => {
      this.scene.tweens.add({
        targets: this,
        duration: 250,
        onComplete: () => {
          this.destroy();
          this.controller.remove(this);
          resolve();
        },
        scale: 0
      });
    });
  }
}

Phaser.GameObjects.GameObjectFactory.register('heart', function (config) {
  const heart = new Heart({scene: this.scene, ...config});
  this.displayList.add(heart);
  this.updateList.add(heart);
  return heart;
});

export default Heart;