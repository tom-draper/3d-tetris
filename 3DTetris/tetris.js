var scene, camera, radius;
var activeBlocks = [];
var cubeSize = 1;
var gameWidth = 30;
var gameHeight = 25;
var gameOver = false;
// Queue for the next blocks
var blockQueue = [];
var c = 5;   // Added starting height of a block over the finish line
var gap = 6; // Gap between future blocks
var positionQueue = [
  new THREE.Vector3(0, gameHeight - cubeSize / 2 + c, 0),
  new THREE.Vector3(0, gameHeight - cubeSize / 2, -18),
  new THREE.Vector3(0, gameHeight - cubeSize / 2 - gap, -18),
  new THREE.Vector3(0, gameHeight - cubeSize / 2 - 2 * gap, -18)
];
var sceneQueue = [
  new THREE.AmbientLight((intensity = 1)),
  new THREE.AmbientLight((intensity = 0.7)),
  new THREE.AmbientLight((intensity = 0.5)),
  new THREE.AmbientLight((intensity = 0.2))
];
// Controls
var mouseDown = false;
var startMouseX, startMouseY, mouseX, mouseY;
startMouseX = mouseX = startMouseY = mouseY = 0;
var startTheta, theta, startPhi, phi;
startTheta = theta = 180;
startPhi = phi = 74;
var radius;
var previous;

init();
animate();

// Listen for keyboard events, to react to them.
document.addEventListener("keydown", handleKeyDown);
document.addEventListener("mousemove", handleMouseMove);
document.body.addEventListener(
  "mousedown",
  function(event) {
    event.preventDefault();
    mouseDown = true;
    startMouseX = event.clientX;
    startMouseY = event.clientY;
    startTheta = theta;
    startPhi = phi;
  },
  false
);
document.addEventListener(
  "mouseup",
  function(event) {
    event.preventDefault();
    mouseDown = false;
    startMouseX = event.clientX - startMouseX;
    startMouseY = event.clientY - startMouseY;
  },
  false
);

function init() {
  sceneMain = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(50, 40, 0);
  camera.lookAt(new THREE.Vector3(0, gameHeight / 2, 0));

  radius = Math.sqrt(
    Math.pow(camera.position.x, 2) +
      Math.pow(camera.position.y, 2) +
      Math.pow(camera.position.z, 2)
  );

  // Draw a helper grid in the x-z plane.
  sceneMain.add(new THREE.GridHelper(30, 60, 0xffffff));

  // Create vertical grid
  var lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
  for (x = -0.5; x <= 0.5; x++) {
    // Create vertical lines
    for (i = -14.5; i <= 14.5; i++) {
      var geometry = new THREE.Geometry();
      geometry.vertices.push(new THREE.Vector3(x, gameHeight * 1.5 - 0.5, i));
      geometry.vertices.push(new THREE.Vector3(x, 0, i));
      var line = new THREE.Line(geometry, lineMaterial);
      sceneMain.add(line);
    }
    // Create horizonal lines
    for (i = 0; i <= gameHeight * 1.5; i++) {
      var geometry = new THREE.Geometry();
      if (i == gameHeight) {
        lineMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });
      }
      geometry.vertices.push(new THREE.Vector3(x, i, -14.5));
      geometry.vertices.push(new THREE.Vector3(x, i, 14.5));
      var line = new THREE.Line(geometry, lineMaterial);
      sceneMain.add(line);
      if (i == gameHeight) {
        lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
      }
    }
  }
  // Join front and back vertical grid with lines along the sides
  for (z = -14.5; z <= 14.5; z = z + 29) {
    for (y = 1; y <= gameHeight * 1.5; y++) {
      if (y == gameHeight) {
        lineMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });
      }
      var geometry = new THREE.Geometry();
      geometry.vertices.push(new THREE.Vector3(-0.5, y, z));
      geometry.vertices.push(new THREE.Vector3(0.5, y, z));
      var line = new THREE.Line(geometry, lineMaterial);
      sceneMain.add(line);
      if (y == gameHeight) {
        lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
      }
    }
  }
  // Join front and back vertical grid with lines across the top
  for (z = -13.5; z <= 13.5; z++) {
    var geometry = new THREE.Geometry();
    geometry.vertices.push(new THREE.Vector3(-0.5, gameHeight * 1.5 - 0.5, z));
    geometry.vertices.push(new THREE.Vector3(0.5, gameHeight * 1.5 - 0.5, z));
    var line = new THREE.Line(geometry, lineMaterial);
    sceneMain.add(line);
  }

  // Add directional lighting to scene.
  var directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
  directionalLight.position.x = 10;
  directionalLight.position.y = 10;
  directionalLight.position.z = 0;
  directionalLight.intensity = 1.5;
  sceneMain.add(directionalLight);
  var ambientLight = new THREE.AmbientLight();
  ambientLight.intensity = 0.2;
  sceneMain.add(ambientLight);

  // Create a queue of scenes with different lighting for blocks in the queue
  // Scene 1 - high intensity lighting, for block in the front of the queue
  var scene1 = new THREE.Scene();
  var intensity1 = 0.8;
  var lighting1 = new THREE.AmbientLight(0xf5f5f5, intensity1);
  var directional1 = new THREE.DirectionalLight(0xf5f5f5, intensity1);
  scene1.add(lighting1);
  scene1.add(directional1);

  // Scene 2 - medium intensity lighting, for block second in the queue
  var scene2 = new THREE.Scene();
  var intensity2 = 0.5;
  var lighting2 = new THREE.AmbientLight(0xf5f5f5, intensity2);
  var directional2 = new THREE.DirectionalLight(0xf5f5f5, intensity2);
  scene2.add(lighting2);
  scene2.add(directional2);

  // Scene 3 - low intensity lighting, for block third in the queue
  var scene3 = new THREE.Scene();
  var intensity3 = 0.2;
  var lighting3 = new THREE.AmbientLight(0xf5f5f5, intensity3);
  var directional3 = new THREE.DirectionalLight(0xf5f5f5, intensity3);
  scene3.add(lighting3);
  scene3.add(directional3);

  // Add scenes to scene queue
  sceneQueue[0] = sceneMain;
  sceneQueue[1] = scene1;
  sceneQueue[2] = scene2;
  sceneQueue[3] = scene3;

  // Set up the Web GL renderer.
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.autoClear = false;
  document.body.appendChild(renderer.domElement);

  // Handle resizing of the browser window.
  window.addEventListener("resize", handleResize, false);
  initialiseGame();
}

/* Checks whether it's been a seconds since last called this funciton */
function beenASecond() {
  var toWait = 500; /* i.e. 1 second */
  var now = new Date().getTime();
  if (now > previous + toWait) {
    previous = now; // Records time to global variable
    return true;
  }
  return false;
}

/* Loops to animate the scene */
function animate() {
  requestAnimationFrame(animate);

  if (!gameOver) {
    if (beenASecond()) {
      if (moveDown()) {
        updateGameOver();
        if (!gameOver) {
          updateQueue();
        } else {
          alert("Game Over!");
        }
      }
    }
  }

  // Render the current scene to the screen.
  renderer.clear();
  for (j = 0; j < sceneQueue.length; j++) {
    renderer.render(sceneQueue[j], camera);
  }
}

/* Checks whether the game is over */
function updateGameOver() {
  currentBlock = activeBlocks.pop();
  for (i = 0; i < currentBlock.children.length; i++) {
    if (currentBlock.children[i].position.y >= gameHeight - cubeSize / 2) {
      gameOver = true;
    }
  }
  activeBlocks.push(currentBlock);
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

// Translates a blocks children to a new position
function translateBlock(block, newPos) {
  // Create translation vector
  vector = new THREE.Vector3(
    newPos.x - block.children[0].position.x,
    newPos.y - block.children[0].position.y,
    newPos.z - block.children[0].position.z
  );
  // Translate each cube within the block by the vector
  for (j = 0; j < block.children.length; j++) {
    block.children[j].position.add(vector);
  }
}

/* Move along each block in the queue */
function updateQueue() {
  // Move each block down the queue and change scene
  for (i = 1; i < positionQueue.length; i++) {
    sceneQueue[i].remove(blockQueue[i]); // Remove from current scene
    sceneQueue[i - 1].add(blockQueue[i]); // Upgrade to next scene
    translateBlock(
      blockQueue[i],
      new THREE.Vector3(
        positionQueue[i - 1].x,
        positionQueue[i - 1].y,
        positionQueue[i - 1].z
      )
    );
    blockQueue[i - 1] = blockQueue[i]; // Move along in the queue
  }
  // Add block at front of queue to active blocks
  activeBlocks.push(blockQueue[0]);
  // Add a new block to end of queue
  blockQueue[positionQueue.length - 1] = randomBlock(
    positionQueue[positionQueue.length - 1]
  );
  sceneQueue[positionQueue.length - 1].add(
    blockQueue[positionQueue.length - 1]
  );
}

/* Create a new random block for each position in the queue */
function fillQueue() {
  for (i = 0; i < positionQueue.length; i++) {
    block = randomBlock(positionQueue[i]);
    sceneQueue[i].add(block); // Add to correct scene
    blockQueue[i] = block; // Add to block queue
  }
  activeBlocks.push(blockQueue[0]);
}

/* Initialise the game with the first block
    and takes first time recording */
function initialiseGame() {
  fillQueue();
  moveDown();
  previous = new Date().getTime(); //Record starting time for beenASecond func
}

/* Handle resizing of the browser window. */
function handleResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}


// ----------Create blocks---------------

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

/*   1 
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


// ------------Move block----------------

/* Move the current block either left or right depending on input */
function moveLeftRight(direction) {
  currentBlock = activeBlocks.pop();
  halt = false;

  add = 0;
  if (direction == "left") {
    add = 1; // Used later
    // Check if at left edge of game space
    for (i = 0; i < currentBlock.children.length; i++) {
      if (currentBlock.children[i].position.z >= gameWidth / 2 - 1) {
        halt = true;
      }
    }
  } else if (direction == "right") {
    add = -1; // Used later
    // Check at right edge of game space
    for (i = 0; i < currentBlock.children.length; i++) {
      if (-currentBlock.children[i].position.z >= gameWidth / 2 - 1) {
        halt = true;
      }
    }
  }

  if (!halt) {
    // With every other block in the blocks list
    check: for (x = 0; x < activeBlocks.length; x++) {
      checkBlock = activeBlocks[x];
      // Check checkBlocks children position against potential position
      // of currentBlocks children
      for (i = 0; i < currentBlock.children.length; i++) {
        var newPosition = new THREE.Vector3();
        newPosition = JSON.parse(
          JSON.stringify(currentBlock.children[i].position)
        );
        newPosition.z = newPosition.z + add;
        for (j = 0; j < checkBlock.children.length; j++) {
          // If positions would be equal, currentBlock cannot move across
          if (
            newPosition.x == checkBlock.children[j].position.x &&
            newPosition.y == checkBlock.children[j].position.y &&
            newPosition.z == checkBlock.children[j].position.z
          ) {
            // Sideways position is already occupied by block
            halt = true;
            break check;
          }
        }
      }
    }
  }

  // Move currentBlock one space down
  if (!halt) {
    for (i = 0; i < currentBlock.children.length; i++) {
      currentBlock.children[i].position.z =
        currentBlock.children[i].position.z + add;
    }
  }

  activeBlocks.push(currentBlock); // Push modified block back on stack

  return halt; // Return whether hit a wall
}

/* Move the current block down a block */
function moveDown() {
  currentBlock = activeBlocks.pop();
  halt = false;
  // Check if block has hit the floor
  for (i = 0; i < currentBlock.children.length; i++) {
    if (currentBlock.children[i].position.y <= cubeSize / 2) {
      // Block has hit floor
      halt = true;
    }
  }

  if (!halt) {
    // With every other block in the blocks list
    check: for (x = 0; x < activeBlocks.length; x++) {
      checkBlock = activeBlocks[x];
      // Check checkBlocks children against currentBlocks children
      for (i = 0; i < currentBlock.children.length; i++) {
        var newPosition = new THREE.Vector3();
        newPosition = JSON.parse(
          JSON.stringify(currentBlock.children[i].position)
        );
        newPosition.y = newPosition.y - 1;
        for (j = 0; j < checkBlock.children.length; j++) {
          // If positions would be equal, currentBlock cannot move down
          if (
            newPosition.x == checkBlock.children[j].position.x &&
            newPosition.y == checkBlock.children[j].position.y &&
            newPosition.z == checkBlock.children[j].position.z
          ) {
            // Downwards position is already occupied by block
            halt = true;
            break check;
          }
        }
      }
    }
  }

  // Move currentBlock one space down
  if (!halt) {
    for (i = 0; i < currentBlock.children.length; i++) {
      currentBlock.children[i].position.y =
        currentBlock.children[i].position.y - 1;
    }
  }

  activeBlocks.push(currentBlock); // Push modified block back on stack
  return halt; // Return whether hit the floor
}

function rotateBlock() {
  currentBlock = activeBlocks.pop();

  console.log(currentBlock);
  activeBlocks.push(currentBlock); // Push modified block back on stack
}


// ------------Button controls-------------

/* Handle keyboard presses */
function handleKeyDown(event) {
  if (!gameOver) {
    switch (event.keyCode) {
      case 37: // Left arrow
        moveLeftRight("left");
        break;
      case 39: // Right arrow
        moveLeftRight("right");
        break;
      case 40: // Down arrow
        moveDown();
        break;
      case 82: // R
        rotateBlock();
        break;
    }
  }
}

/* Control camera orbit */
function handleMouseMove(event) {
  if (mouseDown) {
    theta = -((event.clientX - startMouseX) * 0.5) + startTheta;
    phi = Math.min(
      180,
      Math.max(0, (event.clientY - startMouseY) * 0.5 + startPhi)
    );

    camera.position.x =
      radius *
      Math.sin((theta * Math.PI) / 360) *
      Math.cos((phi * Math.PI) / 360);
    camera.position.y = radius * Math.sin((phi * Math.PI) / 360);
    camera.position.z =
      radius *
      Math.cos((theta * Math.PI) / 360) *
      Math.cos((phi * Math.PI) / 360);
    camera.lookAt(new THREE.Vector3(0, gameHeight / 2, 0));
    camera.updateMatrix();
  }
}
