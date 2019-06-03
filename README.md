# UTS 31264 Introduction To Computer Graphics - Final Project

Currently being hosted at: https://mhillier98.github.io/IntroToComputerGraphics_CityGenerator/

---

This city generator was built in [three.js](https://threejs.org/) to explore different graphics techniques and procedural generation. This project was the final project for UTS 31264 Introduction to Computer Graphics, in Autumn 2019.

Our project’s aim was to randomly generate a cityscape with a wide range of different variables that effect it’s generation. We wanted variation through building sizes, colours and different models, as well as other aesthetics that would affect our scene, such as lighting, camera positioning, and skybox scenery.

We wanted to provide many different options to the user to control these options, allowing the user to edit the city after it has been generated.

![Preview Image](https://github.com/MHillier98/IntroToComputerGraphics_CityGenerator/blob/master/assets/img-preview/preview-full.png "Preview Image")

---

## Generation
Procedurally generating a city is harder than one might think, so we decided to go with an algorithm that would generate a path that was easy to work with, while providing enough interesting variations to work well with. We used a variation of a 2D [Random Walk Algorithm](https://en.wikipedia.org/wiki/Random_walk), that would provide a road layout that we could use.

#### Adding Roads
First, we implemented the ability to add roads onto a  2D plane. Each time the algorithm ‘walks’, it places down a section of road. Each section is made up of several square meshes with a road texture applied. Because of the number of meshes we are adding to our scene, it was necessary to optimise by saving the locations of the sections, and not placing down multiple sections at the same location.

#### Adding Buildings
We wanted to add buildings in an orderly manner around our roads, with every building having different variables that would be decided before being added. Every time the algorithm ‘walks’, we load one of 8 different building models, and give it a random colour, width, height, and scale. This provides a large amount of variation with what is possible with just 1 model, and the inclusion of 8 models provides a huge number of variations.

---

## Development Setup
To run this, you will have to host a local server for your dev environment. If you don't run this from a server, images don't seem to load at all.

First, install [http-server](https://www.npmjs.com/package/http-server) with [npm](https://www.npmjs.com/). Use the command `npm install http-server -g` to do so.

## Running the City Generator
Open the base folder and type in the command `http-server -c-1` to start a local server.

Then go to one of the available addresses to view and use the city builder (these will change depending on your configuration):
* `http://192.168.43.7:8080/index` 
* `http://127.0.0.1:8080/index`
* `http://localhost:8080/index`

---

## Group members - Group 10
* Matthew Hillier
* Longyong Li
* Josh Masangcay
* Alex Munoz
* Mitchell Sanderson
