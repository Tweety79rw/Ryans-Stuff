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
      $('#doubleBtn').on('click',function(evt){
        _this.double();
      })
      $('#standBtn').on('click',function(evt){
        _this.stand();
      })
      $('#splitBtn').on('click',function(evt){
        console.log('split');
        _this.split();
      })
    },
    deal:function(){
      if(!this.started && this.bet > 0){
        if(this.deck.size().cardsLeft < 15)
          this.deck.shuffle();
        this.clearCardArea();
        this.playerHand = [];
        this.dealerHand = [];
        $('#splitBtn, #doubleBtn').addClass('disabled');
        this.started = true;
        this.dealCards();
      }
    },
    drawCardHandlerPlayer:function(_class){
      var drawPosX = _class.canvas.width/2+this.pos.x%5*50,
        drawPosY = _class.canvas.height/2-_class.cardHeight/2+this.pos.x*10 + Math.floor(this.pos.x/5)*40;
      
      if(this.flip){
        _class.draw(this.card.x,this.card.y,drawPosX,drawPosY);
      } else{
        _class.drawBack(drawPosX,drawPosY);
      }
    },
    drawCardCounts:function(){
      this.ctx.save();
      this.ctx.translate(this.canvas.width - this.canvas.width/4,100);
      this.ctx.textAlign ="center";
      this.ctx.font = '32px Arial';
      var textDim = this.ctx.measureText('  ').width;
      this.ctx.clearRect(-textDim/2-7,-25,textDim+15,(25+3)*2);
      this.ctx.fillText(this.checkHand(JSON.parse(JSON.stringify(this.playerHand))),0,0);
      this.ctx.restore();
    },
    drawDealerCounts:function(){
      this.ctx.save();
      this.ctx.translate(this.canvas.width/4,this.canvas.height/2+100);
      this.ctx.textAlign ="center";
      this.ctx.font = '32px Arial';
      var textDim = this.ctx.measureText('  ').width;
      this.ctx.clearRect(-textDim/2-7,-25,textDim+15,(25+3)*2);
      this.ctx.fillText(this.checkHand(JSON.parse(JSON.stringify(this.dealerHand))),0,0);
      this.ctx.restore();
    },
    drawCardHandlerDealer:function(_class){
      var drawPosX = this.pos.x%5*50,
        drawPosY = this.pos.x*10+ Math.floor(this.pos.x/5)*40;
      
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
      this.flipCards('player')();
      this.flipCards('dealer')();
      this.preHandcheck();
    },
    split:function(){
      
    },
    double:function(){
      this.trasferFundBet(this.bet);
      this.hit();
      this.stand();
    },
    preHandcheck:function(){
      var playerH = this.checkHand(JSON.parse(JSON.stringify(this.playerHand)));
      var dealerH = this.checkHand(JSON.parse(JSON.stringify(this.dealerHand)));
      if(playerH == 21&&dealerH == 21){
        this.payout(1);
        this.flipCards('dealer')(true);
        this.started = false;
      }else if(playerH == 21){
        this.payout(2.5);
        this.flipCards('dealer')(true);
        this.started = false;
      }else if(dealerH == 21){
        this.payout(0);
        this.flipCards('dealer')(true);
        this.started = false;
      }else if(playerH == 11||playerH == 10){
        //double down
        if(this.funds >= this.bet)
          $('#doubleBtn').removeClass('disabled');
        console.log('double down');
      }else if(this.playerHand.map(function(d){return d.card.x;}).map(function(d,i,a){return a.count(d);}).count(2) == 2){
        //split
        console.log('split');
        $('#splitBtn').removeClass('disabled');
      }
        
    },
    flipCards:function(p){
      var _this = this;
      var a = {
        'player':function(){
          _this.playerHand.forEach(function(d){
            d.flip = true;
            d.draw();
          });
          _this.drawCardCounts();
        },
        'dealer':function(reveal){
          reveal = reveal || false;
          _this.dealerHand.forEach(function(d,i){
            if(i ==1||reveal)
              d.flip = true;
            d.draw();
          });
        }
      }
      return a[p];
    },
    hit:function(){
      if(this.started){
        this.playerHand.push(new Card(this.playerHand.length,0,this,this.drawCardHandlerPlayer,this.clickCardHandler,this.deck.dealCard()));
        this.flipCards('player')();
        if(this.checkHand(JSON.parse(JSON.stringify(this.playerHand))) > 21)
          this.busted();
      }
    },
    busted:function(){
      //draw busted on cards and end hand
      this.payout(0);
      this.flipCards('dealer')(true);
      this.started = false;
    },
    checkHands:function(){
      var playerCount = this.checkHand(JSON.parse(JSON.stringify(this.playerHand)));
      var dealerCount = this.checkHand(JSON.parse(JSON.stringify(this.dealerHand)));
      var winTotal = playerCount - dealerCount;
      if(winTotal == 0){
        //tie
        console.log('tie');
        this.payout(1);
      }else if(dealerCount > 21 || winTotal >0){
        //player wins
        console.log('player wins');
        this.payout(2);
      }else{
        //dealer wins
        console.log('dealer wins');
        this.payout(0);
      }
      this.started = false;
    },
    playerBlackJack:function(){
      this.payout(2.5);
    },
    payout:function(mult){
      this.win =this.bet*mult;
      this.funds += this.win;
      this.bet = 0;
      this.drawFunds();
     
//      if(this.funds==0)
//        $('#endModal').modal('show');
    },
    clearCardArea:function(){
      this.ctx.clearRect(0,0,this.cardWidth*2,this.cardHeight*1.5);
      this.ctx.clearRect(this.canvas.width/2,this.canvas.height/2-this.cardHeight/2,this.cardWidth*2,this.cardHeight*1.5);
    },
    stand:function(){
      if(this.started){
        this.flipCards('dealer')(true);
        var handCount;
        while((handCount =this.checkHand(JSON.parse(JSON.stringify(this.dealerHand)))) <17){
          this.dealerHand.push(new Card(this.dealerHand.length,0,this,this.drawCardHandlerDealer,this.clickCardHandler,this.deck.dealCard()));
          this.flipCards('dealer')(true);
          this.drawDealerCounts();
        }
        this.checkHands();
      }
    },
    checkHand:function(hand){
      hand.sort(function(a,b){return b.card.x-a.card.x;});
      var count = hand.reduce(function(a,d){
        var val = d.card.x+1;
        if(val > 10)
          val = 10;
        if(val==1&&a+11 <= 21)
          val=11;
        
        return a+val;
        },0);
      if(count >21)
        console.log('busted');
      return count;
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