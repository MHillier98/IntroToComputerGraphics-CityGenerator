function CreateScene() {
    scene.add(ambientLight);
    scene.add(light);
}

CreateScene();

var moveSpeed = 4000;


//Generator Logic
var update = function () {
    controls.update();

    var time = performance.now();
    var delta = (time - prevTime) / 1000;
    // var delta = 1;

    velocity.x -= velocity.x * 10.0 * delta;
    velocity.z -= velocity.z * 10.0 * delta;
    velocity.y -= velocity.y * 10.0 * delta;

    direction.z = Number(moveForward) - Number(moveBackward);
    direction.x = Number(moveLeft) - Number(moveRight);
    direction.y = Number(moveDown) - Number(moveUp);

    direction.normalize();

    if (moveForward || moveBackward) {
        velocity.z -= direction.z * moveSpeed * delta * (firstPersonMode ? 0.2 : 0.6);
    }
    if (moveLeft || moveRight) {
        velocity.x -= direction.x * moveSpeed * delta * (firstPersonMode ? 0.2 : 0.6);
    }
    if (moveUp || moveDown) {
        velocity.y -= direction.y * moveSpeed * delta * 0.2;
    }

    keyboardControls.getObject().translateX(velocity.x * delta);
    keyboardControls.getObject().translateZ(velocity.z * delta);
    keyboardControls.getObject().translateY(velocity.y * delta);

    prevTime = time;
};

var render = function () {
    //call the render with the scene and the camera
    renderer.render(scene, camera);
}

//this fucntion is called when the window is resized
var MyResize = function () {
    var width = window.innerWidth;
    var height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.render(scene, camera);
    blockedWidth = width - 245;
};

//Runs the game loop
var GameLoop = function () {
    update();
    render();
    requestAnimationFrame(GameLoop);
}

requestAnimationFrame(GameLoop);
//link the resize of the window to the update of the camera
window.addEventListener('resize', MyResize);