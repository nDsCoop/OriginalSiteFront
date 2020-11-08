import React, { Component } from 'react';
import './Animation.css'
class Snow extends Component {
  constructor(props) {
    super(props);
    this.canvas = React.createRef();
    
  }
  componentDidUpdate() {
    this.snow();
  }


  snow(){
    // const canvas = this.canvas.current;
  
    // const height = canvas.height;
    // const width = canvas.width;
    
    const snowfalldiv = document.getElementById('snowfall');
    const canvas = document.createElement('canvas');
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    
    window.addEventListener("resize",function(){
        canvas.height = window.innerHeight;
        canvas.width = window.innerWidth;
    });
    snowfalldiv.appendChild(canvas);
    
    const w = canvas.width;
    const h = canvas.height;
    const ctx = canvas.getContext('2d');
    
    
    const flakes = [];
    class snowfall{
    
        static snowFall(){
            ctx.clearRect(0, 0, w, h);
            snowfall.addFlakes();
            snowfall.addSnow();
        };
    
        static addFlakes(){
            const x = Math.ceil(Math.random()* w);
            const speed = Math.ceil(Math.random()* 5);
            const radius = 10* Math.PI;
    
            flakes.push({
                x:x,
                y:0,
                speed:speed,
                radius:radius
            });
        };
    
        static addSnow(){
            for(let i=0; i<flakes.length; i++){
                let oneFlake = flakes[i];
    
                // creating circles
                ctx.beginPath();
                // color the circles
                ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
                // drawing circle
                ctx.arc(oneFlake.x, oneFlake.y += oneFlake.speed/2, oneFlake.speed * 0.6, 0, oneFlake.radius);
                ctx.fill();
            }
        };
    }
    
    setInterval(()=> snowfall.snowFall(),20);
  }

  
 
  render() {

    return <div class="snowfall" id="snowfall"></div>
    
    // return <canvas width="1250px" height="800px" ref={this.canvas}>
    // </canvas>;

  }
}

export default Snow;