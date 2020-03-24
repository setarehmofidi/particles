let snow;
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
function preload(){//preloading makes sures the files are ready to go before the sketch starts!
    song = loadSound('assets/sometimes.mp3');
    for(let i=0;i<3;i++){//loadinf diferent pictures to an array
    spiralPic[i]=loadImage('assets/spiral'+i+'.png');
  }
}
function setup(){
 createCanvas(windowWidth,windowHeight); 
 //createCanvas(500,380)
 capture = createCapture(VIDEO);//starting the webcam
 capture.hide()
 song.addCue(5, changeBackground());//with addCue you can give it 2 arguments: time and a function
  angleMode(DEGREES);
  frameRate(15);
  slider = createSlider(1, 360, 1, 1);
  slider.position(width, height);
  button = createButton("play");
  jump = createButton("jump");
  jump.mousePressed(letsJump);
  button.mousePressed(togglePlaying);
  song.addCue(2, changeBackground());
  amp= new p5.Amplitude();//craetinf an amplitude object
  //smoothing value and number of bins
  fft = new p5.FFT(0.9, 256);

  for (let i=0; i<number; i++){//creating instances of the class Snow
    flakes[i] = new Snow();
  }
  for (let i=0; i<starNum; i++){//creating instances of the class Star
    stars[i] = new Star();
  }
}

function changeBackground(){
    background(255,0,0);
}

 
function togglePlaying(){ //creatinf the pause and play button
    if(!song.isPlaying() ){
        song.play();
        button.html("pause");
    }else{
        song.pause();
        button.html("play");
    }
}

function letsJump(){ // creating a not so great scrub slider
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
 background(0,30);//creating a blur

fftOperations();

volCircle();

  //color capturing
capture.loadPixels();  
 
volGraph();

  frames+=10;


for (let i = 0; i < number; i++) {
  flakes[i].display();
  flakes[i].move();
  flakes[i].bounce();
  flakes[i].color();
  }

 
 if (keyIsPressed === true){// if a key is pressed, the spirals start falling down

  for (let i = 0; i < starNum; i++) {
  
  stars[i].display();
  stars[i].move();
  stars[i].addStar();
    
  }

  }
  
}

function volGraph(){ //creating an amplitude graph
  let vol = amp.getLevel(); //storing the value of amplitude
  //color capturing a single pixel
  let c = capture.get(150, 90);
volhistory.push(vol); //adding new elements to the array
 push();
 scale(4); //scaling up (enlarging)
  let currentY = map(vol, 0, 1, height, 0);
  translate(0, mouseY  - currentY); //now volume graph moves with the mouseY
  noFill();
  stroke(c);
  // let r = 255 * noise(t+10);
  // let g = 255 * noise(t+15);
  // let b = 255 * noise(t+20);
  // stroke(i,255,255);
  strokeCap(SQUARE);
  //strokeCap(ROUND);
  t = t + 0.01;
  strokeWeight(1);
  beginShape(); //creating the graph using vertex
  for (var i = 0; i < volhistory.length; i++) {
    var y = map(volhistory[i], 0, 1, height, 0);
    vertex(i, y);
  }
  endShape();
  pop();
  if (volhistory.length > 360 ) { //360 is for the radial graph so it gives the illusion of rotation
    volhistory.splice(0, 1);
  }

}

function fftOperations(){ // things you need to analyze the volume of different frequency bands, right now is the colorful lines in background
  let spectrum = fft.analyze(); //starting the analyzation process 
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
}

function volCircle(){ //radial graph in the center
  push();

 translate(width/2,height/2);
  noFill();
  scale(4);
  beginShape();
  for(let m=0; m<360; m++){ //a formula for grawing a circle instead of using the ellipse function
    let rr= map(volhistory[m], 0, 1, 50, 300);
    let xx= rr*cos(m);
    let yy= rr*sin(m);
    vertex(xx,yy);
  }

  endShape();
pop();
}
function mousePressed(){ //creating new 'flakes' wherever the mouse is clicked
  flakes[whichflake].teleportFlake(mouseX,mouseY);
  flakes[whichflake].makeFlakeVisible();
  whichflake++;
  whichflake= whichflake%number;
}

class Snow{ //constructing the costume class 'snow' which here refers to the colorful flakes
  constructor(){
    this.x=random(width);
    this.y=0
    this.xspeed=random(-0.5,0.5);
    this.yspeed=random(0.1,4);
    this.radius=diam
    this.visible=false;
    
  }
  display(){
  let vol = amp.getLevel();  
  diam = map(vol,0.009,0.1,0.05,100); //getlevel gives us values between 0 and 1 and we need other numbers

if(this.visible){ //changing color of the flakes over time
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
    for(var i = 0; i < 100; i++) { //formula for creating imperfect cricles(the flakes) meaning their radius fluctuates between a range
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
  bounce(){ // function so they bounce off the edge s of the screen
    if(this.x<20|| this.x>width-20){
      this.xspeed= -this.xspeed
          }
    if(this.y>height-20 || this.y<20){
      this.yspeed= -this.yspeed
     newcolor=!newcolor; // if they hit the edges, they change color


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






class Star{ // the class for Spirals in this sketch
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
  rotate(radians(frames%360)) // makes the spirals spin
  imageMode(CENTER);

  image(spiralPic[floor(random(0,3))],0,0,20,20) //chosing a random numbered picture of a piral, floor only gives u integers
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

 addStar(){ // adds more instances as they become invisible to us, so it always looks like they are falling down
    
    for (let i = 0; i < starNum; i++) {
      if(stars[i].isDead()){
       
        stars[i]= new Star();
         
      }
    }

  }

 }
