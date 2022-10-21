import Phaser from 'phaser';

class Heart extends Phaser.GameObjects.Sprite{

  constructor({scene, x, y, angle, controller}){
    const s = controller.cellSize;
    super(scene, x * s, y * s, `heart`);
    this.gridX = x;
    this.gridY = y;
    this.cellSize = s;
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
    angle = angle % 4;
    this.orientation = angle;
  }
  async rotate(angle){
    return new Promise((resolve, reject) => {
      const start = this.orientation * 90;
      const end = start + angle * 90;
      this.setOrientation(this.orientation + angle);
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
}

Phaser.GameObjects.GameObjectFactory.register('heart', function (config) {
  const heart = new Heart({scene: this.scene, ...config});
  this.displayList.add(heart);
  this.updateList.add(heart);
  return heart;
});

export default Heart;