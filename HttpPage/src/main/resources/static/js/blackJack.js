//function to concatenate the prototype objects
function extend(obj, src) {
  Object.keys(src).forEach(function(key) { obj[key] = src[key]; });
  return obj;
}
//inherit from CardGamblingBase
BlackJack.prototype = new CardGamblingBase();
//reset constructor to this class
BlackJack.prototype.constructor=BlackJack;
function BlackJack($canvas){
  this.setCanvas($canvas);
  this.canvas.height = this.canvas.height*2;
  this.setDecks(1);
  this.loadImages(this.loadGame);
  this.dealerHand = [];
  this.playerHand = [];
}

extend(BlackJack.prototype , {
    loadGame:function(){
      var _this = this;
      this.drawFunds();
      this.buttonEvents();
    },
    buttonEvents:function(){
      var _this = this;
      $('#addBetBtn').on('click',function(evt){
        _this.placeBet(5,function(){},_this.drawFunds);
      })
      $('#clearBetBtn').on('click',function(evt){
        _this.placeBet(-_this.bet,function(){},_this.drawFunds);
      })
      $('#maxBetBtn').on('click',function(evt){
        _this.placeBet(_this.maxBet,function(){},_this.drawFunds);
      })
      $('#dealBtn').on('click',function(evt){
        _this.deal();
      });
      $('#hitBtn').on('click',function(evt){
        _this.hit();
      })
      $('#standBtn').on('click',function(evt){
        
      })
      $('#splitBtn').on('click',function(evt){
        
      })
    },
    deal:function(){
      this.start = true;
      this.dealCards();
    },
    drawCardHandlerPlayer:function(_class){
      var drawPosX = _class.canvas.width/2+this.pos.x*50,
        drawPosY = _class.canvas.height/2-_class.cardHeight/2+this.pos.x*10;
      
      if(this.flip){
        _class.draw(this.card.x,this.card.y,drawPosX,drawPosY);
      } else{
        _class.drawBack(drawPosX,drawPosY);
      }
    },
    drawCardHandlerDealer:function(_class){
      var drawPosX = this.pos.x*50,
        drawPosY = this.pos.x*10;
      
      if(this.flip){
        _class.draw(this.card.x,this.card.y,drawPosX,drawPosY);
      } else{
        _class.drawBack(drawPosX,drawPosY);
      }
    },
    dealCards:function(){
      for(var i = 0;i<2;i++){
        this.playerHand.push(new Card(i,0,this,this.drawCardHandlerPlayer,this.clickCardHandler,this.deck.dealCard()));
        this.dealerHand.push(new Card(i,0,this,this.drawCardHandlerDealer,this.clickCardHandler,this.deck.dealCard()));
      }
      this.flipCards('player');
      this.flipCards('dealer');
    },
    flipCards:function(p){
      var _this = this;
      var a = {
        'player':function(){
          _this.playerHand.forEach(function(d){
            d.flip = true;
            d.draw();
          });
        },
        'dealer':function(){
          _this.dealerHand.forEach(function(d,i){
            if(i ==1)
              d.flip = true;
            d.draw();
          });
        }
      }
      a[p]();
    },
    hit:function(){
      this.playerHand.push(new Card(this.playerHand.length,0,this,this.drawCardHandlerPlayer,this.clickCardHandler,this.deck.dealCard()));
      this.flipCards('player');
      this.checkHand();
    },
    checkHand:function(){
      var count = this.playerHand.reduce(function(a,d){var val = d.card.x+1; if(val > 10)val = 10;return a+val;},0);
      if(count >21)
        console.log('busted');
    },
    drawFunds:function(){
      this.ctx.save();
      this.ctx.translate(this.canvas.width/2,25);
      this.ctx.textAlign ="center";
      this.ctx.font = '25px Arial';
      var textDim = this.ctx.measureText('funds:      ').width;
      this.ctx.clearRect(-textDim/2-7,-25,textDim+15,(25+3)*2);
      this.ctx.fillText('Funds: '+this.funds,0,0);
      this.ctx.fillText('bet: '+this.bet,0,25);
      this.ctx.restore();
    }
})