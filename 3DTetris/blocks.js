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

/* Pairs of (y, x) values to be added to the first cubes coordinates to create 
   the coordinates of a new cube in the block.
   Cube 1 found in the centre of the block as it is the centre point and so the 
   rotation point. */

/*  2
    1
    3 4
*/
const L1 = [[0, 0], [1, 0], [-1, 0], [-1, -1]]
/* Clockwise rotations */
/*  3 1 2
    4 
*/
const L2 = [[0, 0], [0, -1], [0, 1], [-1, 1]]
/*  4 3
      1
      2
*/
const L3 = [[0, 0], [-1, 0], [1, 0], [1, 1]]
/*      4
    2 1 3
*/
const L4 = [[0, 0], [0, -1], [1, 0], [1, 1]]


/*    2
      1
    4 3
*/
const bkwdsL1 = [[0, 0], [1, 0], [-1, 0], [-1, 1]]
/* Clockwise rotations */
/*  4
    3 1 2
*/
const bkwdsL2 = [[0, 0], [0, -1], [0, 1], [1, 1]]
/*  3 4
    1
    2
*/
const bkwdsL3 = [[0, 0], [1, 0], [-2, 0], [-2, 1]]
/*  2 1 3
        4
*/
const bkwdsL4 = [[0, 0], [0, 1], [0, -1], [-1, -1]]


/*  2
    1
    3
    4
*/
const line1 = [[0, 0], [1, 0], [-1, 0], [-2, 0]]
/*  2 1 3 4
*/
const line2 = [[0, 0], [0, 1], [0, -1], [0, -2]]


/*  1 2
    3 4
*/
const square1 = [[0, 0], [0, -1], [-1, 0], [-1, -1]]


/*  2
    1 3
      4
*/
const S1 = [[0, 0], [-1, 0], [-1, -1], [-2, -1]]
/*    1 2
    4 3
*/
const S2 = [[0, 0], [0, -1], [-1, 0], [-1, 1]]


/*    2 
    3 1 
    4  
*/
const bkwdsS1 = [[0, 0], [-1, 0], [-1, 1], [-2, 1]]
/*  4 3
      1 2
*/
const bkwdsS2 = [[0, 0], [0, -1], [1, 0], [1, 1]]

/*    3 
    2 1 4 
*/
const T1 = [[0, 0], [-1, 1], [-1, 0], [-1, -1]]
/*  2 
    1 3
    4 
*/
const T2 = [[0, 0], [1, 0], [0, -1], [-1, 0]]
/*  4 1 2
      3 
*/
const T3 = [[0, 0], [0, -1], [-1, 0], [0, 1]]
/*    4
    3 1
      2
*/
const T4 = [[0, 0], [-1, 0], [0, 1], [1, 0]]


function createBlock(startPos, shapePos) {
  var block = new THREE.Group();
  var cubes = [];
  var colour = getRandomColour();

  for (j = 0; j < shapePos.length; j++) {
    cubes.push(createCube(cubeSize, colour));

    // Set position using shape positions
    cubes[j].position.set(
      startPos.x, 
      startPos.y + shapePos[j][0], 
      startPos.z + shapePos[j][1]);
  }

  // Group the cubes together into a single block to return
  for (k = 0; k < cubes.length; k++) {
    block.add(cubes[k]);
  }
  return block;
}

/*  2
    1
    3 4
*/
function createL1(startPos) {
  return createBlock(startPos, L1)
}


/*    2
      1
    4 3
*/
function createBkwdsL1(startPos) {
  return createBlock(startPos, bkwdsL1);
}

/*  2
    1
    3
    4
*/
function createLine1(startPos) {
  return createBlock(startPos, line1);
}

/*  1 2
    3 4
*/
function createSquare1(startPos) {
  return createBlock(startPos, square1);
}

/*  2 
    1 3
      4
*/
function createS1(startPos) {
  return createBlock(startPos, S1);
}

/*    2 
    3 1 
    4  
*/
function createBkwdsS1(startPos) {
  return createBlock(startPos, bkwdsS1);
}

/*    3 
    2 1 4 
*/
function createT1(startPos) {
  return createBlock(startPos, T1);
}

/* Selects a random block from the Tetris collection */
function randomBlock(startPos) {
  random = Math.ceil(Math.random() * 7);
  switch (random) {
    case 1:
      return createL1(startPos);
    case 2:
      return createBkwdsL1(startPos);
    case 3:
      return createLine1(startPos);
    case 4:
      return createSquare1(startPos);
    case 5:
      return createS1(startPos);
    case 6:
      return createBkwdsS1(startPos);
    case 7:
      return createT1(startPos);
  }
}