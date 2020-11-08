//3d scene qua cau xoay

// Get the canvas element from the DOM
const canvas = document.querySelector('#scene');
canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;
// Store the 2D context
const ctx = canvas.getContext('2d');

if (window.devicePixelRatio > 1) {
  canvas.width = canvas.clientWidth * 2;
  canvas.height = canvas.clientHeight * 2;
  ctx.scale(2, 2);
}

/* ====================== */
/* ====== VARIABLES ===== */
/* ====================== */
let width = canvas.clientWidth; // Width of the canvas
let height = canvas.clientHeight; // Height of the canvas
let rotation = 0; // Rotation of the globe
let dots = []; // Every dots in an array

/* ====================== */
/* ====== CONSTANTS ===== */
/* ====================== */
/* Some of those constants may change if the user resizes their screen but I still strongly believe they belong to the Constants part of the variables */
const DOTS_AMOUNT = 1000; // Amount of dots on the screen
const DOT_RADIUS = 4; // Radius of the dots
let GLOBE_RADIUS = width * 0.7; // Radius of the globe
let GLOBE_CENTER_Z = -GLOBE_RADIUS; // Z value of the globe center
let PROJECTION_CENTER_X = width / 2; // X center of the canvas HTML
let PROJECTION_CENTER_Y = height / 2; // Y center of the canvas HTML
let FIELD_OF_VIEW = width * 0.8;

class Dot {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
    
    this.xProject = 0;
    this.yProject = 0;
    this.sizeProjection = 0;
  }
  // Do some math to project the 3D position into the 2D canvas
  project(sin, cos) {
    const rotX = cos * this.x + sin * (this.z - GLOBE_CENTER_Z);
    const rotZ = -sin * this.x + cos * (this.z - GLOBE_CENTER_Z) + GLOBE_CENTER_Z;
    this.sizeProjection = FIELD_OF_VIEW / (FIELD_OF_VIEW - rotZ);
    this.xProject = (rotX * this.sizeProjection) + PROJECTION_CENTER_X;
    this.yProject = (this.y * this.sizeProjection) + PROJECTION_CENTER_Y;
  }
  // Draw the dot on the canvas
  draw(sin, cos) {
    this.project(sin, cos);
    // ctx.fillRect(this.xProject - DOT_RADIUS, this.yProject - DOT_RADIUS, DOT_RADIUS * 2 * this.sizeProjection, DOT_RADIUS * 2 * this.sizeProjection);
    ctx.beginPath();
    ctx.arc(this.xProject, this.yProject, DOT_RADIUS * this.sizeProjection, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
  }
}

function createDots() {
  // Empty the array of dots
  dots.length = 0;
  
  // Create a new dot based on the amount needed
  for (let i = 0; i < DOTS_AMOUNT; i++) {
    const theta = Math.random() * 2 * Math.PI; // Random value between [0, 2PI]
    const phi = Math.acos((Math.random() * 2) - 1); // Random value between [-1, 1]
    
    // Calculate the [x, y, z] coordinates of the dot along the globe
    const x = GLOBE_RADIUS * Math.sin(phi) * Math.cos(theta);
    const y = GLOBE_RADIUS * Math.sin(phi) * Math.sin(theta);
    const z = (GLOBE_RADIUS * Math.cos(phi)) + GLOBE_CENTER_Z;
    dots.push(new Dot(x, y, z));
  }
}

/* ====================== */
/* ======== RENDER ====== */
/* ====================== */
function render(a) {
  // Clear the scene
  ctx.clearRect(0, 0, width, height);
  
  // Increase the globe rotation
  rotation = a * 0.0004;
  
  const sineRotation = Math.sin(rotation); // Sine of the rotation
  const cosineRotation = Math.cos(rotation); // Cosine of the rotation
  
  // Loop through the dots array and draw every dot
  for (var i = 0; i < dots.length; i++) {
    dots[i].draw(sineRotation, cosineRotation);
  }
  
  window.requestAnimationFrame(render);
}


// Function called after the user resized its screen
function afterResize () {
  width = canvas.offsetWidth;
  height = canvas.offsetHeight;
  if (window.devicePixelRatio > 1) {
    canvas.width = canvas.clientWidth * 2;
    canvas.height = canvas.clientHeight * 2;
    ctx.scale(2, 2);
  } else {
    canvas.width = width;
    canvas.height = height;
  }
  GLOBE_RADIUS = width * 0.7;
  GLOBE_CENTER_Z = -GLOBE_RADIUS;
  PROJECTION_CENTER_X = width / 2;
  PROJECTION_CENTER_Y = height / 2;
  FIELD_OF_VIEW = width * 0.8;
  
  createDots(); // Reset all dots
}

// Variable used to store a timeout when user resized its screen
let resizeTimeout;
// Function called right after user resized its screen
function onResize () {
  // Clear the timeout variable
  resizeTimeout = window.clearTimeout(resizeTimeout);
  // Store a new timeout to avoid calling afterResize for every resize event
  resizeTimeout = window.setTimeout(afterResize, 500);
}
window.addEventListener('resize', onResize);

// Populate the dots array with random dots
createDots();

// Render the scene
window.requestAnimationFrame(render);
  draw() {
    const { audioData } = this.props;
    const canvas = this.canvas.current;
    const height = canvas.height;
    const width = canvas.width;
    const context = canvas.getContext('2d');
    let x = 0;
    const sliceWidth = (width * 1.0) / audioData.length;

    context.lineWidth = 2;
    context.strokeStyle = '#000000';
    context.clearRect(0, 0, width, height);

    context.beginPath();
    context.moveTo(0, height / 2);
    for (const item of audioData) {
      const y = (item / 255.0) * height;
      context.lineTo(x, y);
      x += sliceWidth;
    }
    context.lineTo(x, height / 2);
    context.stroke();
  }
 
  render() {
    return <canvas  width="500" height="500" ref={this.canvas} id="scene"></canvas>;
  }
}

export default AudioVisualiser;


//Hieu ung mat bao
<!DOCTYPE html>
<html>
  <head>
    <meta http-equiv="content-type" content="text/html; charset=UTF-8" />
    <link rel="stylesheet" type="text/css" href="styles.css" />
    <script src="three.min.js"></script>
  </head>
  <body>
    <script>
    var scene, sceneLight, portalLight, cam, renderer, clock ,portalParticles = [],smokeParticles = [] ;

function initScene(){
    scene = new THREE.Scene();

    sceneLight = new THREE.DirectionalLight(0xffffff,0.5);
    sceneLight.position.set(0,0,1);
    scene.add(sceneLight);

    portalLight = new THREE.PointLight(0x062d89, 30, 600, 1.7);
    portalLight.position.set(0,0,250);
    scene.add(portalLight);

    cam = new THREE.PerspectiveCamera(80,window.innerWidth/window.innerHeight,1,10000);
    cam.position.z = 1000;
    scene.add(cam);

    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(0x000000,1);
    renderer.setSize(window.innerWidth , window.innerHeight);
    document.body.appendChild(renderer.domElement);

    particleSetup();
}
function particleSetup() {
    let loader = new THREE.TextureLoader();

    loader.load("smoke.png", function (texture){
        portalGeo = new THREE.PlaneBufferGeometry(350,350);
        portalMaterial = new THREE.MeshStandardMaterial({
            map:texture,
            transparent: true
        });
        smokeGeo = new THREE.PlaneBufferGeometry(1000,1000);
        smokeMaterial = new THREE.MeshStandardMaterial({
            map:texture,
            transparent: true
        });

        for(let p=880;p>250;p--) {
            let particle = new THREE.Mesh(portalGeo,portalMaterial);
            particle.position.set(
                0.5 * p * Math.cos((4 * p * Math.PI) / 180),
                0.5 * p * Math.sin((4 * p * Math.PI) / 180),
                0.1 * p
            );
            particle.rotation.z = Math.random() *360;
            portalParticles.push(particle);
            scene.add(particle);
        }

        for(let p=0;p<40;p++) {
            let particle = new THREE.Mesh(smokeGeo,smokeMaterial);
            particle.position.set(
                Math.random() * 1000-500,
                Math.random() * 400-200,
                25
            );
            particle.rotation.z = Math.random() *360;
            particle.material.opacity = 0.6;
            portalParticles.push(particle);
            scene.add(particle);
        }
        clock = new THREE.Clock();
        animate();
        
    });
}
function animate() {
    let delta = clock.getDelta();
    portalParticles.forEach(p => {
        p.rotation.z -= delta *1.5;
    });
    smokeParticles.forEach(p => {
        p.rotation.z -= delta *0.2;
    });
    if(Math.random() > 0.9) {
        portalLight.power =350 + Math.random()*500;
    }
    renderer.render(scene,cam);
    requestAnimationFrame(animate);
}
        initScene();
    </script>
  </body>
</html>





loading html
xxxxxxxxxx
 
1
<body
  <div class="wrapper"
  <div class="line line1"
    <span class="circle circle-top"></span
    <div class="dotted"
      <span class="dot dot-middle-top"></span
      <span class="dot dot-middle-bottom"></span
      <span class="dot dot-bottom"></span>
    </div>
    <span class="circle circle-bottom"></span>
  </div>
  <div class="line line2"
    <span class="circle circle-top"></span
    <div class="dotted">
      <span class="dot dot-top"></span>
      <span class="dot dot-middle-top"></span>
      <span class="dot dot-middle-bottom"></span>
      <span class="dot dot-bottom"></span>
    </div>
    <span class="circle circle-bottom"></span>
  </div>
  <div class="line line3">
    <span class="circle circle-top"></span
    <div class="dotted">
      <span class="dot dot-top"></span>
      <span class="dot dot-middle-top"></span
      <span class="dot dot-middle-bottom"></span>
      <span class="dot dot-bottom"></span>
    </div>
    <span class="circle circle-bottom"></span>
  </div>
  <div class="line line4">
    <span class="circle circle-top"></span>
    <div class="dotted">
      <span class="dot dot-top"></span>
      <span class="dot dot-middle-top"></span>
      <span class="dot dot-middle-bottom"></span>
      <span class="dot dot-bottom"></span>
    </div>
    <span class="circle circle-bottom"></span>
  </div>
  <div class="line line5"
    <span class="circle circle-top"></span
    <div class="dotted">
      <span class="dot dot-top"></span>
      <span class="dot dot-middle-top"></span>
      <span class="dot dot-middle-bottom"></span>
      <span class="dot dot-bottom"></span
    </div>
    <span class="circle circle-bottom"></span>
  </div>
  <div class="line line6"
    <span class="circle circle-top"></span>
    <div class="dotted">
      <span class="dot dot-top"></span>
      <span class="dot dot-middle-top"></span>
      <span class="dot dot-middle-bottom"></span>
      <span class="dot dot-bottom"></span>
    </div>
    <span class="circle circle-bottom"></span>
  </div>
  <div class="line line7">
    <span class="circle circle-top"></span>
    <div class="dotted">
      <span class="dot dot-top"></span>
      <span class="dot dot-middle-top"></span
      <span class="dot dot-middle-bottom"></span>
      <span class="dot dot-bottom"></span>
    </div>
    <span class="circle circle-bottom"></span>
  </div>
  <div class="line line8">
    <span class="circle circle-top"></span>
    <div class="dotted">
      <span class="dot dot-top"></span>
      <span class="dot dot-middle-top"></span>
      <span class="dot dot-middle-bottom"></span
      <span class="dot dot-bottom"></span>
    </div>
    <span class="circle circle-bottom"></span
  </div>
  <div class="line line9">
    <span class="circle circle-top"></span>
    <div class="dotted">
      <span class="dot dot-top"></span>
      <span class="dot dot-middle-top"></span>
      <span class="dot dot-middle-bottom"></span>
      <span class="dot dot-bottom"></span>
    </div>
    <span class="circle circle-bottom"></span>
  </div>
  <div class="line line10">
    <span class="circle circle-top"></span>
    <div class="dotted">
      <span class="dot dot-top"></span>
      <span class="dot dot-middle-top"></span>
      <span class="dot dot-middle-bottom"></span>
      <span class="dot dot-bottom"></span>

    </div>

    <span class="circle circle-bottom"></span>

  </div>

  <div class="line line11">

    <span class="circle circle-top"></span>

    <div class="dotted">

      <span class="dot dot-top"></span>

      <span class="dot dot-middle-top"></span>
      <span class="dot dot-middle-bottom"></span>

      <span class="dot dot-bottom"></span>

    </div>

    <span class="circle circle-bottom"></span>

  </div>

</div>

  <footer>

    <p style="color: #fff">Inspired by <a href="https://dribbble.com/shots/1763719-DNA-GIF">Handel Eugene <img src="https://d13yacurqjgara.cloudfront.net/assets/dribbble-ball-dnld-5992b20594860fdfef86a503773447ae.png" alt="dribble"></a></p>

  </footer>

</body>



loadind css

​
    .wrapper{
      position: absolute;
      float: left;
      margin: 140px 100px;
    }
​
    .line{
      position: absolute;
      top: 0px;
      width: 2px;
      height: 8px;
      background-color: red;
    }
30
​
    .circle{
      position: absolute;
      display: block;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: blue;
    }
    .circle-top{
      top: 0px;
      left: -3.5px;
    }
    .circle-bottom{
      bottom: 0px;
      left: -3.5px;
    }
​
    .dot{
      position: absolute;
      display: block;
      width: 4px;
      height: 4px;
      border-radius: 50%;
      left: -1.5px;
    }
​
    .line1{
      margin-left: 0px;
      background-color: #2410CB;
      -webkit-animation: line 2s cubic-bezier(0.250, 0, 0.705, 1) infinite;
      animation: line 2s cubic-bezier(0.250, 0, 0.705, 1) infinite;
    }
    .line1 > span{
      background-color: #D4141E;
    }
    .line1 > .dotted > .dot{
      background-color: #D4141E;
    }
    .line1 > .dotted > .dot-top{
      top: 0px;
      -webkit-animation: dot-top 2s cubic-bezier(0.250, 0, 0.705, 1) infinite;
      animation: dot-top 2s cubic-bezier(0.250, 0, 0.705, 1) infinite;
    }
    .line1 > .dotted > .dot-bottom{
      bottom: 0px;
      -webkit-animation: dot-bottom 2s cubic-bezier(0.250, 0, 0.705, 1) infinite;
      animation: dot-bottom 2s cubic-bezier(0.250, 0, 0.705, 1) infinite;
    }
    .line1 > .dotted > .dot-middle-top{
      top: 0px;
      -webkit-animation: dot-middle-top 2s cubic-bezier(0.250, 0, 0.705, 1) infinite;
      animation: dot-middle-top 2s cubic-bezier(0.250, 0, 0.705, 1) infinite;
    }
    .line1 > .dotted > .dot-middle-bottom{
      bottom: 0px;
      -webkit-animation: dot-middle-bottom 2s cubic-bezier(0.250, 0, 0.705, 1) infinite;
      animation: dot-middle-bottom 2s cubic-bezier(0.250, 0, 0.705, 1) infinite;
    }
​
    .line2{
      margin-left: 35px;
      background-color: #852DF4;
      -webkit-animation: line 2s cubic-bezier(0.250, 0, 0.705, 1) .05s infinite;
      animation: line 2s cubic-bezier(0.250, 0, 0.705, 1) .05s infinite;
    }
    .line2 > span{
      background-color: #FC7E48;
    }
    .line2 > .dotted > .dot{

      background-color: #FC7E48;

    }

    .line2 > .dotted > .dot-top{

      top: 0px;

      -webkit-animation: dot-top 2s cubic-bezier(0.250, 0, 0.705, 1) .05s infinite;

      animation: dot-top 2s cubic-bezier(0.250, 0, 0.705, 1) .05s infinite;

    }

    .line2 > .dotted > .dot-bottom{

      bottom: 0px;

      -webkit-animation: dot-bottom 2s cubic-bezier(0.250, 0, 0.705, 1) .05s infinite;

      animation: dot-bottom 2s cubic-bezier(0.250, 0, 0.705, 1) .05s infinite;

    }

    .line2 > .dotted > .dot-middle-top{

      top: 0px;

      -webkit-animation: dot-middle-top 2s cubic-bezier(0.250, 0, 0.705, 1) .05s infinite;

      animation: dot-middle-top 2s cubic-bezier(0.250, 0, 0.705, 1) .05s infinite;

    }

    .line2 > .dotted > .dot-middle-bottom{

      bottom: 0px;

      -webkit-animation: dot-middle-bottom 2s cubic-bezier(0.250, 0, 0.705, 1) .05s infinite;

      animation: dot-middle-bottom 2s cubic-bezier(0.250, 0, 0.705, 1) .05s infinite;

    }

​

    .line3{

      margin-left: 70px;

      background-color: #F42DF1;

      -webkit-animation: line 2s cubic-bezier(0.250, 0, 0.705, 1) .1s infinite;

      animation: line 2s cubic-bezier(0.250, 0, 0.705, 1) .1s infinite;

    }

    .line3 > span{

      background-color: #EDEB29;

    }

    .line3 > .dotted > .dot{

      background-color: #EDEB29;

    }

    .line3 > .dotted > .dot-top{

      top: 0px;

      -webkit-animation: dot-top 2s cubic-bezier(0.250, 0, 0.705, 1) .1s infinite;

      animation: dot-top 2s cubic-bezier(0.250, 0, 0.705, 1) .1s infinite;

    }

    .line3 > .dotted > .dot-bottom{

      bottom: 0px;

      -webkit-animation: dot-bottom 2s cubic-bezier(0.250, 0, 0.705, 1) .1s infinite;

      animation: dot-bottom 2s cubic-bezier(0.250, 0, 0.705, 1) .1s infinite;

    }

    .line3 > .dotted > .dot-middle-top{

      top: 0px;

      -webkit-animation: dot-middle-top 2s cubic-bezier(0.250, 0, 0.705, 1) .1s infinite;

      animation: dot-middle-top 2s cubic-bezier(0.250, 0, 0.705, 1) .1s infinite;

    }

    .line3 > .dotted > .dot-middle-bottom{

      bottom: 0px;

      -webkit-animation: dot-middle-bottom 2s cubic-bezier(0.250, 0, 0.705, 1) .1s infinite;

      animation: dot-middle-bottom 2s cubic-bezier(0.250, 0, 0.705, 1) .1s infin
    }

​

    .line4{

      margin-left: 105px;

      background-color: #F91396;

      -webkit-animation: line 2s cubic-bezier(0.250, 0, 0.705, 1) .15s infinite;

      animation: line 2s cubic-bezier(0.250, 0, 0.705, 1) .15s infinite;

    }

    .line4 > span{

      background-color: #ACED29;

    }

    .line4 > .dotted > .dot{

      background-color: #ACED29;

    }

    .line4 > .dotted > .dot-top{
      top: 0px;
      -webkit-animation: dot-top 2s cubic-bezier(0.250, 0, 0.705, 1) .15s infinite;
      animation: dot-top 2s cubic-bezier(0.250, 0, 0.705, 1) .15s infinite;
    }
    .line4 > .dotted > .dot-bottom{
      bottom: 0px;
      -webkit-animation: dot-bottom 2s cubic-bezier(0.250, 0, 0.705, 1) .15s infinite;
      animation: dot-bottom 2s cubic-bezier(0.250, 0, 0.705, 1) .15s infinite;
    }
    .line4 > .dotted > .dot-middle-top{
      top: 0px;
      -webkit-animation: dot-middle-top 2s cubic-bezier(0.250, 0, 0.705, 1) .15s infinite;
      animation: dot-middle-top 2s cubic-bezier(0.250, 0, 0.705, 1) .15s infinite;
    }
    .line4 > .dotted > .dot-middle-bottom{
      bottom: 0px;
      -webkit-animation: dot-middle-bottom 2s cubic-bezier(0.250, 0, 0.705, 1) .15s infinite;
      animation: dot-middle-bottom 2s cubic-bezier(0.250, 0, 0.705, 1) .15s infinite;
    }
​
    .line5{
      margin-left: 140px;
      background-color: #D4141E;
      -webkit-animation: line 2s cubic-bezier(0.250, 0, 0.705, 1) .2s infinite;
      animation: line 2s cubic-bezier(0.250, 0, 0.705, 1) .2s infinite;
    }
    .line5 > span{
      background-color: #4EF02B;
    }
    .line5 > .dotted > .
      background-color: #4EF02B;
    }
    .line5 > .dotted > .dot-top{
      top: 0px;
      -webkit-animation: dot-top 2s cubic-bezier(0.250, 0, 0.705, 1) .2s infinite;
      animation: dot-top 2s cubic-bezier(0.250, 0, 0.705, 1) .2s infinite;
    }
    .line5 > .dotted > .dot-bottom{
      bottom: 0px;
      -webkit-animation: dot-bottom 2s cubic-bezier(0.250, 0, 0.705, 1) .2s infinite;
      animation: dot-bottom 2s cubic-bezier(0.250, 0, 0.705, 1) .2s infinite;
    }
    .line5 > .dotted > .dot-middle-top{
      top: 0px;
      -webkit-animation: dot-middle-top 2s cubic-bezier(0.250, 0, 0.705, 1) .2s infinite;
      animation: dot-middle-top 2s cubic-bezier(0.250, 0, 0.705, 1) .2s infinite;
    }
    .line5 > .dotted > .dot-middle-bottom{
      bottom: 0px;
      -webkit-animation: dot-middle-bottom 2s cubic-bezier(0.250, 0, 0.705, 1) .2s infinite;
      animation: dot-middle-bottom 2s cubic-bezier(0.250, 0, 0.705, 1) .2s infinite;
    }
​
    .line6{
      margin-left: 175px;
      background-color: #FC7E48;
      -webkit-animation: line 2s cubic-bezier(0.250, 0, 0.705, 1) .25s infinite;
      animation: line 2s cubic-bezier(0.250, 0, 0.705, 1) .25s infinite;
    }
    .line6 > s
      background-color: #38E790;
    }
    .line6 > .dotted > .dot{
      background-color: #38E790;
    }
    .line6 > .dotted > .dot-top{
      top: 0px;
      -webkit-animation: dot-top 2s cubic-bezier(0.250, 0, 0.705, 1) .25s infinite;
      animation: dot-top 2s cubic-bezier(0.250, 0, 0.705, 1) .25s infinite;
    }
    .line6 > .dotted > .dot-bottom{
      bottom: 0px;
      -webkit-animation: dot-bottom 2s cubic-bezier(0.250, 0, 0.705, 1) .25s infinite;
      animation: dot-bottom 2s cubic-bezier(0.250, 0, 0.705, 1) .25s infinite;
    }
    .line6 > .dotted > .dot-middle-top{
      top: 0px;
      -webkit-animation: dot-middle-top 2s cubic-bezier(0.250, 0, 0.705, 1) .25s infinite;
      animation: dot-middle-top 2s cubic-bezier(0.250, 0, 0.705, 1) .25s infin
    .line6 > .dotted > .dot-middle-bot
      bottom: 
      -webkit-animation: dot-middle-bottom 2s cubic-bezier(0.250, 0, 0.705, 1) .25s infin
      animation: dot-middle-bottom 2s cubic-bezier(0.250, 0, 0.705, 1) .25s infin
      .line7{
            margin-left: 210px;
            background-color: #EDEB29;
            -webkit-animation: line 2s cubic-bezier(0.250, 0, 0.705, 1) .3s infinite;
            animation: line 2s cubic-bezier(0.250, 0, 0.705, 1) .3s infinite;
          }
          .line7 > span{
            background-color: #25EACC;
          }
          .line7 > .dotted > .dot{
            background-color: #25EACC;
          }
          .line7 > .dotted > .dot-top{
            top: 0px;
            -webkit-animation: dot-top 2s cubic-bezier(0.250, 0, 0.705, 1) .3s infinite;
            animation: dot-top 2s cubic-bezier(0.250, 0, 0.705, 1) .3s infinite;
          }
          .line7 > .dotted > .dot-bottom{
            bottom: 0px;
            -webkit-animation: dot-bottom 2s cubic-bezier(0.250, 0, 0.705, 1) .3s infinite;
            animation: dot-bottom 2s cubic-bezier(0.250, 0, 0.705, 1) .3s infinite;
          }
          .line7 > .dotted > .dot-middle-top{
            top: 0px;
            -webkit-animation: dot-middle-top 2s cubic-bezier(0.250, 0, 0.705, 1) .3s infinite;
            animation: dot-middle-top 2s cubic-bezier(0.250, 0, 0.705, 1) .3s infinite;
          }
          .line7 > .dotted > .dot-middle-bottom{
            bottom: 0px;
            -webkit-animation: dot-middle-bottom 2s cubic-bezier(0.250, 0, 0.705, 1) .3s infinite;
            animation: dot-middle-bottom 2s cubic-bezier(0.250, 0, 0.705, 1) .3s infinite;
          }
    .line8 > span{
      background-color: #309CDF;
    }
    .line8 > .dotted > .dot{
      background-color: #309CDF;
    }
    .line8 > .dotted > .dot-top{
      top: 0px;
      -webkit-animation: dot-top 2s cubic-bezier(0.250, 0, 0.705, 1) .35s infinite;
      animation: dot-top 2s cubic-bezier(0.250, 0, 0.705, 1) .35s iite;
    }
    .line8 > .dotted > .dot-bottom{
      bottom: 0px;
      -webkit-animation: dot-bottom 2s cubic-bezier(0.250, 0, 0.705, 1) .35s infinite;
      animation: dot-bottom 2s cubic-bezier(0.250, 0, 0.705, 1) .35s infinite;
    }
    .line8 > .dotted > .dot-middle-top{
      top: 0px;
      -webkit-animation: dot-middle-top 2s cubic-bezier(0.250, 0, 0.705, 1) .35s infinite;
      animation: dot-middle-top 2s cubic-bezier(0.250, 0, 0.705, 1) .35s infinite;
    }
    .line8 > .dotted > .dot-middle-bottom{
      bottom: 0px;
      -webkit-animation: dot-middle-bottom 2s cubic-bezier(0.250, 0, 0.705, 1) .35s infinite;
      animation: dot-middle-bottom 2s cubic-bezier(0.250, 0, 0.705, 1) .35s infinite;
    }
​
    .line9{
      margin-left: 280px;
      background-color: #4EF02B;
      -webkit-animation: line 2s cubic-bezier(0.250, 0, 0.705, 1) .4s infinite;
      animation: line 2s cubic-bezier(0.250, 0, 0.705, 1) .4s infinite;
    }
    .line9 > span{
      background-color: #2544E7;
    }
    .line9 > .dotted > .dot{
      background-color: #2544E7;
    }
    .line9 > .dotted > .dot-top{
      top: 0px;
      -webkit-animation: dot-top 2s cubic-bezier(0.250, 0, 0.705, 1) .4s infinite;
      animation: dot-top 2s cubic-bezier(0.250, 0, 0.705, 1) .4s infinite;
    }
    .line9 > .dotted > .dot-bottom{
      bottom: 0px;
      -webkit-animation: dot-bottom 2s cubic-bezier(0.250, 0, 0.705, 1) .4s infinite;
      animation: dot-bottom 2s cubic-bezier(0.250, 0, 0.705, 1) .4s infinite;
    }
    .line9 > .dotted > .dot-middle-top{
      top: 0px;
      -webkit-animation: dot-middle-top 2s cubic-bezier(0.250, 0, 0.705, 1) .4s infinite;
      animation: dot-middle-top 2s cubic-bezier(0.250, 0, 0.705, 1) .4s infinite;
    }
    .line9 > .dotted > .dot-middle-bottom{
      bottom: 0px;
      -webkit-animation: dot-middle-bottom 2s cubic-bezier(0.250, 0, 0.705, 1) .4s infinite;
      animation: dot-middle-bottom 2s cubic-bezier(0.250, 0, 0.705, 1) .4s infinite;
    }
​
    .line10{
      margin-left: 315px;
      background-color: #38E790;
      -webkit-animation: line 2s cubic-bezier(0.250, 0, 0.705, 1) .45s infinite;
      animation: line 2s cubic-bezier(0.250, 0, 0.705, 1) .45s infinite;
    }
    .line10 > span{
      background-color: #852DF4;
    }
    .line10 > .dotted > .dot{
      background-color: #852DF4;
    }
    .line10 > .dotted > .dot-top{
      top: 0px;
      -webkit-animation: dot-top 2s cubic-bezier(0.250, 0, 0.705, 1) .45s infinite;
      animation: dot-top 2s cubic-bezier(0.250, 0, 0.705, 1) .45s infinite;
    }
    .line10 > .dotted > .dot-bottom{
      bottom: 0px;
      -webkit-animation: dot-bottom 2s cubic-bezier(0.250, 0, 0.705, 1) .45s infinite;
      animation: dot-bottom 2s cubic-bezier(0.250, 0, 0.705, 1) .45s infinite;
    }
    .line10 > .dotted > .dot-middle-top{
      top: 0px;
      -webkit-animation: dot-middle-top 2s cubic-bezier(0.250, 0, 0.705, 1) .45s infinite;
      animation: dot-middle-top 2s cubic-bezier(0.250, 0, 0.705, 1) .45s infinite;
    }
    .line10 > .dotted > .dot-middle-bottom{
      bottom: 0px;
      -webkit-animation: dot-middle-bottom 2s cubic-bezier(0.250, 0, 0.705, 1) .45s infinite;
      animation: dot-middle-bottom 2s cubic-bezier(0.250, 0, 0.705, 1) .45s infinite;
    }
​
    .line11{
      margin-left: 350px;
      background-color: #25EACC;
      -webkit-animation: line 2s cubic-bezier(0.250, 0, 0.705, 1) .5s infinite;
      animation: line 2s cubic-bezier(0.250, 0, 0.705, 1) .5s infinite;
    }
    .line11 > span{
      background-color: #F42DF1;
    }
    .line11 > .dotted > .dot{
      background-color: #F42DF1;
    }
    .line11 > .dotted > .dot-top{
      top: 0px;
      -webkit-animation: dot-top 2s cubic-bezier(0.250, 0, 0.705, 1) .5s infinite;
      animation: dot-top 2s cubic-bezier(0.250, 0, 0.705, 1) .5s infinite;
​
    }
    .line11 > .dotted > .dot-bottom{
      bottom: 0px;
      -webkit-animation: dot-bottom 2s cubic-bezier(0.250, 0, 0.705, 1) .5s infinite;
      animation: dot-bottom 2s cubic-bezier(0.250, 0, 0.705, 1) .5s infinite;
    }
    .line11 > .dotted > .dot-middle-top{
      top: 0px;
      -webkit-animation: dot-middle-top 2s cubic-bezier(0.250, 0, 0.705, 1) .5s infinite;
      animation: dot-middle-top 2s cubic-bezier(0.250, 0, 0.705, 1) .5s infinite;
    }
    .line11 > .dotted > .dot-middle-bottom{
      bottom: 0px;
      -webkit-animation: dot-middle-bottom 2s cubic-bezier(0.250, 0, 0.705, 1) .5s infinite;
      animation: dot-middle-bottom 2s cubic-bezier(0.250, 0, 0.705, 1) .5s infinite;
    }
​
    @-webkit-keyframes line{
      0%{height: 4px; top: 0px; left: 0px; -webkit-transform: rotate(-65deg)}
      10%{height: 220px; top: -110px; left: 15px;}
      45%{height: 200px; top: -100px; left: 25px;}
      70%{height: 8px; top: 0px; left: 25px; -webkit-transform: rotate(0deg);}
      100%{height: 8px; top: 0px; left: 15px; -webkit-transform: rotate(0deg);}
    }
    @-webkit-keyframes dot-top{
      0%{top: -30px}
      10%{top: -30px;}
      45%{top: -25px;}
      60%{top: 0px;}
      100%{top: 0px;}
    }
    @-webkit-keyframes dot-bottom{
      0%{bottom: -30px}
      10%{bottom: -30px;}
      45%{bottom: -25px;}
      60%{bottom: 0px;}
      100%{bottom: 0px;}
    }
    @-webkit-keyframes dot-middle-top{
      0%{}
      10%{}
      45%{top: 98px;}
      70%{top: -50px;}
      85%{top: 0px;}
      100%{top: 0px;}
    }
    @-webkit-keyframes dot-middle-bottom{
      0%{}
      10%{}
      45%{bottom: 98px;}
      70%{bottom: -50px;}
      85%{bottom: 0px;}

      100%{bottom: 0px;}
    }
    
    @keyframes line{
      0%{height: 4px; top: 0px; left: 0px; transform: rotate(-65deg)}
      10%{height: 220px; top: -110px; left: 15px;}
      45%{height: 200px; top: -100px; left: 25px;}
      70%{height: 8px; top: 0px; left: 25px; transform: rotate(0deg);}
      100%{height: 8px; top: 0px; left: 15px; transform: rotate(0deg);}
    }
    @keyframes dot-top{
      0%{top: -30px}
      10%{top: -30px;}
      45%{top: -25px;}
      60%{top: 0px;}
      100%{top: 0px;}
    }
    @keyframes dot-bottom{
      0%{bottom: -30px}
      10%{bottom: -30px;}
      45%{bottom: -25px;}
      60%{bottom: 0px;}
      100%{bottom: 0px;}
    }
    @keyframes dot-middle-top{
      0%{}
      10%{}
      45%{top: 78px;}
      70%{top: -50px;}
      85%{top: 0px;}
      100%{top: 0px;}
    }
    @keyframes dot-middle-bottom{
      0%{}
      10%{}
      45%{bottom: 78px;}
      70%{bottom: -50px;}
      85%{bottom: 0px;}
      100%{bottom: 0px;}
    }