import * as THREE from '../js/three.module.js';
import {WEBGL} from './WebGL.js'
let canvas;
let camera, scene, renderer;
let uniforms;

let mesh;

if (WEBGL.isWebGL2Available()){
    init();
    requestAnimationFrame(animate);
    }
    else{
        var warning = WEBGL.getWebGLErrorMessage();
        document.body.appendChild( warning );
    
    }
//animate();
function init(){
	scene = new THREE.Scene();
	scene.background = new THREE.Color(0xcccccc);

	// Assuming WebGL2 is available to render shaders
	canvas = document.createElement('canvas');
	let context = canvas.getContext('webgl2', {alpha: false});
	renderer = new THREE.WebGLRenderer({canvas: canvas, context: context});
    renderer.setSize(300, 300);
    renderer.setPixelRatio(window.devicePixelRatio);
	document.body.appendChild(renderer.domElement);
			
    camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.z = 2;

	let fragShader = document.getElementById('fragmentShader').textContent.trim();
	let vertexShader = document.getElementById('vertexShader').textContent.trim();
	let loader = new THREE.TextureLoader();
    uniforms = {
        u_time : {value: 1.0},
        u_resolution : {value: new THREE.Vector2()},
        u_mouse: { value: new THREE.Vector2()}
    }

    let v_resolution = new THREE.Vector2();
	let material = new THREE.ShaderMaterial({
		vertexShader: vertexShader,
		fragmentShader: fragShader,
		uniforms: uniforms
	});
			
	let geometry = new THREE.BoxBufferGeometry(1,1,1);
	mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    onWindowResize();
    window.addEventListener('resize', onWindowResize,false);
    document.onmousemove = function(e){
        uniforms.u_mouse.value.x = e.pageX;
        uniforms.u_mouse.value.y = e.pageY;
    }
}
            
function onWindowResize(event){
   // renderer.setSize(window.innerWidth, window.innerHeight);
    uniforms.u_resolution.value.x = renderer.domElement.width;
    uniforms.u_resolution.value.y = renderer.domElement.height;
}

function animate(time) {
    requestAnimationFrame(animate);
    uniforms.u_time.value = time;
    mesh.rotation.x += 0.01;
    mesh.rotation.y += 0.01;
    renderer.render(scene, camera);
}
