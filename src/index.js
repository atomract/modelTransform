import * as THREE from 'three';
import dat from 'dat.gui';
import { FlyControls  } from "three/examples/jsm/controls/FlyControls.js";
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';


  var scene, camera, renderer, threejs, controls, object, heliObj;
  var gui = null;
  

  var WIDTH = window.innerWidth,
      HEIGHT = window.innerHeight;

  var mesh, color;

  var de2ra = function(degree) { return degree*(Math.PI/180);};

  init();
  animate();

  function init() {
    threejs = document.getElementById('threejs');
    
    scene = new THREE.Scene();
    const objLoader = new OBJLoader()
    objLoader.load(
        '/F1.obj',
        (obj) => {
            obj.color = new THREE.Color(0x7393B3)
            object = obj
            scene.add(obj)
        },
        (xhr) => {
            console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
        },
        (error) => {
            console.log(error)
        }
    )

    objLoader.load(
      '/heli.obj',
      (heli) => {
        heli.position.x = 10
        heli.position.y = -2
        heliObj = heli
          scene.add(heli)
      },
      (xhr) => {
          console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
      },
      (error) => {
          console.log(error)
      }
  )

    renderer = new THREE.WebGLRenderer({antialias:true});
    renderer.setSize(WIDTH, HEIGHT);

    threejs.appendChild(renderer.domElement);

    camera = new THREE.PerspectiveCamera(45, WIDTH / HEIGHT, 1 , 1000);
    camera.position.set(0, 6, 6);
    camera.lookAt(scene.position);
    scene.add(camera);

    var planeGeometry = new THREE.BoxGeometry( 50, 50, 0.1 );
    var planeMaterial = new THREE.MeshLambertMaterial({
      color: 0x7393B3,
      ambient: 0x000000,
      side: THREE.DoubleSide
    });
    var planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
    planeMesh.position.set(0, -0., 0);
    planeMesh.rotation.set(0, 0, 0);
    planeMesh.rotation.x = de2ra(90);
    planeMesh.receiveShadow = true;
    scene.add(planeMesh);

    var object3d  = new THREE.DirectionalLight('white', 0.15);
    object3d.position.set(6,3,9);
    object3d.name = 'Back light';
    scene.add(object3d);

    object3d = new THREE.DirectionalLight('white', 0.35);
    object3d.position.set(-6, -3, 0);
    object3d.name   = 'Key light';
    scene.add(object3d);

    object3d = new THREE.DirectionalLight('white', 0.55);
    object3d.position.set(9, 9, 6);
    object3d.name = 'Fill light';
    scene.add(object3d);

    var spotLight = new THREE.SpotLight( 0xffffff );
    spotLight.position.set( 3, 30, 3 );
    spotLight.castShadow = true;
    spotLight.shadowMapWidth = 2048;
    spotLight.shadowMapHeight = 2048;
    spotLight.shadowCameraNear = 1;
    spotLight.shadowCameraFar = 4000;
    spotLight.shadowCameraFov = 45;
    scene.add( spotLight );

    

    controls = new FlyControls( camera, renderer.domElement );
    controls.movementSpeed = 1;
    controls.rollSpeed = Math.PI / 24;
    controls.autoForward = false;
    controls.dragToLook = true;
    // controls.enableKeys = true;
    // // controls = new PointerLockControls( camera, renderer.domElement );
    // controls.keys = {
    //   LEFT: 'ArrowLeft', //left arrow
    //   UP: 'ArrowUp', // up arrow
    //   RIGHT: 'ArrowRight', // right arrow
    //   BOTTOM: 'ArrowDown' // down arrow
    // }

    window.addEventListener( 'resize', onWindowResize, false );

    var controller = new function() {
      this.scaleX = 1;
      this.scaleY = 1;
      this.scaleZ = 1;
      this.positionX = 0;
      this.positionY = 0;
      this.positionZ = 0;
      this.rotationX = 0;
      this.rotationY = 90;
      this.rotationZ = 0;
    }();

    gui = new dat.GUI();
    var f1 = gui.addFolder('Scale');
    f1.add(controller, 'scaleX', 0.1, 5).onChange( function() {
       object.scale.x = (controller.scaleX);
       heliObj.scale.x = (controller.scaleX);
    });
    f1.add(controller, 'scaleY', 0.1, 5).onChange( function() {
       object.scale.y = (controller.scaleY);
       heliObj.scale.y = (controller.scaleY);
    });
    f1.add(controller, 'scaleZ', 0.1, 5).onChange( function() {
       object.scale.z = (controller.scaleZ);
       heliObj.scale.z = (controller.scaleZ);
    });

    var f2 = gui.addFolder('Position');
    f2.add(controller, 'positionX', -5, 5).onChange( function() {
       object.position.x = (controller.positionX);
       heliObj.position.x = (controller.positionX);
    });
    f2.add(controller, 'positionY', -3, 5).onChange( function() {
       object.position.y = (controller.positionY);
       heli.position.y = (controller.positionY);
    });
    f2.add(controller, 'positionZ', -5, 5).onChange( function() {
       object.position.z = (controller.positionZ);
       heli.position.z = (controller.positionZ);
    });

    var f3 = gui.addFolder('Rotation');
    f3.add(controller, 'rotationX', -180, 180).onChange( function() {
       object.rotation.x = de2ra(controller.rotationX);
       heli.rotation.x = de2ra(controller.rotationX);
    });
    f3.add(controller, 'rotationY', -180, 180).onChange( function() {
       object.rotation.y = de2ra(controller.rotationY);
       heli.rotation.y = de2ra(controller.rotationY);
    });
    f3.add(controller, 'rotationZ', -180, 180).onChange( function() {
       object.rotation.z = de2ra(controller.rotationZ);
       heli.rotation.z = de2ra(controller.rotationZ);
    });
  }

  function dec2hex(i) {
    var result = "0x000000";
    if (i >= 0 && i <= 15) { result = "0x00000" + i.toString(16); }
    else if (i >= 16 && i <= 255) { result = "0x0000" + i.toString(16); }
    else if (i >= 256 && i <= 4095) { result = "0x000" + i.toString(16); }
    else if (i >= 4096 && i <= 65535) { result = "0x00" + i.toString(16); }
    else if (i >= 65535 && i <= 1048575) { result = "0x0" + i.toString(16); }
    else if (i >= 1048575 ) { result = '0x' + i.toString(16); }
  if (result.length == 8){return result;}
   
  }

  function onWindowResize() {
    // windowHalfX = window.innerWidth / 2;
    // windowHalfY = window.innerHeight / 2;

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );
  }

  function animate() {
    requestAnimationFrame(animate);
    controls.update(0.1);
    renderScene();
  }

  function renderScene(){
    renderer.render(scene, camera);
  }