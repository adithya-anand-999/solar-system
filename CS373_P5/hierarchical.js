/* COMPSCI 373 Project 5: Hierarchical Scene */

const width = 1300, height = 800;
const fov = 60;
const cameraz = 100;
const aspect = width/height;
const smoothShading = true;
let   animation_speed = 1.0;

let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(fov, aspect, 1, 1000);
camera.position.set(0, 1, cameraz);

let renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(width, height);
renderer.setClearColor(0x202020);
window.onload = function(e) {
	document.getElementById('window').appendChild(renderer.domElement);
}
let orbit = new THREE.OrbitControls(camera, renderer.domElement);	// create mouse control

let light0 = new THREE.DirectionalLight(0xFFFFFF, 1.0);
light0.position.set(camera.position.x, camera.position.y, camera.position.z);	// this light is at the camera
scene.add(light0);

let light1 = new THREE.DirectionalLight(0x800D0D, 1.0); // red light
light1.position.set(-1, 1, 0);
scene.add(light1);

let light2 = new THREE.DirectionalLight(0x0D0D80, 1.0); // blue light
light2.position.set(1, 1, 0);
scene.add(light2);

let amblight = new THREE.AmbientLight(0x202020);	// ambient light
scene.add(amblight);

let material = new THREE.MeshPhongMaterial({color:0x808080, flatShading: false, specular:0x101010, shininess: 50, side:THREE.FrontSide});
// load models
let models = []; // array that stores all models
let numModelsLoaded = 0;
let numModelsExpected = 0;

const sunGeo = new THREE.SphereGeometry(9);
const sunText = new THREE.TextureLoader().load("models/sun.jpeg");
const sunMat = new THREE.MeshBasicMaterial({map:sunText});
const sun = new THREE.Mesh(sunGeo,sunMat);
const solarSystem = new THREE.Group();
solarSystem.add(sun);

const earthGeo = new THREE.SphereGeometry(3);
const earthText = new THREE.TextureLoader().load("models/earth.jpeg");
const earthMat = new THREE.MeshBasicMaterial({map:earthText});
const earth = new THREE.Mesh(earthGeo,earthMat);
const earth_group = new THREE.Group();
earth_group.add(earth);
solarSystem.add(earth_group);

const moonGeo = new THREE.SphereGeometry(1.1); // Adjust the radius as needed
const moonText = new THREE.TextureLoader().load("models/moon.jpeg"); // Adjust the path to your moon texture
const moonMat = new THREE.MeshBasicMaterial({ map: moonText });
const moon = new THREE.Mesh(moonGeo, moonMat);
const moon_group = new THREE.Group();
moon_group.add(moon);
earth.add(moon_group);

const rocketGeo = new THREE.SphereGeometry(0.5);
const rocketText = new THREE.TextureLoader().load("models/fire.jpeg");
const rocketMat = new THREE.MeshBasicMaterial({map:rocketText});
const rocketInSun = new THREE.Mesh(rocketGeo, rocketMat);
const rocketToSun = new THREE.Mesh(rocketGeo, rocketMat);

const asteroidGeo = new THREE.SphereGeometry(0.9);
const asteroidText = new THREE.TextureLoader().load("models/asteroid.jpeg");
const asteroidMat = new THREE.MeshBasicMaterial({map:asteroidText});
const asteroid = new THREE.Mesh(asteroidGeo, asteroidMat);
const anotherAsteroid = new THREE.Mesh(asteroidGeo, asteroidMat);
solarSystem.add(asteroid);
solarSystem.add(anotherAsteroid);

const marsGeo = new THREE.SphereGeometry(2.6);
const marsText = new THREE.TextureLoader().load("models/mars.jpeg");
const marsMat = new THREE.MeshBasicMaterial({map:marsText});
const mars = new THREE.Mesh(marsGeo,marsMat);
const mars_group = new THREE.Group();
mars_group.add(mars);
solarSystem.add(mars_group);


// function loadModel(objstring, material, label) {
// 	numModelsExpected++;
// 	loadOBJFromString(objstring, function(mesh) { // callback function for non-blocking load
// 		mesh.computeFaceNormals();
// 		if(smoothShading) mesh.computeVertexNormals();
// 		models[label] = new THREE.Mesh(mesh, material);
// 		numModelsLoaded++;
// 	}, function() {}, function() {});
// }

let initialized = false;

let startPoint;

let endPointInS;
let curveInSun;
let endPointToS;
let curveToSun;

const centerX = 0;
const centerY = 0;
const radiusX = 50;
const radiusY = 70;
const radiusZ = 50;
const radiusY2 = 150;
const radiusX2 = 25;

let progress = 0;
let angle = 0;

function animate() {
	requestAnimationFrame( animate );
	if(numModelsLoaded == numModelsExpected) {	// all models have been loaded
		if(!initialized) {
			initialized = true;

			scene.add(solarSystem);
			earth.position.x = 52;
			moon.position.x = 10;
			mars.position.x = 80;
			scene.add(rocketInSun);
			earth_group.add(rocketToSun);

			startPoint = earth.position;
			endPointInS = sun.position;
			endPointToS = moon.position;

			const directionVectorInS = endPointInS.clone().sub(startPoint);
			const middleVectorInS = startPoint.clone().add(directionVectorInS.clone().multiplyScalar(0.5));
			//middleVectorInS.z = 10;

			curveInSun = new THREE.CatmullRomCurve3([
				startPoint,
				middleVectorInS,
				endPointInS
			]);

			const directionVectorToS = endPointToS.clone().sub(startPoint);
			const middleVectorToS = startPoint.clone().add(directionVectorToS.clone().multiplyScalar(0.5));
			//middleVectorToS.z = 10;

			curveToSun = new THREE.CatmullRomCurve3([
				startPoint,
				middleVectorToS,
				endPointToS
			]);

		}
		// animate the scene
		const year = 2 * Math.PI * (1/60) * (1/60);
		sun.rotation.y += 0.001*animation_speed;
		earth.rotation.y += (0.03) * animation_speed;
		earth_group.rotation.y += year * animation_speed;
		moon_group.rotation.y += 0.03*animation_speed;
		mars.rotation.y += 0.0301 * animation_speed;
		mars_group.rotation.y += 0.53*year*animation_speed;

		if(progress<=1){
			const curvePointInS = curveInSun.getPointAt(progress);
			rocketInSun.position.copy(curvePointInS);

			const curvePointToS = curveToSun.getPointAt(progress);
			rocketToSun.position.copy(curvePointToS);

			progress+=0.001*animation_speed;
		}

		const x = centerX + Math.cos(animation_speed * 0.001 * angle) * radiusX;
		const y = centerY + Math.sin(animation_speed * 0.001 * angle) * radiusY;
		//const z = centerZ + Math.cos(speed*Date.now()) * radiusZ;

		const x2 = centerX + Math.cos(animation_speed * 0.001 * angle) * radiusX2;
		const y2 = centerY + Math.sin(animation_speed * 0.001 * angle) * radiusY2;

		++angle;
		asteroid.position.set(x,y,0);
		asteroid.rotation.z = Math.atan2(y-centerY,x-centerX);

		anotherAsteroid.position.set(x2,y2,0);
		anotherAsteroid.rotation.z = Math.atan2(y2-centerY, x2-centerX);
		
	}
	light0.position.set(camera.position.x, camera.position.y, camera.position.z); // light0 always follows camera position
	renderer.render(scene, camera);
}

animate();

function onKeyDown(event) {
	switch(event.key) {
		case 'w':
		case 'W':
			material.wireframe = !material.wireframe;
			break;
		case '=':
		case '+':
			animation_speed += 0.05;
			document.getElementById('msg').innerHTML = 'animation_speed = '+animation_speed.toFixed(2);
			break;
		case '-':
		case '_':
			if(animation_speed>0) animation_speed-=0.05;
			document.getElementById('msg').innerHTML = 'animation_speed = '+animation_speed.toFixed(2);
			break;
		case 'r':
		case 'R':
			orbit.reset();
			break;
	}
}

window.addEventListener('keydown', onKeyDown, false); // as key control if you need
