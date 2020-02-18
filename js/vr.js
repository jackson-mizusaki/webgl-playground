import * as THREE from '../js/three.module.js';
import { VRButton } from '../js/VRButton.js';
import {OBJLoader2} from '../js/OBJLoader2.js';
import { MTLLoader } from '../js/MTLLoader.js';
import {MtlObjBridge} from '../js/obj2/bridge/MtlObjBridge.js';

let canvas;
let camera, scene, renderer;
let uniforms;

init();
renderer.setAnimationLoop(animate);



function init(){
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xaaaabb);
    scene.add( new THREE.AmbientLight( 0x111122 ) );

    canvas = document.createElement('canvas');
    let context = canvas.getContext({alpha: false});


    renderer = new THREE.WebGLRenderer({canvas: canvas, context:context});
    renderer.xr.enabled = true;
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    //renderer.physicallyCorrectLights = true;
    // Add VR button 
    document.body.appendChild(VRButton.createButton(renderer));
    // Add renderer
    document.body.appendChild(renderer.domElement);

    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 50);
    camera.position.set(0, 1.6, 3);
    scene.add(camera);

    let light = new THREE.SpotLight(0xffffff, 5, 20);
    light.position.set(0,3,0);
    light.castShadow = true;
    light.shadow.mapSize.width = 512;  // default
    light.shadow.mapSize.height = 512; // default
    light.shadow.camera.near = 0.5;       // default
    light.shadow.camera.far = 500 ;     // default
    
    scene.add(light);
    
    let objLoader = new OBJLoader2();
    let mtlLoader = new MTLLoader();
    let files = ['Monitor', 'Tower', 'Desk'];

    uniforms = {
        u_time : {value: 1.0},
        u_resolution : {value: new THREE.Vector2()},
    }
    function loadObjs(i){
        if (i > files.length-1){
            return;
        }
        mtlLoader = new MTLLoader();
        objLoader = new OBJLoader2();
        if (files[i] == 'Desk'){
            // use shader on desk instead	
            // let fragShader = document.getElementById('fragmentShader').textContent.trim();
            // let vertShader = document.getElementById('vertexShader').textContent.trim();

            // set materials manually
            const materials = {
                Material: new THREE.MeshPhongMaterial(0xad6e00),
                Legs: new THREE.MeshPhongMaterial(0x050505)
            };
            objLoader.setModelName(files[i]);
            objLoader.addMaterials(materials);
            objLoader.load('assets/'+files[i]+'.obj', (root) => {
                //root.material.shadowSide = THREE.DoubleSide;
                root.traverse( function ( child ) {
                    if ( child instanceof THREE.Mesh ) {
                        child.castShadow = true;
                        child.receiveShadow = true;
                    }
                });
                root.castShadow = true;
                root.receiveShadow = true;  
                i++;
                loadObjs(i);
                scene.add(root);					// custom distance material
            });
        }
        else{
            mtlLoader.load('assets/'+files[i]+'.mtl', (mtlParseResult) => {
                const materials = MtlObjBridge.addMaterialsFromMtlLoader(mtlParseResult);
                objLoader.setModelName(files[i]);

                objLoader.addMaterials(materials);
                objLoader.load('assets/'+files[i]+'.obj', (root) => {
                    //root.material.shadowSide = THREE.DoubleSide;
                    root.traverse( function ( child ) {
                        if ( child instanceof THREE.Mesh ) {
                            child.castShadow = true;
                            child.receiveShadow = true;
                        }
                    });
                    root.castShadow = true;
                    root.receiveShadow = true;  
                    i++;
                    loadObjs(i);
                    scene.add(root);					// custom distance material
                });
            });
        }
    }

    loadObjs(0);
    
    onWindowResize();
} 

function onWindowResize(event){
    renderer.setSize(window.innerWidth, window.innerHeight);
    uniforms.u_resolution.value.x = renderer.domElement.width;
    uniforms.u_resolution.value.y = renderer.domElement.height;
}

function animate(time){
    renderer.render(scene, camera);
}

function createObject(x, y, obj){

}

console.log(scene);