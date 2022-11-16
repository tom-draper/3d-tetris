/* A class extending THREE.Group adding instructions to build a tetris block and
   the ability to cycle through different orinentations of blocks */

class Block extends THREE.Group {
  constructor(pos, orientations) {
    super();
    // List of lists of (x,y) coordinates, describing a block for each orientation
    this.orientations = orientations;
    this.pos = pos;  // The position of the first cube in the current block
    this.index = 0;  // The index of the current orientation in use
    this.current = this.buildCurrent();  // A Group object of cubes
  }

  /* Rotates the current block clockwise */
  rotate() {
    // Cycle through to the next orientation index
    if (this.index >= this.orientations.length - 1) {
      this.index = 0;
    } else {
      this.index++;
    }

    // Build new current block of the same colour
    var colour = this.current.children[0].material.color
    this.current = this.buildCurrent(colour);
  }

  /* A basic cube used to create any block */
  createCube(size, colour) {
    var geometry = new THREE.BoxGeometry(size, size, size);
    var material = new THREE.MeshPhongMaterial({ color: colour });
    var cube = new THREE.Mesh(geometry, material);

    return cube;
  }

  /* Creates and returns a random colour hex code */
  getRandomColour() {
    var letters = "0123456789ABCDEF";
    var colour = "#";
    for (var i = 0; i < 6; i++) {
      colour += letters[Math.floor(Math.random() * 16)];
    }
    return colour;
  }

  /* Builds the current block using current index and optional colour */
  buildCurrent(colour) {
    var cubes = [];

    // If no colour given, get random colour
    if (typeof colour == "undefined") { 
      colour = this.getRandomColour();
    }

    var shape = this.orientations[this.index];
  
    // Each shape is a list of coordinates for each cube in block
    for (var j = 0; j < shape.length; j++) {
      cubes.push(this.createCube(cubeSize, colour));

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

  /* Updates the class position of the first cube in the current block
     as well as positions of all children cubes in the current block */
  updatePos(newPos) {
    this.pos = newPos;  // Update class position

    var shape = this.orientations[this.index];
  
    // Update position of children cubes
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