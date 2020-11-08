import React, { Component } from 'react';
import './Animation.css'
import * as THREE from 'three'
import snowImg from '../../images/smoke.png';

class Rain extends Component {
  constructor(props) {
    super(props);
    this.canvas = React.createRef();
    
  }


componentDidMount() {
    let scene,camera, renderer, cloudParticles = [], flash, rain, rainGeo, rainCount = 6800;
    let snowfalldiv = document.getElementById('snowfall');
    function init() {
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(60,window.innerWidth / window.innerHeight, 1, 1000);
      camera.position.z = 1;
      camera.rotation.x = 1.26;
      camera.rotation.y = -0.12;
      camera.rotation.z = 0.36;
      let ambient = new THREE.AmbientLight(0x555555);
      scene.add(ambient);
      let directionalLight = new THREE.DirectionalLight(0xffeedd);
      directionalLight.position.set(0,0,1);
      scene.add(directionalLight);
      flash = new THREE.PointLight(0x062d89, 30, 500 ,1.7);
      flash.position.set(200,300,100,400,500);
      scene.add(flash);
      renderer = new THREE.WebGLRenderer();
      scene.fog = new THREE.FogExp2(0x11111f, 0.002);
      renderer.setClearColor(scene.fog.color);
      renderer.setSize(window.innerWidth, window.innerHeight);

   

      snowfalldiv.appendChild(renderer.domElement)
      rainGeo = new THREE.Geometry();
      for(let i=0;i<rainCount;i++) {
        let rainDrop = new THREE.Vector3(
          Math.random() * 400 -200,
          Math.random() * 500 - 250,
          Math.random() * 400 - 200
        );
        rainDrop.velocity = {};
        rainDrop.velocity = 0;
        rainGeo.vertices.push(rainDrop);
      }
      let rainMaterial = new THREE.PointsMaterial({
        color: 'rgb(154, 190, 214)',
        size: 0.32,
        transparent: true
      });
      rain = new THREE.Points(rainGeo,rainMaterial);
      scene.add(rain);
      // function Image() {
      //   const texture = useLoader(THREE.TextureLoader, img)
      //   return (
      //     <mesh>
      //       <planeBufferGeometry attach="geometry" args={[3, 3]} />
      //       <meshBasicMaterial attach="material" map={texture} />
      //     </mesh>
      //   )
      // }
    
    
    
      let loader = new THREE.TextureLoader();
      loader.load("https://dm0qx8t0i9gc9.cloudfront.net/thumbnails/video/SRsQjwFQMjby34s1c/videoblocks-atmospheric-spooky-halloween-smoke-seamless-loop-abstract-magic-haze-and-fog-background-4k-cloud-in-slow-motion-on-black-3d-animation-vfx-element-overlay-with-puffs-slowly-floating-through-space_hyfeskzyh_thumbnail-1080_06.png", function(texture) {

        let cloudGeo = new THREE.PlaneBufferGeometry(800, 800);
       
      // var cloudGeo = new THREE.PlaneBufferGeometry( width, height, 0)
        var cloudMaterial = new THREE.MeshLambertMaterial({
          map: texture,
          alphaMap: texture,
          transparent: true
        });
        for(let p=0; p<50; p++) {
          var cloud = new THREE.Mesh(cloudGeo, cloudMaterial);
          cloud.position.set(
            Math.random()*800 -400,
            500,
            Math.random()*500-500
          );
          cloud.rotation.x = 1.16;
          cloud.rotation.y = -0.12;
          cloud.rotation.z = Math.random()*2*Math.PI;
          cloud.material.opacity = 0.55;
          cloudParticles.push(cloud);
          scene.add(cloud);
          }
        animate();
      });
    }
    
    function animate() {
      cloudParticles.forEach(p => {
        p.rotation.z -=0.002;
      });
      rainGeo.vertices.forEach(p => {
        p.velocity -= 0.1 + Math.random() * 0.1;
        p.y += p.velocity;
        if (p.y < -200) {
          p.y = 200;
          p.velocity = 0;
        }
      });
      rainGeo.verticesNeedUpdate = true;
      rain.rotation.y +=0.002;
      if(Math.random() > 0.93 || flash.power > 100) {
        if(flash.power < 100) 
          flash.position.set(
            Math.random()*400,
            300 + Math.random() *200,
            100, Math.random()*500,
            300
          );
        flash.power = 50 + Math.random() * 500;
      }
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    }
    init();
    
 }

  render() {

    return <div class="rainfall" id="snowfall"></div>
    
    // return <canvas width="1250px" height="800px" ref={this.canvas}>
    // </canvas>;

  }
}

export default Rain;