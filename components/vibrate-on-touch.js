AFRAME.registerComponent('vibrate-on-touch', {
    init: function () {
      this.el.addEventListener('collide', (evt) => {
        let target;
  
        if (evt.detail?.targetEl) {
          target = evt.detail.targetEl;
        } else if (evt.detail?.body?.el) {
          target = evt.detail.body.el;
        }
  
        if (!target) return;
  
        if (target.id === 'leftHand' || target.id === 'rightHand') {
          const gamepad = target.components['tracked-controls']?.controller;
          if (gamepad?.hapticActuators?.length > 0) {
            try {
              gamepad.hapticActuators[0].pulse(0.7, 80); // 强度 0.7，持续 80ms
            } catch (err) {
              console.warn("Cube haptic error:", err);
            }
          }
        }
      });
    }
  });
  