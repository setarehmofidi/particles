let snow;
//let star;
let stars = [];
let starNum= 100;
let spiralPic=[];
let flakes =[];
let number = 20;
let frames = 0;
let whichflake = 0;
let newcolor=false
let song;
let button;
let jump;
let slider;
let amp;
let diam;
let volhistory=[]
let capture;
let t=0;
let fft;
function preload(){
    song = loadSound('assets/sometimes.mp3');
    for(let i=0;i<3;i++){
    spiralPic[i]=loadImage('assets/spiral'+i+'.png');
  }
}
function setup(){
 createCanvas(windowWidth,windowHeight); 
 //createCanvas(500,380)
 capture = createCapture(VIDEO);
 capture.hide()
 song.addCue(5, changeBackground());
  //song = new p5.AudioIn();
 //noCursor();
  angleMode(DEGREES);
  frameRate(15);
  slider = createSlider(1, 360, 1, 1);
  slider.position(width, height);
  button = createButton("play");
  jump = createButton("jump");
  jump.mousePressed(letsJump);
  button.mousePressed(togglePlaying);
  song.addCue(2, changeBackground());
  amp= new p5.Amplitude();
  //smmothing value and number of bins
  fft = new p5.FFT(0.9, 256);
  //snow = new Snow();
  for (let i=0; i<number; i++){
    flakes[i] = new Snow();
  }
  for (let i=0; i<starNum; i++){
    stars[i] = new Star();
  }
}

function changeBackground(){
    background(255,0,0);
}

 
function togglePlaying(){
    if(!song.isPlaying() ){
        song.play();
        button.html("pause");
    }else{
        song.pause();
        button.html("play");
    }
}

function letsJump(){
   // song.jump(60);
   if(!song.isPlaying() ){
    let len= slider.value();
    song.jump(len);
    jump.html("pause");
    }else{
        song.stop();
        jump.html("jump");
    }

    
}
function draw(){
 background(0,30);

let spectrum = fft.analyze();
for(let i=0; i<spectrum.length; i+=5){
 let freqamp= spectrum[i];
 let y= map(freqamp,0,255,0,width);
 //line(i,height,i,y);
 push();
 colorMode(HSB);
 beginShape();
noFill();
strokeWeight(0.05)
 stroke(i,255,255);
 vertex(0,y);
 vertex(i+random(0,width),y);
 vertex(i,y+random(0,height))
 vertex(width, random(height))
 endShape();
 pop()
}

  //color capturing
capture.loadPixels();  
 let c = capture.get(150, 90);


let vol = amp.getLevel();
volhistory.push(vol);
 push();
 scale(4);
  let currentY = map(vol, 0, 1, height, 0);
  translate(0, mouseY  - currentY);
  noFill();
  //stroke(c);
  let r = 255 * noise(t+10);
  let g = 255 * noise(t+15);
  let b = 255 * noise(t+20);
  stroke(i,255,255);
  strokeCap(SQUARE);
  //strokeCap(ROUND);
  t = t + 0.01;
  strokeWeight(1);
  beginShape();
  for (var i = 0; i < volhistory.length; i++) {
    var y = map(volhistory[i], 0, 1, height, 0);
    vertex(i, y);
  }
  endShape();
  pop();
  if (volhistory.length > width ) {
    volhistory.splice(0, 1);
  }




  frames+=10;


for (let i = 0; i < number; i++) {
  flakes[i].display();
  flakes[i].move();
  flakes[i].bounce();
  flakes[i].color();
  //flakes[i].addSnow();
  }
// if(song.currentTime()>5){
 
 if (keyIsPressed === true){

  for (let i = 0; i < starNum; i++) {
  
  stars[i].display();
  stars[i].move();
  stars[i].addStar();
    
  }
//  }
  }
  
}

function volCircle(){
  push();
 translate(width/2,height/2);
  noFill();
  beginShape();
  for(let m=0; m<360; m++){
    let rr= map(volhistory[m], 0, 1, 50, 300);
    let xx= rr*cos(m);
    let yy= rr*sin(m);
    vertex(xx,yy);
  }

  endShape();
pop();
}
function mousePressed(){
  flakes[whichflake].teleportFlake(mouseX,mouseY);
  flakes[whichflake].makeFlakeVisible();
  whichflake++;
  whichflake= whichflake%number;
}

class Snow{
  constructor(){
    this.x=random(width);
    this.y=0
    this.xspeed=random(-0.5,0.5);
    this.yspeed=random(0.1,4);
    this.radius=diam//amp.getLevel()*100;
    this.visible=false;
    
  }
  display(){
  let vol = amp.getLevel();  
  diam = map(vol,0.009,0.1,0.05,100);    

if(this.visible){
    let r = 255 * noise(t+100);
    let g = 255 * noise(t+5);
    let b = 255 * noise(t+150);
  ///changing the color over time
    if(newcolor==false){
      stroke(song.currentTime()%255,0,255);
    }else{
      stroke(r,g,b)
    }
    
   // stroke(r,g,b);
    noFill();
    push();
    translate(this.x,this.y);
    //scale(0.5);
    beginShape();
    for(var i = 0; i < 100; i++) {
     var radius = diam+ random(10,25);
     this.newx = cos(i * 3.6) * radius;
     this.newy = sin(i * 3.6) * radius;
      vertex(this.newx, this.newy);
    }
    endShape();
    pop();
    }
  }
  move(){
    this.x=this.x+this.xspeed;
    this.y=this.y+this.yspeed;
  }
  bounce(){
    if(this.x<20|| this.x>width-20){
      this.xspeed= -this.xspeed
          }
    if(this.y>height-20 || this.y<20){
      this.yspeed= -this.yspeed
     newcolor=!newcolor;


    }
  }

  color(){
 
  }

  isDead(){
    if(this.y>height){
      return true;
      }else{
        return false;
      }

    
  }
  addSnow(){
    
    for (let i = 0; i < number; i++) {
      if(flakes[i].isDead()){
       
        flakes[i]= new Snow(10);
         
      }
    }

  } 
  teleportFlake(xloc,yloc){
    this.x=xloc;
    this.y=yloc;
  }
  makeFlakeVisible(){
    this.visible=true;
  }
  
}






class Star{
  constructor(){
    this.x=random(width);
    this.y=0
    this.xspeed=random(-0.5,0.5);
    this.yspeed=random(1,4);
  
  }
display(){
    fill(255);
push()
  translate(this.x,this.y)
  rotate(radians(frames%360))
  imageMode(CENTER);

  image(spiralPic[floor(random(0,3))],0,0,20,20)
pop()
    
}


move(){
    this.x=this.x+this.xspeed;
    this.y=this.y+this.yspeed;
  }

isDead(){
    if(this.y>height){
      return true;
      }else{
        return false;
      }
   }

 addStar(){
    
    for (let i = 0; i < starNum; i++) {
      if(stars[i].isDead()){
       
        stars[i]= new Star();
         
      }
    }

  }

 }
