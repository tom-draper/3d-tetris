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
const L4 = [[0, 0], [0, -1], [0, 1], [1, 1]]


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
const bkwdsL4 = [[0, 0], [0, -1], [0, 1], [-1, -1]]


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
/*  2 r
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

/*  2
    1
    3 4
*/
function createL(startPos) {
  return new Block(startPos, [L1, L2, L3, L4])
}

/*    2
      1
    4 3
*/
function createBkwdsL(startPos) {
  return new Block(startPos, [bkwdsL1, bkwdsL2, bkwdsL3, bkwdsL4]);
}

/*  2
    1
    3
    4
*/
function createLine(startPos) {
  return new Block(startPos, [line1, line2]);
}

/*  1 2
    3 4
*/
function createSquare(startPos) {
  return new Block(startPos, [square1]);
}

/*  2 
    1 3
      4
*/
function createS(startPos) {
  return new Block(startPos, [S1, S2]);
}

/*    2 
    3 1 
    4  
*/
function createBkwdsS(startPos) {
  return new Block(startPos, [bkwdsS1, bkwdsS2]);
}

/*    3 
    2 1 4 
*/
function createT(startPos) {
  return new Block(startPos, [T1, T2, T3, T4]);
}

/* Selects a random block from the Tetris collection */
function randomBlock(startPos) {
  random = Math.ceil(Math.random() * 7);
  switch (random) {
    case 1:
      return createL(startPos);
    case 2:
      return createBkwdsL(startPos);
    case 3:
      return createLine(startPos);
    case 4:
      return createSquare(startPos);
    case 5:
      return createS(startPos);
    case 6:
      return createBkwdsS(startPos);
    case 7:
      return createT(startPos);
  }
}
