// Joystick movement component: moves the rig based on thumbstick input on the left controller.
AFRAME.registerComponent("joystick-movement", {
    schema: { speed: { type: "number", default: 1.5 } },
    init() {
      this.joystick = { x: 0, y: 0 };
      document.querySelector("#leftHand").addEventListener("thumbstickmoved", evt => {
        this.joystick = { x: evt.detail.x, y: evt.detail.y };
      });
    },
    tick(time, deltaTime) {
      const dt = deltaTime / 1000;
      const rigEl = this.el;
      const camera = document.querySelector("[camera]");
      if (!camera) return;
    
      // Get the camera's Y-axis rotation (world direction)
      const cameraObj = camera.object3D;
      const cameraDirection = new THREE.Vector3();
      cameraObj.getWorldDirection(cameraDirection);
      cameraDirection.y = 0; // Flatten to horizontal plane
      cameraDirection.normalize();
    
      // Calculate a right vector (perpendicular to forward)
      const rightVector = new THREE.Vector3().crossVectors(
        new THREE.Vector3(0, 1, 0),
        cameraDirection
      );      
    
      // Calculate movement vector
      const moveVector = new THREE.Vector3()
        .addScaledVector(cameraDirection, this.joystick.y)
        .addScaledVector(rightVector, this.joystick.x)
        .multiplyScalar(this.data.speed * dt);
    
      // Apply movement to rig
      rigEl.object3D.position.add(moveVector);
    }    
  });