function CardGamblingBase(){
//prototype counts the number of value d found in the array
  Array.prototype.count = function(d){
    if(d==null)
      return this.length; 
    var a = 0; 
    for(var i =0;i<this.length;i++){
      if(this[i]===d)a++;
    }
    return a;
  };
  Array.prototype.allIndexOf = function(d){
    var r = [];
    for(var i = 0;i<this.length;i++){
      if(this[i]===d)
        r.push(i);
    }
    return r;
  };
  this.funds = 500;  
  this.bet = 0;
  this.win = 0;
  this.maxBet =50;
  this.started = false;
}

CardGamblingBase.prototype = {
    setDecks:function(amt){
      this.deck = new CardDeckClass(amt);
    },
    setCanvas:function($canvas){
      this.canvas = $canvas[0];
      this.parent = $canvas.parent();
      this.canvas.width = this.parent.width();
      this.canvas.height = this.canvas.width/5/.74+10;
      this.cardWidth = this.parent.width()/5;
      this.cardHeight = this.cardWidth/.74;
      this.ctx = this.canvas.getContext("2d");
    },
    trasferFundBet:function(amt){
      this.bet += amt;
      this.funds -= amt;
    },
    placeBet:function(amt,preFunc,callback){
      if(!this.started && (this.bet < this.maxBet || amt < 0)){
        preFunc.call(this);
        this.win = 0;
        if(this.funds >= amt){
          if(this.bet + amt <= this.maxBet){
            this.trasferFundBet(amt);
          }else if(this.bet + amt > this.maxBet){
            var dif = this.maxBet - this.bet;
            if(dif > 0){
              this.trasferFundBet(dif);
            }
          }
        }else if(this.funds > 0){
          this.trasferFundBet(this.funds);
        }
      }
      callback.call(this);
    },
    draw:function(imgX,imgY,x,y){
      this.ctx.drawImage(this.spriteSheet,imgX*this.spriteSheet.spriteWidth+imgX+1,imgY*this.spriteSheet.spriteHeight+imgY+1,
          this.spriteSheet.spriteWidth,this.spriteSheet.spriteHeight,x,y,this.cardWidth,this.cardHeight);
    },
    drawBack:function(x,y){
      this.ctx.drawImage(this.backImg,x,y,this.cardWidth,this.cardHeight);
    },
    loadImages:function(callback){
      var _this = this,backLoaded = false,spriteLoaded = false,finished =false;
      this.backImg = new Image();
      this.backImg.onload = function(){
        backLoaded=true;
        if(spriteLoaded && !finished){
          finished = true;
          callback.call(_this);
        }
      }
      this.backImg.src = "/images/animal-grab-back.jpg";
      this.spriteSheet = new Image();
      this.spriteSheet.onload = function(){
        spriteLoaded=true;
        if(backLoaded && !finished){
          finished = true;
          callback.call(_this);
        }
      }
      this.spriteSheet.spriteHeight = 97;
      this.spriteSheet.spriteWidth = 72;
      this.spriteSheet.src = "/images/windows-playing-cards.png";
    },
};