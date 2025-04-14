// main.js
import { createCubeTrial } from './cube.js';
import { spawnTouchingSpheres } from './sphere.js';

AFRAME.registerSystem("trial-manager", {
  init() {
    this.STATES = {
      WELCOME: "WELCOME",
      DATANOTICE: "DATANOTICE",  // New state added.
      MOVINGOBJECT: "MOVINGOBJECT",
      TOUCHINGOBJECT: "TOUCHINGOBJECT",
      FINISH: "FINISH"
    };

    this.experimentState = this.STATES.WELCOME;
    this.trialCounter = 0;
    this.totalTrials = 5;
    this.currentCubes = [];
    this.currentTarget = null;
    this.uiTextEl = document.querySelector("#uiText");
    this.sceneEl = this.el;

    // Set up controller event listeners.
    const rightHandEl = document.querySelector("#rightHand");
    rightHandEl.addEventListener("gripdown", () => {
      if (this.experimentState === this.STATES.WELCOME) {
        console.log("Right controller grip pressed in WELCOME. Transitioning to DATANOTICE.");
        this.enterState(this.STATES.DATANOTICE);
      } else if (this.experimentState === this.STATES.DATANOTICE) {
        console.log("Right controller grip pressed in DATANOTICE. Transitioning to MOVINGOBJECT.");
        this.enterState(this.STATES.MOVINGOBJECT);
      }
    });

    this.enterState(this.experimentState);
  },

  updateUIText(text) {
    if (this.uiTextEl) {
      this.uiTextEl.setAttribute("value", text);
    }
  },

  enterState(state) {
    this.experimentState = state;
    switch (state) {
      case this.STATES.WELCOME:
        this.updateUIText("Welcome!\n\nIn this experiment, you will complete two tasks. \n\nPress the right controller grip to continue.");
        //setTimeout(() => {
          //this.enterState(this.STATES.DATANOTICE);
        //}, 1000);
        break;

      case this.STATES.DATANOTICE:
        this.updateUIText("We will collect your data while you finish the tasks. \n\nPress the right controller grip to begin.");
        //setTimeout(() => {
          // Directly jump to the TOUCHINGOBJECT state for demonstration.
          //this.enterState(this.STATES.TOUCHINGOBJECT);
        //}, 1000);

        break; 

      case this.STATES.MOVINGOBJECT:
        this.updateUIText(`Trial ${this.trialCounter + 1}:\nGrab the green cube and move it to the red target area.`);
        // Use the external cube function.
        const { cubes, target } = createCubeTrial(this.sceneEl);
        this.currentCubes = cubes;
        this.currentTarget = target;
        this.detectionStartTime = Date.now() + 300;
        break;
      
      case this.STATES.TOUCHINGOBJECT:
        this.updateUIText("Trial Complete!\n\nGet ready...");
        setTimeout(() => {
          spawnTouchingSpheres(this.sceneEl, () => {
            console.log("✅ All spheres touched and removed — entering FINISH state.");
            this.enterState(this.STATES.FINISH);
          });
          this.updateUIText("Trial 2:\nNow, use either hand to touch the sphere.");
        }, 3000);
        break;   

      case this.STATES.FINISH:
        this.updateUIText("Task completed!\n\nThank you for participating!\n\nPlease use a computer to fill out the questionnaire:\nhttps://rb.gy/177ay7");
        break;
    }
  },

  completeTrial() {
    this.trialCounter++;
    if (this.trialCounter >= this.totalTrials) {
      this.enterState(this.STATES.FINISH);
    } else {
      this.enterState(this.STATES.MOVINGOBJECT);
    }
  },

  tick() {
    if (!this.sceneEl.is("vr-mode")) return;

    if (this.experimentState === this.STATES.MOVINGOBJECT && this.currentTarget) {
      if (this.detectionStartTime && Date.now() < this.detectionStartTime) {
        return;
      }

      this.currentTarget.object3D.updateMatrixWorld(true);
      const targetPos = new THREE.Vector3();
      this.currentTarget.object3D.getWorldPosition(targetPos);

      // Update each cube's position and check the distance to the target.
      for (let i = this.currentCubes.length - 1; i >= 0; i--) {
        const cube = this.currentCubes[i];
        cube.object3D.updateMatrixWorld(true);
        const cubePos = new THREE.Vector3();
        cube.object3D.getWorldPosition(cubePos);
        const distance = cubePos.distanceTo(targetPos);

        // Remove cube if close enough to the target.
        if (distance < 0.15) {
          console.log(`Cube ${i} removed, distance ${distance}`);
          if (cube.parentNode) {
            this.sceneEl.removeChild(cube);
          }
          this.currentCubes.splice(i, 1);
        }
      }

      // When all cubes have been removed, clear the target and move to the next state.
      if (this.currentCubes.length === 0) {
        console.log("All cubes cleared, entering TOUCHINGOBJECT state");
        if (this.currentTarget.parentNode) {
          this.sceneEl.removeChild(this.currentTarget);
        }
        this.currentTarget = null;
        this.enterState(this.STATES.TOUCHINGOBJECT);
      }
    }
  }
});
