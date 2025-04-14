export function spawnTouchingSpheres(sceneEl, onComplete) {
  const spherePositions = [
    { x: 0, y: 1.5, z: -1 },
    { x: 0.2, y: 1.3, z: -1.5 },
    { x: -0.2, y: 1.8, z: -1 },
    { x: 0.3, y: 1.5, z: -1.2 },
    { x: -0.3, y: 1.8, z: -1.4 },
    { x: 0.1, y: 1.6, z: -1.1 },
    { x: -0.1, y: 1.7, z: -1.3 },
    { x: 0, y: 1.5, z: -1.4 },
    { x: 0, y: 1.6, z: -1.1 },
    { x: -0.25, y: 1.6, z: -1.1 },
    { x: 0.15, y: 1.55, z: -1.3 },
    { x: -0.15, y: 1.55, z: -1.3 }
  ];

  let index = 0;

  function spawnNextSphere() {
    if (index >= spherePositions.length) {
      console.log("All spheres touched and removed.");
      if (onComplete) onComplete(); // 完成后调用回调
      return;
    }

    const pos = spherePositions[index];
    const sphere = document.createElement("a-sphere");

    sphere.setAttribute("position", `${pos.x} ${pos.y} ${pos.z}`);
    sphere.setAttribute("radius", "0.1");
    sphere.setAttribute("color", "white");
    sphere.setAttribute("class", "touchingSphere");
    sphere.setAttribute("dynamic-body", "mass: 0");
    sphere.setAttribute("collision-filter", "collisionForces: false");
    sphere.setAttribute("hoverable", "");
    sphere.setAttribute("disappear-on-touch", "");

    // 触摸后生成下一个球
    sphere.addEventListener("sphere-touched", () => {
      console.log(`Sphere ${index + 1} touched and removed.`);
      index++;
      spawnNextSphere();
    });

    sceneEl.appendChild(sphere);
    console.log(`Sphere ${index + 1} spawned.`);
  }

  spawnNextSphere();
}
