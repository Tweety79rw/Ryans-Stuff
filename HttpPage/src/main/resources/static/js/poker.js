//inherit from CardGamblingBase
Poker.prototype = new CardGamblingBase();
//reset constructor to this class
Poker.prototype.constructor=Poker;
function Poker($canvas){
  this.setCanvas($canvas);
  this.setDecks(1);
  this.hand = [];
  this.initPlayCards();
  this.maxBet = 50;
  this.winMultiplier = 0;
  this.loadImages(this.loadGame);
}
function extend(obj, src) {
  Object.keys(src).forEach(function(key) { obj[key] = src[key]; });
  return obj;
}
extend(Poker.prototype,  {
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
        _this.placeBet(5,_this.clearCards,_this.updateTextDisplays);
      });
      $('#maxBetBtn').on('click',function(){
        _this.placeBet(_this.maxBet,_this.clearCards,_this.updateTextDisplays);
      });
      $('#clearBetBtn').on('click',function(){
        _this.placeBet(-_this.bet,_this.clearCards,_this.updateTextDisplays);
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
      this.hand.forEach(function(h){
        h.flip = false;
        h.draw();
      });
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
      var _this = this;    
      if(this.bet > 0){
        this.hand.forEach(function(d){
          if(!d.hold){
            d.card = _this.deck.dealCard(1) || _this.hand[i].card;
            d.flip = true;
            d.draw();
          }
        });
        if(!this.started){
          this.started = true;
        }else{
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
      this.hand.forEach(function(d){
        d.hold = false;
        d.draw();
      });
    },
    drawCardHandler:function(_class){
      if(this.flip){
        _class.draw(this.card.x,this.card.y,this.pos.x*_class.cardWidth,0);
        if(this.hold){
          _class.drawHold(this.pos.x);
        }
      } else{
        _class.drawBack(this.pos.x*_class.cardWidth,0);
      }
    },
    clickCardHandler:function(){
      if(this.flip){
        this.hold = !this.hold;
      }
      this.draw();
    },
    initPlayCards:function(){
      var _this = this;
      for(var i = 0;i<5;i++){
        this.hand.push(new Card(i,0,this,this.drawCardHandler,this.clickCardHandler));
      }
    },
    displayCards:function(){
      this.hand.forEach(function(d){
        d.draw();
      });
    },
    flipCards:function(){
      this.hand.forEach(function(d){
        d.flip = true;
        d.draw();
      });
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
    checkHand : function(){
      this.cardNumbers = this.hand.map(function(d){return d.card.x;});
      this.cardSuits = this.hand.map(function(d){return d.card.y;});
      var matches = this.cardNumbers.map(function(d,i,a){return a.count(d);});
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
      //pair
      wins.push(pair?{result:13,arr:matches.allIndexOf(2)}:{result:0,arr:[]});
      var aceHigh = false;
      function consecutiveCards(arr){
        arr.sort(function(a,b) {
          return a - b;
        });
        aceHigh = (arr[4] == 12 && arr[3] == 11 && arr[2] == 10 && arr[1] == 9 && arr[0] == 0);
        var result = true;
        var lowest = arr[0];
        for(var i =0;i<arr.length;i++){
          if(arr[i] != lowest++){
             result = false || aceHigh;
             break;
          }
        }
        if(result)
          wins.push({result:18,arr:[0,1,2,3,4]});
        else
          wins.push({result:0,arr:[]});
      }
      //uses JSON to deep copy the array so the original array wont be sorted
      consecutiveCards(JSON.parse(JSON.stringify(this.cardNumbers)));
      
      if(wins.reduce(function(a,d){return a+d.result;},0)==35){
        if(aceHigh){
          wins.push({result:1,arr:[]});
        }
      }

      var results = Object.keys(wins).reduce(function(a,d){return a+wins[d].result;},0);
      if(results == 0)
        results = this.GetHighCard(JSON.parse(JSON.stringify(this.cardNumbers)));
      
      var resultIndexs = Object.keys(wins).reduce(function(a,d){return a.concat(wins[d].arr);},[])
      if(results == 13 &&
          !(this.cardNumbers[matches.indexOf(2)] > 9 || this.cardNumbers[matches.indexOf(2)] == 0)){
        results = this.GetHighCard(JSON.parse(JSON.stringify(this.cardNumbers)));
        resultIndexs = [];
      }
      return {result:results,indexArr:resultIndexs};
    },
    GetHighCard : function(arr)
    {
      var resultsHighCard;
      arr.sort(function(a,b) {
        return a - b;
      });
      if (arr[0] == 0)
          resultsHighCard = 0;
        else
          resultsHighCard = arr[4];
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
})