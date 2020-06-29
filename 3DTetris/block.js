
class Block extends THREE.Group {
  constructor(pos, orientations) {
    super();
    this.orientations = orientations;
    this.pos = pos;
    this.index = 0;
    this.current = this.buildCurrent();
  }

  rotate() {
    if (this.index >= this.orientations.length - 1) {
      this.index = 0;
    } else {
      this.index++;
    }

    var colour = this.current.children[0].material.color
    this.current = this.buildCurrent(colour);
  }

  buildCurrent(colour) {
    var cubes = [];

    // If no colour given, get random colour
    if (typeof colour == "undefined") { 
      colour = getRandomColour();
    }

    var shape = this.orientations[this.index];
  
    // Each shape is a list of coordinates for each cube in block
    for (var j = 0; j < shape.length; j++) {
      cubes.push(createCube(cubeSize, colour));

      // Set position of cube using shape positions
      cubes[j].position.set(
        this.pos.x, 
        this.pos.y + shape[j][0], 
        this.pos.z + shape[j][1]);
    }
  
    var block = new THREE.Group();
    // Group the cubes together into a single block to return
    for (var k = 0; k < cubes.length; k++) {
      block.add(cubes[k]);
    }
    return block;
  }

  updatePos(newPos) {
    this.pos = newPos;

    var shape = this.orientations[this.index];
  
    // Each shape is a list of coordinates for each cube in block
    for (var i = 0; i < shape.length; i++) {
      // Set new position of cube using shape positions
      this.current.children[i].position.set(
        this.pos.x, 
        this.pos.y + shape[i][0], 
        this.pos.z + shape[i][1]);
    }
  }

}