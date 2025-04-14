// cube.js

export function createCubeTrial(sceneEl) {
    // Remove existing cubes.
    const existingCubes = sceneEl.querySelectorAll(".cube");
    existingCubes.forEach(cube => sceneEl.removeChild(cube));
  
    // Remove any existing target.
    const existingTarget = sceneEl.querySelector(".target");
    if (existingTarget && existingTarget.parentNode) {
      sceneEl.removeChild(existingTarget);
    }
  
    // Create the red target entity.
    const target = document.createElement("a-entity");
    target.setAttribute("material", "color: red");
    target.setAttribute("mixin", "target");
    target.setAttribute("geometry", "primitive: box; width: 0.5; height: 0.5; depth: 0.5"); // 👈 调整大小
    target.setAttribute("class", "target");
    target.setAttribute("position", "1 1.4 -1");
    sceneEl.appendChild(target);
  
    // Define positions for green cubes.
    const cubePositions = [
      { x: 0,    y: 1.6, z: -1.25 },
      { x: 0.3,  y: 1.6, z: -1.25 },
      { x: -0.3, y: 1.6, z: -1.25 },
      { x: 0,    y: 1.6, z: -1.55 },
      { x: 0,    y: 1.6, z: -0.95 },
    ];
  
    const cubes = [];
    cubePositions.forEach(pos => {
      const cube = document.createElement("a-entity");
      cube.setAttribute("material", "color: green");
      cube.setAttribute("mixin", "cube");
      cube.setAttribute("class", "cube");
      cube.setAttribute("position", `${pos.x} ${pos.y} ${pos.z}`);
      cube.setAttribute("vibrate-on-touch", ""); // vibration
      sceneEl.appendChild(cube);
      cubes.push(cube);
    });
  
    return { cubes, target };
  }
  