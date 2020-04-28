/* A basic cube used to create any block */
function createCube(size, colour) {
  var geometry = new THREE.BoxGeometry(size, size, size);
  var material = new THREE.MeshPhongMaterial({ color: colour });
  var cube = new THREE.Mesh(geometry, material);

  return cube;
}

/* Creates and returns a random colour hex code */
function getRandomColour() {
  var letters = "0123456789ABCDEF";
  var colour = "#";
  for (var i = 0; i < 6; i++) {
    colour += letters[Math.floor(Math.random() * 16)];
  }
  return colour;
}

/*  1
    2
    3 4
*/
function createL(startPos) {
  var block = new THREE.Group();
  var cubes = [];
  var colour = getRandomColour();
  for (j = 0; j < 4; j++) {
    cubes.push(createCube(cubeSize, colour));
  }
  cubes[0].position.set(startPos.x, startPos.y, startPos.z);
  cubes[1].position.set(startPos.x, startPos.y - 1, startPos.z);
  cubes[2].position.set(startPos.x, startPos.y - 2, startPos.z);
  cubes[3].position.set(startPos.x, startPos.y - 2, startPos.z - 1);
  for (k = 0; k < cubes.length; k++) {
    block.add(cubes[k]);
  }
  return block;
}

/*    1
      2
    4 3
*/
function createBackwardsL(startPos) {
  var block = new THREE.Group();
  var cubes = [];
  var colour = getRandomColour();
  for (j = 0; j < 4; j++) {
    cubes.push(createCube(cubeSize, colour));
  }
  cubes[0].position.set(startPos.x, startPos.y, startPos.z);
  cubes[1].position.set(startPos.x, startPos.y - 1, startPos.z);
  cubes[2].position.set(startPos.x, startPos.y - 2, startPos.z);
  cubes[3].position.set(startPos.x, startPos.y - 2, startPos.z - 1);
  for (k = 0; k < cubes.length; k++) {
    block.add(cubes[k]);
  };
  return block;
}

/*  1
    2
    3
    4
*/
function createLine(startPos) {
  var block = new THREE.Group();
  var cubes = [];
  var colour = getRandomColour();
  for (j = 0; j < 4; j++) {
    cubes.push(createCube(cubeSize, colour));
  }
  cubes[0].position.set(startPos.x, startPos.y, startPos.z);
  cubes[1].position.set(startPos.x, startPos.y - 1, startPos.z);
  cubes[2].position.set(startPos.x, startPos.y - 2, startPos.z);
  cubes[3].position.set(startPos.x, startPos.y - 3, startPos.z);
  for (k = 0; k < cubes.length; k++) {
    block.add(cubes[k]);
  }
  return block;
}

/*  1 2
    3 4
*/
function createSquare(startPos) {
  var block = new THREE.Group();
  var cubes = [];
  var colour = getRandomColour();
  for (j = 0; j < 4; j++) {
    cubes.push(createCube(cubeSize, colour));
  }
  cubes[0].position.set(startPos.x, startPos.y, startPos.z);
  cubes[1].position.set(startPos.x, startPos.y, startPos.z - 1);
  cubes[2].position.set(startPos.x, startPos.y - 1, startPos.z);
  cubes[3].position.set(startPos.x, startPos.y - 1, startPos.z - 1);
  for (k = 0; k < cubes.length; k++) {
    block.add(cubes[k]);
  }
  return block;
}

/*  1 
    2 3
      4
*/
function createS(startPos) {
  var block = new THREE.Group();
  var cubes = [];
  var colour = getRandomColour();
  for (j = 0; j < 4; j++) {
    cubes.push(createCube(cubeSize, colour));
  }
  cubes[0].position.set(startPos.x, startPos.y, startPos.z);
  cubes[1].position.set(startPos.x, startPos.y - 1, startPos.z);
  cubes[2].position.set(startPos.x, startPos.y - 1, startPos.z - 1);
  cubes[3].position.set(startPos.x, startPos.y - 2, startPos.z - 1);
  for (k = 0; k < cubes.length; k++) {
    block.add(cubes[k]);
  }
  return block;
}

/*    1 
    3 2 
    4  
*/
function createBackwardsS(startPos) {
  var block = new THREE.Group();
  var cubes = [];
  var colour = getRandomColour();
  for (j = 0; j < 4; j++) {
    cubes.push(createCube(cubeSize, colour));
  }
  cubes[0].position.set(startPos.x, startPos.y, startPos.z);
  cubes[1].position.set(startPos.x, startPos.y - 1, startPos.z);
  cubes[2].position.set(startPos.x, startPos.y - 1, startPos.z + 1);
  cubes[3].position.set(startPos.x, startPos.y - 2, startPos.z + 1);
  for (k = 0; k < cubes.length; k++) {
    block.add(cubes[k]);
  }
  return block;
}

/*    1 
    2 3 4 
*/
function createT(startPos) {
  var block = new THREE.Group();
  var cubes = [];
  var colour = getRandomColour();
  for (j = 0; j < 4; j++) {
    cubes.push(createCube(cubeSize, colour));
  }
  cubes[0].position.set(startPos.x, startPos.y, startPos.z);
  cubes[1].position.set(startPos.x, startPos.y - 1, startPos.z + 1);
  cubes[2].position.set(startPos.x, startPos.y - 1, startPos.z);
  cubes[3].position.set(startPos.x, startPos.y - 1, startPos.z - 1);
  for (k = 0; k < cubes.length; k++) {
    block.add(cubes[k]);
  }
  return block;
}

/* Selects a random block from the Tetris collection */
function randomBlock(startPos) {
  random = Math.ceil(Math.random() * 7);
  switch (random) {
    case 1:
      return createL(startPos);
    case 2:
      return createBackwardsL(startPos);
    case 3:
      return createLine(startPos);
    case 4:
      return createSquare(startPos);
    case 5:
      return createS(startPos);
    case 6:
      return createBackwardsS(startPos);
    case 7:
      return createT(startPos);
  }
}