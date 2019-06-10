var gui;
var params = {
    selected_building: "empty",
    light_angle: Math.PI / 2,
    camera_rotate_speed: 0,
    light_increase_speed: 0,
    walk_path_steps: genSteps,

    day: function () {
        //Make day
    },
    night: function () {
        //make night
    },
    firstPerson: function () {
        camera.position.x = 0;
        camera.position.y = 5;
        camera.position.z = 0;
        controls.target = new THREE.Vector3(10, 5, 0);
        firstPersonMode = !firstPersonMode;
        keyboardControls.enabled = !keyboardControls.enabled;
    },

    generate: function () {
        GenerateCity(genSteps);
    },
    generate1: function () { //match the skybox
        scene.background = textureCube1;
    },
    generate2: function () {
        scene.background = textureCube2;
    },
    generate5: function () {
        scene.background = textureCube5;
    },
    generate7: function () {
        scene.background = textureCube7;
    },
    generate8: function () {
        scene.background = textureCube8;
    },
    generate9: function () {
        scene.background = textureCube9;
    },

    generate11: function () {
        textureT(1); //match the ground
    },
    generate22: function () {
        textureT(2);
    },
    generate33: function () {
        textureT(3);
    },
    generate44: function () {
        textureT(4);
    },
    generate55: function () {
        textureT(5);
    },
    generate66: function () {
        textureT(6);
    },
    generate77: function () {
        textureT(7);
    },
    generate88: function () {
        textureT(8);
    },
    generate99: function () {
        textureT(9);
    },
}

gui = new dat.GUI({
    name: "City Options"
});

selectCheck();

var lightFolder = gui.addFolder('Light Options');
lightFolder.open();

var lightController = lightFolder.add(params, 'light_angle', 0, Math.PI * 2).listen();;
lightController.name("Angle");
lightController.onChange(function (val) {
    updateLight(val);
});

function updateLight(val) {
    if (val >= Math.PI * 2) {
        val = 0;
    }

    params.light_angle = val;
    light.position.y = Math.sin(val) * 1000;
    light.position.x = Math.cos(val) * 1000;
    var lightVal = Math.abs(Math.sin(val));
    light.color = new THREE.Color(1, lightVal, lightVal);

    if (val >= Math.PI) {
        light.intensity = 0;
        ambientLight.intensity = 0.1;
    } else {
        light.intensity = 0.25 + 0.25 * lightVal;
        ambientLight.intensity = 0.1 + 0.2 * lightVal;
    }
}

var lightIncreaseSpeedController = lightFolder.add(params, 'light_increase_speed', 0, 10, 0.1).listen();;
lightIncreaseSpeedController.name("Light Increase Speed");
lightIncreaseSpeedController.onChange(function (val) {
    params.light_increase_speed = val;
});

window.setInterval(function () {
    updateLight(params.light_angle + (params.light_increase_speed/100));
}, 30);

var cameraFolder = gui.addFolder('Camera Options');
cameraFolder.open();

var cameraSpeedController = cameraFolder.add(params, 'camera_rotate_speed', 0, 5, 0.1);
cameraSpeedController.name("Camera Rotation Speed");
cameraSpeedController.onChange(function (val) {
    controls.autoRotateSpeed = val;
});

var generationFolder = gui.addFolder('Generation Options');
generationFolder.open();

var genStepsController = generationFolder.add(params, 'walk_path_steps', 1, 50, 1);
genStepsController.name("Generation Steps");
genStepsController.onChange(function (val) {
    genSteps = val;
});

var genBtn = generationFolder.add(params, 'generate');
genBtn.name("Generate New City");

//Controller settings, for example whether or not to use first person controls
// TODO: FIX THIS!
//var controlsFolder = gui.addFolder('Control Options');
//controlsFolder.open();
//var ctrlBtnFP = controlsFolder.add(params, 'firstPerson');
//ctrlBtnFP.name("First Person Mode");
// var ctrlBtnDay = controlsFolder.add(params, 'day');
// ctrlBtnDay.name("Set time day");
// var ctrlBtnNight = controlsFolder.add(params, 'night');
// ctrlBtnNight.name("Set time night");


//Skybox
var generationFolder1 = gui.addFolder('Skybox');
generationFolder1.close();

var genBtn1 = generationFolder1.add(params, 'generate1');
genBtn1.name("Sky1");

var genBtn2 = generationFolder1.add(params, 'generate2');
genBtn2.name("Sky2");

var genBtn5 = generationFolder1.add(params, 'generate5');
genBtn5.name("Sky3");

var genBtn7 = generationFolder1.add(params, 'generate7');
genBtn7.name("Sky4");

var genBtn8 = generationFolder1.add(params, 'generate8');
genBtn8.name("Sky5");

var genBtn9 = generationFolder1.add(params, 'generate9');
genBtn9.name("Sky6");


//ground
var generationFolder11 = gui.addFolder('Ground Texture');
generationFolder11.close();

var genBtn11 = generationFolder11.add(params, 'generate11');
genBtn11.name("Ground1");

var genBtn22 = generationFolder11.add(params, 'generate22');
genBtn22.name("Ground2");

var genBtn33 = generationFolder11.add(params, 'generate33');
genBtn33.name("Ground3");

var genBtn44 = generationFolder11.add(params, 'generate44');
genBtn44.name("Ground4");

var genBtn55 = generationFolder11.add(params, 'generate55');
genBtn55.name("Ground5");

var genBtn66 = generationFolder11.add(params, 'generate66');
genBtn66.name("Ground6");

var genBtn77 = generationFolder11.add(params, 'generate77');
genBtn77.name("Ground7");

var genBtn88 = generationFolder11.add(params, 'generate88');
genBtn88.name("Ground8");

var genBtn99 = generationFolder11.add(params, 'generate99');
genBtn99.name("Ground9");


function selectCheck() {
    if (isSelected == true) {
        var buildingFolder = gui.addFolder('Building Options');
        buildingFolder.open();

        var files = [1, 2, 3, 4, 5, 6, 7, 8];

        var buildingController = buildingFolder.add(params, 'selected_building', ['Model 1', 'Model 2', 'Model 3', 'Model 4', 'Model 5', 'Model 6', 'Model 7', 'Model 8']).listen();
        buildingController.name("Building Model");

        var paramcolor = {
            color: 0xff00ff
        };
        var paramscale = {
            scale: selectedObjectScale
        };

        buildingFolder.addColor(paramcolor, 'color').name('Building Colour').onChange(function () {
            selectedObjectColor.set(paramcolor.color);
        });
        buildingFolder.add(paramscale, 'scale', 0, 100).onChange(function () {
            selectedObject.scale.y = paramscale.scale;
        });
    }
}

function textureT(xxx) {
    if (xxx == 1) {
        baseMaterial.map = TextureL1;
    } else if (xxx == 2) {
        baseMaterial.map = TextureL2;
    } else if (xxx == 3) {
        baseMaterial.map = TextureL3;
    } else if (xxx == 4) {
        baseMaterial.map = TextureL4;
    } else if (xxx == 5) {
        baseMaterial.map = TextureL5;
    } else if (xxx == 6) {
        baseMaterial.map = TextureL6;
    } else if (xxx == 7) {
        baseMaterial.map = TextureL7;
    } else if (xxx == 8) {
        baseMaterial.map = TextureL8;
    } else if (xxx == 9) {
        baseMaterial.map = TextureL9;
    }
}