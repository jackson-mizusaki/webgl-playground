import * as THREE from '../js/three.module.js';
var canvas;
var camera, scene, renderer;
var uniforms;

init();
animate();
function init(){
	scene = new THREE.Scene();
	scene.background = new THREE.Color(0xcccccc);

	// Assuming WebGL2 is available for now
	canvas = document.createElement('canvas');
	var context = canvas.getContext('webgl2', {alpha: false});
	renderer = new THREE.WebGLRenderer({canvas: canvas, context: context});
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
	document.body.appendChild(renderer.domElement);
			

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 1;

	//scene.add(camera);
	let fragShader = document.getElementById('fragmentShader').textContent.trim();
	let vertexShader = document.getElementById('vertexShader').textContent.trim();
	let loader = new THREE.TextureLoader();
    uniforms = {
        u_time : {value: 1.0},
        u_resolution : {value: new THREE.Vector2()},
        u_mouse: { value: new THREE.Vector2()}
    }

    let v_resolution = new THREE.Vector2();
	var material = new THREE.ShaderMaterial({
		vertexShader: vertexShader,
		fragmentShader: fragShader,
		uniforms: uniforms
	});
			
	var geometry = new THREE.PlaneBufferGeometry(2,2);
	var plane = new THREE.Mesh(geometry, material);
    scene.add(plane);

    onWindowResize();
    window.addEventListener('resize', onWindowResize,false);
    document.onmousemove = function(e){
        uniforms.u_mouse.value.x = e.pageX;
        uniforms.u_mouse.value.y = e.pageY;
    }
}
            
function onWindowResize(event){
    renderer.setSize(window.innerWidth, window.innerHeight);
    uniforms.u_resolution.value.x = renderer.domElement.width;
    uniforms.u_resolution.value.y = renderer.domElement.height;
}

function animate(time) {
    requestAnimationFrame(animate);
    uniforms.u_time.value = time;
    renderer.render(scene, camera);
}
            
function render(){
}