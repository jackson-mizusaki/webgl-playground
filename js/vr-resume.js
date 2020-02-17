import * as THREE from '../js/three.module.js';
import { VRButton } from '../js/VRButton.js';
import {OBJLoader2} from '../js/OBJLoader2.js';
import { MTLLoader } from '../js/MTLLoader.js';
import {MtlObjBridge} from '../js/obj2/bridge/MtlObjBridge.js';

var canvas;
var camera, scene, renderer;
var uniforms;

init();
renderer.setAnimationLoop(animate);



function init(){
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xaaaaaa);
    scene.add( new THREE.AmbientLight( 0x111122 ) );

    canvas = document.createElement('canvas');
    var context = canvas.getContext({alpha: false});


    renderer = new THREE.WebGLRenderer({canvas: canvas, context:context});
    renderer.xr.enabled = true;
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.physicallyCorrectLights = true;
    // Add VR button 
    document.body.appendChild(VRButton.createButton(renderer));
    // Add renderer
    document.body.appendChild(renderer.domElement);

    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 50);
    camera.position.set(0, 1.6, 3);
    scene.add(camera);

    var light = new THREE.SpotLight(0xffffff, 5, 20);
    light.position.set(0,3,0);
    light.castShadow = true;
    light.shadow.mapSize.width = 512;  // default
    light.shadow.mapSize.height = 512; // default
    light.shadow.camera.near = 0.5;       // default
    light.shadow.camera.far = 500      // default
    
    scene.add(light);
    var helper = new THREE.SpotLightHelper(light);

   // var helper = new THREE.CameraHelper( light.shadow.camera );
    scene.add( helper );

   // var geometry = new THREE.SphereBufferGeometry(0.1);
    //var sphereMaterial = new THREE.MeshBasicMaterial(0xff0000);
    //var mesh = new THREE.Mesh(geometry, sphereMaterial);
    //mesh.position.set(0,5,0);
   // scene.add(mesh);
    
   let objLoader = new OBJLoader2();
    let mtlLoader = new MTLLoader();
    let files = ['Monitor', 'Tower', 'Desk'];

    function loadObjs(i){
        if (i > files.length-1){
            return;
        }
        mtlLoader = new MTLLoader();
        objLoader = new OBJLoader2();

        mtlLoader.load('assets/'+files[i]+'.mtl', (mtlParseResult) => {
            const materials = MtlObjBridge.addMaterialsFromMtlLoader(mtlParseResult);
            objLoader.setModelName(files[i]);
            objLoader.addMaterials(materials);
            objLoader.load('assets/'+files[i]+'.obj', (root) => {
                root.castShadow = true;
                root.receiveShadow = true;  

                i++;
                loadObjs(i);
                scene.add(root);					// custom distance material
           

            });
        });
    }

    loadObjs(0);
    
    // mtlLoader.load('assets/Monitor.mtl', (mtlParseResult) => {
    //     const monitorMaterials = MtlObjBridge.addMaterialsFromMtlLoader(mtlParseResult);
    //     objLoader.setModelName('monitor');
    //     objLoader.addMaterials(monitorMaterials);
    //     objLoader.load('assets/Monitor.obj', (r) => {
    //         scene.add(r);    
    //         mtlLoader.load('assets/Tower.mtl', (m) => {
    //             const towerMaterials = MtlObjBridge.addMaterialsFromMtlLoader(m);
    //             objLoader.setModelName('tower');
    //             objLoader.addMaterials(towerMaterials);
    //             objLoader.load('assets/Tower.obj', (a) => {
    //                 scene.add(a);
    //                 mtlLoader.load('assets/Desk.mtl', (p) => {
    //                     const deskMaterials = MtlObjBridge.addMaterialsFromMtlLoader(p);
    //                     objLoader.setModelName('desk');
    //                     objLoader.addMaterials(deskMaterials);
    //                     objLoader.load('assets/Desk.obj', (root) => {
    //                         scene.add(root);
    //                     });
    //                 });
    //             });
    //         });
    //     });
    // });


    

}
function animate(time){
    renderer.render(scene, camera);
}


function createObject(x, y, obj){

}