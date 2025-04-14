AFRAME.registerComponent('disappear-on-touch', {
  init: function () {
    const removeIfHand = (evt) => {
      let target;
  
      if (evt.detail && evt.detail.targetEl)
        target = evt.detail.targetEl;
      else if (evt.detail && evt.detail.body && evt.detail.body.el)
        target = evt.detail.body.el;
  
      if (!target) { return; }
  
      if (target.id === 'leftHand' || target.id === 'rightHand') {
  
        this.el.emit('sphere-touched');

        const gamepad = target.components['tracked-controls']?.controller;
        if (gamepad && gamepad.hapticActuators && gamepad.hapticActuators.length > 0) {
          try {
            gamepad.hapticActuators[0].pulse(0.5, 100); //  0.5，duration 100ms
          } catch (err) {
            console.warn("Haptics error:", err);
          }
        }

        const soundEntity = document.querySelector("#touchSound");
        if (soundEntity) {
          soundEntity.emit("play-sound");
        }
  
        // 延时后移除，避免碰撞过程中出现问题
        setTimeout(() => {
          if (this.el.parentNode) {
            this.el.parentNode.removeChild(this.el);
          }
        }, 0);
      }
    };
  
    this.el.addEventListener('collide', removeIfHand);
  }
});
