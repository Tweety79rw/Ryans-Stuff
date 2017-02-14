function CardDeckClass()
{
  Array.prototype.cut = function(w){
    return [this.slice(0,w),this.slice(w)];
  };
  Array.prototype.joinShuffle = function(){
    var arr = [];
    while(this[0].length > 0 && this[1].length > 0)
    {
      arr.push(this[Math.floor((Math.random()*2))].pop());
    }
    while(this[0].length > 0)
    {
      arr.push(this[0].pop());
    }
    while(this[1].length > 0)
    {
      arr.push(this[1].pop());
    }
    return arr;
  }
	this.cardDeck = new Array();
	this.currentCard = 0;
	this.buildDeck();
	this.shuffle();
}   
        
CardDeckClass.prototype ={
  cardSuit:['Club','Heart','Spade','Diamond'], 
  cardFace:['Ace',2,3,4,5,6,7,8,9,10,'Jack','Queen','King'],
  buildDeck:function(){
  	var count = 0;
  	for(i = 0; i < 4; i++)
  	{
  		for(j = 0; j < 13; j++)
  		{
  			var card = {
  				number:count++,
  				x:j,
  				y:i,
  				face:this.cardFace[j],
  				suit:this.cardSuit[i]
  			};
  			this.cardDeck.push(card);
  		}
  	}
  },
  shuffle : function(){
  	currentCard = 0;
  	for(var i = 0; i < 500; i++)
  	{   
  		this.cardDeck = this.cardDeck.cut(Math.floor(20 + (Math.random()*10)+1)).joinShuffle();
  	}
  },
  dealCard : function(){
  	if (currentCard < 52)
  		return this.cardDeck[currentCard++];
  	return null;
  },
  size : function(){
    return cardDeck.length; 
  },
  getCardNumber : function(value){ 
  	return value.number;
  },
  getCardCoords : function(value){
  	return [value.x,value.y];
  }
}
    
