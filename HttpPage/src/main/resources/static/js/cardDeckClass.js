function CardDeckClass(decks)
{
  //array prototype cuts the card deck into 2 at index w and rejoins in reverse
  Array.prototype.cut = function(w){
    return this.slice(w).concat(this.slice(0,w)); 
  };
  
  Array.prototype.swap = function(a,b){
    if(Math.max(a,b)>=this.length||Math.min(a,b)<0)return;
    var tmp = this[a];
    this[a] = this[b];
    this[b]=tmp;
  }
  Array.prototype.shuffle = function(){
    for(var i = this.length-1;i>=0;i--){
      var rand = Math.floor(Math.random()*i);
      this.swap(rand,i);
    }
    return this;
  };
  //number of decks default is 1
  this.numDecks = decks || 1;
  this.numCardsInADeck = 52;
  this.totalCards = this.numDecks*this.numCardsInADeck;
	this.cardDeck = [];
	this.currentCard = 0;
	this.buildDeck();
	this.shuffle();
}   
        
CardDeckClass.prototype ={
  cardSuit:['Club','Heart','Spade','Diamond'], 
  cardFace:['Ace',2,3,4,5,6,7,8,9,10,'Jack','Queen','King'],
  buildDeck:function(){
  	var count = 0;
  	for(var i = 0;i<this.numDecks;i++){
    	for(var j = 0; j < 4; j++)
    	{
    		for(var k = 0; k < 13; k++)
    		{
    			var card = {
    				number:count++,
    				//x and y are related to the sprite sheet of cards
    				x:k,
    				y:j,
    				face:this.cardFace[k],
    				suit:this.cardSuit[j]
    			};
    			this.cardDeck.push(card);
    		}
    	}
  	}
  },
  shuffle : function(){
    this.currentCard = 0;
	  this.cardDeck = this.cardDeck.shuffle().cut(Math.floor(Math.random()*this.totalCards));	  
  },
  dealCard : function(burn){
  	//pulls one card off the top of the deck returns null if out of cards
    this.currentCard += burn || 0;
    if (this.currentCard < this.totalCards)
  		return this.cardDeck[this.currentCard++];
  	return null;
  },
  size : function(){
    return {
      numDecks:this.numDecks,
      totalCards:this.totalCards,
      cardsWasted:this.currentCard,
      cardsLeft:this.totalCards - this.currentCard
    };
  }
}
    
