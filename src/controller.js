import Phaser from 'phaser';

class Controller{
  constructor(scene, cellSize){
    this.cellSize = cellSize;
    this.hearts = [];
    this.onClick = this.onClick.bind(this);
  }
  add(heart){
    this.hearts.push(heart);
  }
  async onClick(e, target){
    await target.rotate(1);
    await target.rotate(1);
    console.log(`rotated`);
  }

}

export default Controller;