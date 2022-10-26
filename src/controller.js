import Phaser from 'phaser';

class Controller{
  constructor(scene, cellSize){
    this.cellSize = cellSize;
    this.hearts = [];
    this.onClick = this.onClick.bind(this);
    this.processing = false;
    this.selectedItem = null;
  }

  static isAligned(a, b){
    return (a != b) && 
      (a.orientation == b.orientation) && (
      (a.gridX == b.gridX) ||
      (a.gridY == b.gridY)
    );
  }

  static isBetween(a, b, c){
    let middle, left, right
    if( (a.gridX == b.gridX) && (a.gridX == c.gridX) ){
      [middle, left, right] = [a.gridY, b.gridY, c.gridY];
    }else if( (a.gridY == b.gridY) && (a.gridY == c.gridY) ){
      [middle, left, right] = [a.gridX, b.gridX, c.gridX];
    }else{
      return false;
    }
    if(left > right){
      [left, right] = [right, left];
    }
    return (left < middle) && (middle < right);
  }

  add(heart){
    this.hearts.push(heart);
  }

  remove(heart){
    this.hearts.splice(this.hearts.indexOf(heart), 1);
  }
  
  async selectFirst(target){
    this.selectedItem = target;
    this.hearts
        .filter(it => Controller.isAligned(it, target))
        .map(it => it.startBeat());
    await target.select();
  }

  async unselect(target){
    this.selectedItem = null;
    this.hearts.forEach(it => it.stopBeat());
    await target.unselect();
  }

  async selectSecond(target){
    this.hearts.forEach(it => it.stopBeat());
    await Promise.all([
      this.selectedItem.disappear(),
      target.disappear(),
      ...this.hearts
        .filter(it => Controller.isBetween(it, this.selectedItem, target))
        .map(it => it.rotate(1))
    ]); 
    this.selectedItem = null;
  }

  async onClick(e, target){
    if(this.processing){
      console.log("processing");
      return;
    }else{
      this.processing = true;
    }

    if(!this.selectedItem){
      await this.selectFirst(target);

    }else if(this.selectedItem == target){
      await this.unselect(target);

    }else if(target.isBeating()){
      await this.selectSecond(target);

    }else{
      //noop
    }

    this.processing = false;
  }

}

export default Controller;