# 3D-Tetris
 
After a University coursework involving the use of the Three.js library. As this was my first time using JavaScript, I wanted to consolidate my what I'd learned and extend my experience of Javascript and Three.js.

#### Project Aims:
- Create a working (and fun) 3D game of Tetris
- Expand and consolidate knowledge of Javascript and Three.js

#### What I Learned:
- Vector translations in Javascript
- Queue structures in Javascript
- Use of multiple scenes using different lighting in Three.js

![3D-tetris](https://user-images.githubusercontent.com/41476809/143850911-6bbd3d80-8bcb-4c73-8df4-74d1f438a291.png)

-------------------------------------------------------

## Getting Started
Run the tetris.html file to play in a browser.

### How to Play
- Use the arrow keys to move the tetris block left, right and down.
- Press R to rotate the block. (to implement)
- Drag the mouse to orbit the camera and change your viewing angle.
- When a block is placed, the game score is incremented. (to implement)
- When a row of the game area is filled, the row is destroyed and a bonus is added to the game score. (to implement)
- The next three blocks are displayed along the side of the game area.
- The game finishes when a block settles at or above the red finish line.

## How it Works
The tetris blocks are build from groups of smaller cubes. They are added to a scene with multiple lighting effects. Every seconds, the cubes a block is composed of have their y-axis position lowered by 1. When a block reaches the floor or another block, and cannot lower any further, the queue of blocks is updates and the next block is translated to the starting position.

