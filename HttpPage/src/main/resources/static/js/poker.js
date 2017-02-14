function Poker($canvas){
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
  this.canvas = $canvas[0];
  var parent = $canvas.parent();
  this.canvas.width = parent.width();
  this.canvas.height = this.canvas.width/5/.74+10;
  this.cardWidth = parent.width()/5;
  this.cardHeight = this.cardWidth/.74;
  this.ctx = this.canvas.getContext("2d");
  this.deck = new CardDeckClass();
  this.hand = {};
  this.initPlayCards();
  this.funds = 500;  
  this.bet = 0;
  this.win = 0;
  this.maxBet = 50;
  this.winMultiplier = 0;
  this.started = false;
  this.loadImages(this.loadGame);
}

Poker.prototype = {
    loadGame:function(){
      var _this = this;
      this.updateTextDisplays();
      this.displayCards();
      this.loadEvents();
    },
    loadEvents:function(){
      var _this = this;
      $(this.canvas).on('click',function(evt){
        _this.clicked(evt);
      });
      $('#drawBtn').on('click',function(){
        _this.deal();
      });
      $('#betBtn').on('click',function(){
        _this.placeBet(5);
      });
      $('#maxBetBtn').on('click',function(){
        _this.placeBet(_this.maxBet);
      });
      $('#clearBetBtn').on('click',function(){
        _this.placeBet(-_this.bet);
      });
      $('#help').on('click',function(){
        $('#helpModal').modal('show');
      });
      $('#newGame').on('click',function(){
        _this.funds = 500;
        _this.updateFundsDisplay();
        _this.clearCards();
        $('#endModal').modal('hide');
      });
    },
    clearCards:function(){
      for(var h in this.hand){
        this.hand[h].flip = false;
        this.hand[h].draw();
      }
    },
    updateFundsDisplay:function(){
      $('#funds').text(this.funds);
    },
    updateBetDisplay:function(){
      $('#betAmount').text(this.bet);
    },
    updateWinDisplay:function(){
      $('#winAmount').text(this.win);
    },
    updateTextDisplays:function(){
      this.updateFundsDisplay();
      this.updateBetDisplay();
      this.updateWinDisplay();
    },
    trasferFundBet:function(amt){
      this.bet += amt;
      this.funds -= amt;
    },
    placeBet:function(amt){
      if(!this.started && (this.bet < this.maxBet || amt < 0)){
        this.clearCards();
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
      this.updateTextDisplays();
    },
    payouts:function(){
      this.win =this.bet*this.winMultiplier;
      this.funds += this.win;
      this.bet = 0;
      this.winMultiplier = 0;
      this.updateTextDisplays();
      if(this.funds==0)
        $('#endModal').modal('show');
    },
    deal:function(){
      if(this.bet > 0){
        if(!this.started){
          this.started = true;
          for(var i in this.hand){
            if(!this.hand[i].hold){
              var card = this.deck.dealCard();
              this.hand[i].card = card || this.hand[i].card;
              this.hand[i].flip = true;
              this.hand[i].draw();
            }
          }
        }else{
          for(var i in this.hand){
            if(!this.hand[i].hold){
              var card = this.deck.dealCard();
              this.hand[i].card = card || this.hand[i].card;
              this.hand[i].flip = true;
              this.hand[i].draw();
            }
          }
          var result = this.checkHand();
          this.resetHand();
          this.drawStatus(this.isWinner(result.result));
          this.highlightCards(result.indexArr);
          this.payouts();
          this.started = false;
          this.deck.shuffle();
        }
      }
    },
    highlightCards:function(indexs){
      var _this = this;
      var diff = [0,1,2,3,4].filter(function(d){return indexs.indexOf(d)<0;});
      this.ctx.fillStyle = 'rgba(225,225,225,0.5)';
      diff.forEach(function(d){
        _this.ctx.fillRect(d*_this.cardWidth,0,_this.cardWidth,_this.cardHeight);
      });
    },
    resetHand:function(){
      for(var a in this.hand){
        this.hand[a].hold = false;
        this.hand[a].draw();
      }
    },
    initPlayCards:function(){
      var _this = this;
      for(var i = 0;i<5;i++){
        this.hand[i] = {
            hold:false,
            flip:false,
            card:{},
            pos:i,
            draw:function(){
              if(this.flip){
                _this.draw(this.card.x,this.card.y,this.pos);
                if(this.hold){
                  _this.drawHold(this.pos);
                }
              } else{
                _this.drawBack(this.pos);
              }
            },
            click:function(){
              if(this.flip){
                this.hold = !this.hold;
              }
              this.draw();
            }
        }
      }
    },
    displayCards:function(){
      for(var i in this.hand){
        this.hand[i].draw();
      }
    },
    flipCards:function(){
      for(var i in this.hand){
        this.hand[i].flip = true;
        this.hand[i].draw();
      }
    },
    drawStatus:function(msg){
      $('#status').text(msg);
    },
    clicked:function(evt){
      if(this.started){
        var x = Math.floor(evt.offsetX/this.cardWidth);
        this.hand[x].click();
      }
    },
    draw:function(imgX,imgY,x){
      this.ctx.drawImage(this.spriteSheet,imgX*this.spriteSheet.spriteWidth+imgX+1,imgY*this.spriteSheet.spriteHeight+imgY+1,
          this.spriteSheet.spriteWidth,this.spriteSheet.spriteHeight,x*this.cardWidth,0,this.cardWidth,this.cardHeight);
    },
    drawBack:function(x){
      this.ctx.drawImage(this.backImg,x*this.cardWidth,0,this.cardWidth,this.cardHeight);
    },
    drawHold:function(x){
      this.ctx.beginPath();
      this.ctx.fillStyle = "red";
      this.ctx.lineJoin = "round";
      this.ctx.moveTo(x*this.cardWidth+this.cardWidth-54, 7);
      this.ctx.lineTo(x*this.cardWidth+this.cardWidth-4, 7);
      this.ctx.lineTo(x*this.cardWidth+this.cardWidth-4, 57);
      this.ctx.fill();
      this.ctx.save();
      this.ctx.translate(x*this.cardWidth+this.cardWidth-25,25)
      this.ctx.rotate(Math.PI/4);
      this.ctx.strokeStyle = "white";
      this.ctx.textAlign ="center";
      this.ctx.strokeText('HOLD',0,0);
      this.ctx.restore();
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
    checkHand : function(){
      var exitInner = false;
      var streight = 0;
      var royalFlush = 0;
      this.cardNumbers = [];
      this.cardSuits = [];
      for(var a in this.hand){
        this.cardNumbers.push(this.hand[a].card.number % 13);
        this.cardSuits.push(Math.floor(this.hand[a].card.number / 13));
      }
      var matches = this.cardNumbers.map(function(d,i,a){return a.count(d);});
      //pair
      var pair = matches.count(2) == 2;
      var wins = [];
      //two pair
      wins.push(matches.count(2) == 4?{result:14,arr:matches.allIndexOf(2)}:{result:0,arr:[]});
      //three of a kind
      wins.push(matches.count(3) == 3?{result:15,arr:matches.allIndexOf(3)}:{result:0,arr:[]});
      //four of a kind
      wins.push(matches.count(4) == 4?{result:16,arr:matches.allIndexOf(4)}:{result:0,arr:[]});
      //flush
      wins.push(this.cardSuits.map(function(d,i,a){return a.count(d);}).count(5) == 5?{result:17,arr:[0,1,2,3,4]}:{result:0,arr:[]});
      //pair is jacks or better
      wins.push(pair?{result:13,arr:matches.allIndexOf(2)}:{result:0,arr:[]});
      
      function consecutiveCards(arr){
        arr.sort(function(a,b) {
          return a - b;
        });
        
        var lowest = arr[0];
        for(var i =0;i<arr.length;i++){
          if(arr[i] != lowest++)
            return false||(arr[4] == 12 && arr[3] == 11 && arr[2] == 10 && arr[1] == 9 && arr[0] == 0);
        }
        return true;
      }
      //uses JSON to deep copy the array so the original array wont be sorted
      if(consecutiveCards(JSON.parse(JSON.stringify(this.cardNumbers))))
        wins.push({result:18,arr:[0,1,2,3,4]});
      else
        wins.push({result:0,arr:[]});
      
      if(wins.reduce(function(a,d){return a+d.result;})==35)
      {
        if(this.cardNumbers[4] == 12 && this.cardNumbers[0] == 0)
        {
          wins.push({result:1,arr:[]});
        }
      }

      var results = Object.keys(wins).reduce(function(a,d){return a+wins[d].result;},0);
      if(results == 0)
        results = this.GetHighCard();
      
      var resultIndexs = Object.keys(wins).reduce(function(a,d){return a.concat(wins[d].arr);},[])
      if(results == 13 &&
          !(this.cardNumbers[matches.indexOf(2)] > 9 || this.cardNumbers[matches.indexOf(2)] == 0)){
        results = this.GetHighCard();
        resultIndexs = [];
      }
      return {result:results,indexArr:resultIndexs};
    },
    GetHighCard : function()
    {
      var resultsHighCard;
      this.cardNumbers.sort(function(a,b) {
        return a - b;
      });
      if (this.cardNumbers[0] == 0)
          resultsHighCard = 0;
        else
          resultsHighCard = this.cardNumbers[4];
      return resultsHighCard;
    },
    isWinner:function(result){
      var cardVal = {
        0:'Ace',
        12:'King',
        11:'Queen',
        10:'Jack'
      };
      var winners = {
          13:'One Pair',
          14:'Tow Pair',
          15:'Three of a Kind',
          28:'Full House',
          16:'Four of a Kind',
          17:'Flush',
          18:'Straight',
          35:'Straight Flush',
          36:'Royal Flush, good job'
      };
      var payOutMult ={13:1,14:2,15:3,28:9,16:25,17:6,18:4,35:50,36:250};
      
      var StringResults = "";
      if (result >= 0 && result <= 12){
        this.winMultiplier = 0;
        StringResults = "Jacks or Better to Win, High card is ";
        if(cardVal.hasOwnProperty(result)){
          StringResults += cardVal[result];
        }else{
          var temp = result + 1;
          StringResults += temp.toString();
        }
          
      }else{
        if(result-13>=0){
          StringResults ='Winner '+winners[result];
          this.winMultiplier = payOutMult[result];
        }else{
          StringResults = "Error processing winnings";
          this.winMultiplier = 1;
        }
        
      }
      return StringResults;
    }
}