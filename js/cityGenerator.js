// Setup for roads
var roadSize = 20; // the width of each road
var roadGeometry = new THREE.PlaneGeometry(roadSize, roadSize); // create a new PlaneGeometry that is square from the road size 
var roadMaterial = new THREE.MeshPhongMaterial({ // create a new material from an asphalt texture
    map: new THREE.TextureLoader().load("./assets/road/asphalt.png"),
    side: THREE.DoubleSide // make it double sided to avoid any rendering issues
});

// Setup for buildings
var buildingBaseSize = 80; // the size of each building base
var buildingBaseGeometry = new THREE.PlaneGeometry(buildingBaseSize, buildingBaseSize); // create a square PlaneGeometry to use as a base under each building
var buildingBaseMaterial = new THREE.MeshPhongMaterial({ // create a new material from a base texture
    map: new THREE.TextureLoader().load("./assets/road/building_base.jpg"),
    side: THREE.DoubleSide // make it double sided to avoid any rendering issues
});

// Setup for building and road locations
var buildingLocations = []; // an array of every x,y location where there is a building
var roadLocations = []; // an array of every x,y location where there is a road

// The amount of buildings to generate
var genSteps = 20; // the number of times we recursively call our walking algorithm

// Add a square road to the scene, using specified coordinates
function AddSquareRoad(x, y, z) {
    var roadMesh = new THREE.Mesh(roadGeometry, roadMaterial); // create a new mesh with the pre-setup geometry and material
    roadMesh.receiveShadow = true; // allow the mesh to receive shadows
    roadMesh.castShadow = false; // don't allow the mesh to cast shadows - this fixes some light-related rendering bugs

    // set the x, y, z coordinates of the mesh we just created
    roadMesh.position.x = x;
    roadMesh.position.y = y;
    roadMesh.position.z = z;
    roadMesh.rotation.set(Math.PI / 2, 0, 0); // rotate the mesh 90 degrees on its side so it sits flat in our scene

    scene.add(roadMesh); // add the mesh to our scene
}

// Add a base that will go under each building, using specified coordinates
function AddBuildingBase(x, y, z) {
    var buildingBaseMesh = new THREE.Mesh(buildingBaseGeometry, buildingBaseMaterial); // create a new mesh with the pre-setup geometry and material
    buildingBaseMesh.receiveShadow = true; // allow the mesh to receive shadows
    buildingBaseMesh.castShadow = false; // don't allow the mesh to cast shadows - this fixes some light-related rendering bugs

    // set the x, y, z coordinates of the mesh we just created
    buildingBaseMesh.position.x = x;
    buildingBaseMesh.position.y = y;
    buildingBaseMesh.position.z = z;
    buildingBaseMesh.rotation.set(Math.PI / 2, 0, 0); // rotate the mesh 90 degrees on its side so it sits flat in our scene

    scene.add(buildingBaseMesh); // add the mesh to our scene
}

// Add an 'L' section of road, using specified coordinates, and width of roads going in either direction
function AddRoads(x, y, z, width) {
    var freeSpace = true; // if there is a free space at the current location

    for (var b = 0; b < roadLocations.length; b++) { // loop through all of the road locations
        if (roadLocations[b].x == x && roadLocations[b].z == z) { // check if the current x,z coordinate is in the roadLocations array
            freeSpace = false; // the space as not free
        }
    }

    if (freeSpace) { // if this is a free space
        roadLocations.push({ // add this location to the roadLocations array
            x,
            z
        });

        AddLightPole(x, y, z); // add a light pole to go with the road

        for (var w = 0; w < width; w++) { // add roads along the x axis of this section
            AddSquareRoad((w + x) * roadSize, y, z * roadSize);
        }

        for (var q = 0; q < width; q++) { // add roads along the z axis of this section
            AddSquareRoad(x * roadSize, y, (q + z) * roadSize);
        }
    }
}

// Add a light pole at the specified coordinates
function AddLightPole(x, y, z) {
    var loader = new THREE.ObjectLoader(); // create a loader object to load in our light pole model
    loader.load('./assets/lightpole/light-pole.json', function (obj) { // load the model
        var combined = new THREE.Matrix4(); // create a Matrix to combine affects on the model
        var scale = new THREE.Matrix4(); // the scale of the model
        scale.makeScale(1, 1, 1); // scale the model to a scale of 1
        combined.multiply(scale); // add the scale Matrix to the combined Matrix

        var rot = new THREE.Matrix4(); // create a Matrix for the rotation
        rot.makeRotationY(Math.PI / -2); // rotate around the Y axis to point the light pole towards the road
        if (Math.round(Math.random()) == 0) { // randomly rotate the pole 90 degrees to create some variation
            rot.makeRotationY(Math.PI);
        }
        combined.multiply(rot); // add the rotation Matrix to the combined Matrix

        obj.applyMatrix(combined); // apply the combined Matrix to the light pole object
        obj.position.y = y + 11; // align the pole to be on the ground
        obj.position.x = x * roadSize + 12; // add the pole to an x offset to the road section
        obj.position.z = z * roadSize + 12; // add the pole to an z offset to the road section

        scene.add(obj); // add the light pole to the scene
    });
}

function AddBuilding(startingX, startingZ, randomX, randomZ, stepsLeft) {
    var buildingWidth = 1.5 + (Math.random() * 1);
    var buildingHeight = 1 + (Math.random() * (stepsLeft / 6));

    var buildingX = (startingX + randomX) * 20 * 5;
    var buildingY = (buildingHeight / 2);
    var buildingZ = (startingZ + randomZ) * 20 * 5;

    var freeSpace = true;

    for (var b = 0; b < buildingLocations.length; b++) {
        if (buildingLocations[b].buildingX == buildingX && buildingLocations[b].buildingZ == buildingZ) {
            freeSpace = false;
        }
    }

    if (freeSpace) {
        buildingLocations.push({
            buildingX,
            buildingZ
        });

        var randBuilding = Math.floor((Math.random() * 100) + 1);
        var baseColor = 0.19 + (Math.random() * 0.81);

        if (randBuilding < 75) { // 75% of the time a tall building will be chosen

            var isWideRand = Math.floor(Math.random() * 30) + 1;

            var wideBuildingWidth = 0;
            var wideBuildingDepth = 0;

            if (isWideRand < 5) {
                var freeSpaceAdj = true;

                for (var b = 0; b < buildingLocations.length; b++) {
                    if (buildingLocations[b].buildingX == buildingX + 100 && buildingLocations[b].buildingZ == buildingZ) {
                        freeSpaceAdj = false;
                    }
                }

                if (freeSpaceAdj) {
                    wideBuildingWidth = buildingWidth;
                    buildingX += 100;

                    buildingLocations.push({
                        buildingX,
                        buildingZ
                    });
                    buildingX -= 50;
                }

                AddBuildingBase(buildingX + 50, 1.0084, buildingZ);
                AddBuildingBase(buildingX, 1.0084, buildingZ);
                AddBuildingBase(buildingX - 50, 1.0084, buildingZ);
            } else if (isWideRand > 25) {
                var freeSpaceAdj = true;

                for (var b = 0; b < buildingLocations.length; b++) {
                    if (buildingLocations[b].buildingZ == buildingZ + 100 && buildingLocations[b].buildingX == buildingX) {
                        freeSpaceAdj = false;
                    }
                }

                if (freeSpaceAdj) {
                    wideBuildingDepth = buildingWidth;
                    buildingZ += 100;

                    buildingLocations.push({
                        buildingX,
                        buildingZ
                    });
                    buildingZ -= 50;
                }

                AddBuildingBase(buildingX, 1.0084, buildingZ - 50);
                AddBuildingBase(buildingX, 1.0084, buildingZ);
                AddBuildingBase(buildingX, 1.0084, buildingZ + 50);
            } else {
                AddBuildingBase(buildingX, 1.0084, buildingZ);
            }


            AddBuild(
                Math.floor((Math.random() * 8) + 1),
                baseColor - (Math.random() / 10),
                baseColor - (Math.random() / 10),
                baseColor - (Math.random() / 10),
                buildingWidth + wideBuildingWidth,
                buildingHeight,
                buildingWidth + wideBuildingDepth,
                buildingX,
                buildingY,
                buildingZ
            );
        } else { // don't make a smaller building double width
            AddBuildingBase(buildingX, 1.0084, buildingZ);
            AddBuild(
                Math.floor((Math.random() * 5) + 9),
                baseColor - (Math.random() / 10),
                baseColor - (Math.random() / 10),
                baseColor - (Math.random() / 10),
                buildingWidth,
                buildingHeight,
                buildingWidth,
                buildingX,
                buildingY,
                buildingZ
            );
        }
    }
}

// Add a building, with parameters: name of model, red, blue, green, width, height, depth, x translation, y translation, z translation
function AddBuild(model, r, g, b, width, height, depth, xTra, yTra, zTra) {
    var loader = new THREE.PLYLoader();
    var mesh = null;
    loader.load('assets/building_models/b' + model + '.ply', function (geometry) {
        var material = new THREE.MeshPhongMaterial();
        material.color = new THREE.Color(r, g, b);
        material.shininess = 50;
        geometry.computeVertexNormals();
        mesh = new THREE.Mesh(geometry, material);
        mesh.name = "building";

        geometry.computeBoundingBox();

        var size = geometry.boundingBox.getSize();
        var sca = new THREE.Matrix4();
        var combined = new THREE.Matrix4();
        if (model > 8) {
            sca.makeScale(4 * size.length() * width, 4 * size.length() * height, 4 * size.length() * depth);
        } else {
            sca.makeScale(2 * size.length() * width, 2 * size.length() * height, 2 * size.length() * depth);
        }
        combined.multiply(sca);
        mesh.applyMatrix(combined);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.position.x = xTra;
        mesh.position.y = yTra;
        mesh.position.z = zTra;

        scene.add(mesh);
    });
}

// A recursive Random Walk algorithm, with a specified starting X and Z coordinate, and the remaining number of times to recursively call
// This adds all of the buildings and roads to our city
function RandomWalk(startingX, startingZ, stepsLeft) {
    var randomRoadCoords = [ // the 4 potential coordinates for a road to be placed 
        [0, 1],
        [0, -1],
        [-1, 0],
        [1, 0]
    ][Math.random() * 4 | 0]; // randomly choose one of the 4 coordinates

    var newX = startingX + randomRoadCoords[0]; // get the x coord of the randomly chosen coordinate
    var newZ = startingZ + randomRoadCoords[1]; // get the z coord of the randomly chosen coordinate

    AddRoads(newX * 5, 1, newZ * 5, 5); // Add a section of road at the randomly chosen offset


    var randomBuildingCoords = [ // the 4 potential coordinates for a building to be placed
        [0.5, 0.5],
        [0.5, -0.5],
        [-0.5, 0.5],
        [-0.5, -0.5]
    ][Math.random() * 4 | 0]; // randomly choose one of the 4 coordinates

    AddBuilding(startingX, startingZ, randomBuildingCoords[0], randomBuildingCoords[1], stepsLeft); // Add a building at the randomly chosen offset


    var newStepsLeft = stepsLeft - 1; // decrement the amount of times left to recursively call
    if (newStepsLeft > 0) { // if there are still steps left to go
        RandomWalk(newX, newZ, newStepsLeft); // call this method again
    }
}

// Generate the city, running the Random Walk algorithm a specified amount of times 
function GenerateCity(steps) {
    for (var x = 0; x < steps; x++) { // call RandomWalk with the current number of steps
        RandomWalk(0, 0, x);
    }
}