let star;
let stars[];
let starNum=100;
let spiralPic;

function setup() {
  

   for (let i=0; i<starNum; i++){
    stars[i] = new Star();
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

  image(spiralPic,0,0,20,20)
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