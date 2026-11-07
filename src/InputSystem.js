class InputSystem {
  constructor() {
    this.keys = {};
    this.mouse = {
      x: 0,
      y: 0,
      buttons: { left: false, right: false, middle: false },
      wheel: 0
    };
    this.touches = [];
    this.cameraControl = {
      rotate: { x: 0, y: 0 },
      zoom: 1.0,
      pan: { x: 0, y: 0 }
    };

    this.initializeInput();
  }

  initializeInput() {
    // Keyboard input
    window.addEventListener('keydown', (event) => {
      this.keys[event.code] = true;

      // Handle special keys
      switch (event.code) {
        case 'Escape':
          if (window.game) window.game.gameSystems.input.handleEscape();
          break;
        case 'Tab':
          event.preventDefault();
          if (window.game) window.game.gameSystems.input.handleTab();
          break;
        case 'ControlLeft':
        case 'ControlRight':
          this.keys['CONTROL'] = true;
          break;
        case 'ShiftLeft':
        case 'ShiftRight':
          this.keys['SHIFT'] = true;
          break;
      }
    });

    window.addEventListener('keyup', (event) => {
      this.keys[event.code] = false;

      // Handle special keys
      switch (event.code) {
        case 'ControlLeft':
        case 'ControlRight':
          this.keys['CONTROL'] = false;
          break;
        case 'ShiftLeft':
        case 'ShiftRight':
          this.keys['SHIFT'] = false;
          break;
      }
    });

    // Mouse input
    window.addEventListener('mousemove', (event) => {
      this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      if (window.game) {
        window.game.gameSystems.input.handleMouseMove(event);
      }
    });

    window.addEventListener('mousedown', (event) => {
      this.mouse.buttons[`${['left', 'middle', 'right'][event.button]}`] = true;

      if (window.game) {
        window.game.gameSystems.input.handleMouseDown(event);
      }
    });

    window.addEventListener('mouseup', (event) => {
      this.mouse.buttons[`${['left', 'middle', 'right'][event.button]}`] = false;

      if (window.game) {
        window.game.gameSystems.input.handleMouseUp(event);
      }
    });

    window.addEventListener('wheel', (event) => {
      this.mouse.wheel += event.deltaY * 0.001;

      if (window.game) {
        window.game.gameSystems.input.handleMouseWheel(event);
      }
    });

    // Touch input for mobile
    window.addEventListener('touchstart', (event) => {
      event.preventDefault();
      for (let i = 0; i < event.touches.length; i++) {
        this.touches.push({
          id: event.touches[i].identifier,
          x: event.touches[i].clientX,
          y: event.touches[i].clientY
        });
      }

      if (window.game) {
        window.game.gameSystems.input.handleTouchStart(event);
      }
    });

    window.addEventListener('touchmove', (event) => {
      event.preventDefault();
      for (let i = 0; i < event.touches.length; i++) {
        const touch = this.touches.find(t => t.id === event.touches[i].identifier);
        if (touch) {
          touch.x = event.touches[i].clientX;
          touch.y = event.touches[i].clientY;
        }
      }

      if (window.game) {
        window.game.gameSystems.input.handleTouchMove(event);
      }
    });

    window.addEventListener('touchend', (event) => {
      event.preventDefault();
      this.touches = this.touches.filter(touch => !event.touches.find(t => t.id === touch.id));

      if (window.game) {
        window.game.gameSystems.input.handleTouchEnd(event);
      }
    });

    // Window resize
    window.addEventListener('resize', () => {
      if (window.game && window.game.gameSystems.graphics.renderer) {
        window.game.gameSystems.graphics.renderer.setSize(window.innerWidth, window.innerHeight);
        window.game.gameSystems.input.handleResize();
      }
    });

    // Gamepad input (for keyboard-less controls)
    window.addEventListener('gamepadconnected', (event) => {
      console.log('Gamepad connected:', event.gamepad);
    });

    window.addEventListener('gamepaddisconnected', (event) => {
      console.log('Gamepad disconnected:', event.gamepad);
    });
  }

  handleMouseMove(event) {
    // Calculate delta movement
    const deltaX = event.movementX || 0;
    const deltaY = event.movementY || 0;

    // Update camera controls based on camera mode
    const cameraMode = window.game ? window.game.gameState.settings.cameraMode : 'Strategic';

    switch (cameraMode) {
      case 'Strategic':
        // Rotate camera around the scene
        this.cameraControl.rotate.y -= deltaX * 0.01;
        this.cameraControl.rotate.x -= deltaY * 0.01;
        break;
      case 'Base':
        // Pan camera
        this.cameraControl.pan.x += deltaX * 0.005;
        this.cameraControl.pan.y += deltaY * 0.005;
        break;
      case 'Free':
        // Free camera movement
        // TODO: Implement free camera movement
        break;
    }

    // Apply camera transformations
    this.applyCameraTransformations();
  }

  handleMouseDown(event) {
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    // Calculate mouse position in normalized device coordinates
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Update the picking ray with the camera and mouse position
    raycaster.setFromCamera(mouse, window.game.gameSystems.graphics.camera);

    // Calculate objects intersecting the picking ray
    const intersects = raycaster.intersectObjects(window.game.gameState.gameWorld.map.structures);

    if (intersects.length > 0) {
      // Object was clicked
      const object = intersects[0].object;
      const structure = window.game.gameState.gameWorld.map.structures.find(s => s.mesh === object);

      if (structure) {
        // Handle structure click
        window.game.gameSystems.ui.selectStructure(structure);
      }
    } else {
      // Empty space clicked - deselect units
      window.game.gameSystems.ui.deselectAll();
    }
  }

  handleMouseUp(event) {
    // Handle mouse button release
  }

  handleMouseWheel(event) {
    // Zoom camera
    this.cameraControl.zoom += event.deltaY * 0.001;
    this.cameraControl.zoom = Math.max(0.1, Math.min(5.0, this.cameraControl.zoom));
    this.applyCameraTransformations();
  }

  handleTouchStart(event) {
    // Handle touch input for mobile devices
    // TODO: Implement mobile touch controls
  }

  handleTouchMove(event) {
    // Handle touch movement for mobile devices
    // TODO: Implement mobile touch controls
  }

  handleTouchEnd(event) {
    // Handle touch end for mobile devices
    // TODO: Implement mobile touch controls
  }

  handleEscape() {
    // Toggle pause menu
    if (window.game) {
      if (window.game.gameState.gameMode === 'PLAYING') {
        window.game.gameState.gameMode = 'PAUSED';
        window.game.gameSystems.ui.showPauseMenu();
      } else if (window.game.gameState.gameMode === 'PAUSED') {
        window.game.gameState.gameMode = 'PLAYING';
        window.game.gameSystems.ui.hidePauseMenu();
      }
    }
  }

  handleTab() {
    // Cycle through selected units
    if (window.game) {
      window.game.gameSystems.ui.cycleUnitSelection();
    }
  }

  handleResize() {
    if (window.game && window.game.gameSystems.graphics.renderer) {
      const canvas = window.game.gameSystems.graphics.renderer.domElement;
      const width = window.innerWidth;
      const height = window.innerHeight;

      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';

      window.game.gameSystems.graphics.renderer.setSize(width, height);
      this.applyCameraTransformations();
    }
  }

  applyCameraTransformations() {
    if (!window.game) return;

    const camera = window.game.gameSystems.graphics.camera;
    const cameraMode = window.game.gameState.settings.cameraMode;

    // Reset camera position
    camera.position.set(0, 50, 100);
    camera.lookAt(0, 0, 0);

    switch (cameraMode) {
      case 'Strategic':
        // Strategic view: rotate around the center
        camera.position.x = 100 * Math.cos(this.cameraControl.rotate.y);
        camera.position.z = 100 * Math.sin(this.cameraControl.rotate.y);
        camera.position.y = 50 + 30 * Math.sin(this.cameraControl.rotate.x);
        camera.lookAt(0, 0, 0);
        break;
      case 'Base':
        // Base view: follow the current player's selected unit/base
        const player = window.game.gameState.currentPlayer;
        if (player && player.civilization.buildings.length > 0) {
          const mainBuilding = player.civilization.buildings[0];
          camera.position.copy(mainBuilding.position.clone().add(new THREE.Vector3(0, 10, 10)));
          camera.lookAt(mainBuilding.position);
        }
        break;
      case 'Free':
        // Free camera: allow free movement
        // TODO: Implement free camera movement
        break;
    }

    // Apply zoom
    camera.position.multiplyScalar(this.cameraControl.zoom);

    // Apply pan offset
    camera.position.x += this.cameraControl.pan.x;
    camera.position.z += this.cameraControl.pan.y;
  }

  update() {
    // Check for keyboard input
    this.checkKeyboardInput();

    // Update touch positions
    this.updateTouchPositions();

    // Update camera controls
    this.applyCameraTransformations();
  }

  checkKeyboardInput() {
    // Handle camera movement
    if (this.keys['KeyW'] || this.keys['ArrowUp']) {
      // Move camera forward
      this.cameraControl.pan.y -= 0.01;
    }
    if (this.keys['KeyS'] || this.keys['ArrowDown']) {
      // Move camera backward
      this.cameraControl.pan.y += 0.01;
    }
    if (this.keys['KeyA'] || this.keys['ArrowLeft']) {
      // Move camera left
      this.cameraControl.pan.x -= 0.01;
    }
    if (this.keys['KeyD'] || this.keys['ArrowRight']) {
      // Move camera right
      this.cameraControl.pan.x += 0.01;
    }
    if (this.keys['KeyE']) {
      // Raise camera
      this.cameraControl.pan.y += 0.01;
    }
    if (this.keys['KeyQ']) {
      // Lower camera
      this.cameraControl.pan.y -= 0.01;
    }

    // Handle unit actions
    if (window.game) {
      if (this.keys['KeyR']) {
        // Build command
        window.game.gameSystems.input.handleBuildCommand();
      }
      if (this.keys['KeyF']) {
        // Attack command
        window.game.gameSystems.input.handleAttackCommand();
      }
      if (this.keys['KeyG']) {
        // Gather command
        window.game.gameSystems.input.handleGatherCommand();
      }
      if (this.keys['KeyT']) {
        // Train unit command
        window.game.gameSystems.input.handleTrainCommand();
      }
    }
  }

  updateTouchPositions() {
    // Update touch positions for mobile
    // TODO: Implement mobile touch controls
  }

  getMouseWorldPosition() {
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    // Calculate mouse position in normalized device coordinates
    mouse.x = (this.mouse.x / 2) * window.innerWidth;
    mouse.y = -(this.mouse.y / 2) * window.innerHeight;

    // Update the picking ray with the camera and mouse position
    raycaster.setFromCamera(mouse, window.game.gameSystems.graphics.camera);

    // Calculate objects intersecting the picking ray
    const intersects = raycaster.intersectObjects(window.game.gameState.gameWorld.map.structures);

    if (intersects.length > 0) {
      return intersects[0].point;
    }

    return null;
  }
}

module.exports = InputSystem;