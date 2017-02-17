function Card(x,y,_class,draw,click,card){
    this.hold=false;
    this.flip=false;
    this.card=card||{};
    this.pos={x:x,y:y};
    this.draw=function(){draw.call(this,_class);};
    this.click=click
}