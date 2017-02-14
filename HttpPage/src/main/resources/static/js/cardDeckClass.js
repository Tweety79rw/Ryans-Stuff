function CardDeckClass()
{
	this.cardDeck = new Array();
	this.currentCard = 0;
	this.buildDeck();
	this.shuffle();
}   
        
CardDeckClass.prototype.buildDeck = function()
{
	var count = 0;
	for(i = 0; i < 4; i++)
	{
		for(j = 0; j < 13; j++)
		{
			var card = {
				number:count++,
				x:j,
				y:i
			};
			this.cardDeck.push(card);
		}
	}
};
CardDeckClass.prototype.shuffle = function()
{
	currentCard = 0;
	for(var i = 0; i < 500; i++)
	{   
		
		var left = [];
		var right = [];
		var split = Math.floor(20 + (Math.random()*10)+1);
		for(j=0; j< split; j++)
		{
			left.push(this.cardDeck[j]);
		}
		for(j= split; j < 52; j++)
		{
			right.push(this.cardDeck[j]);
		}
		this.cardDeck.length = 0;
		while(left.length > 0 && right.length > 0)
		{
			var side = Math.floor((Math.random()*2));
			if (side == 0)
				this.cardDeck.push(left.pop());
			else
				this.cardDeck.push(right.pop());
		}
		while(left.length > 0)
		{
			this.cardDeck.push(left.pop());
		}
		while(right.length > 0)
		{
			this.cardDeck.push(right.pop());
		}
	}
};
CardDeckClass.prototype.dealCard = function(){
	if (currentCard < 52)
		return this.cardDeck[currentCard++];
	return null;
};
CardDeckClass.prototype.size = function() { return cardDeck.length; };
CardDeckClass.prototype.getCardNumber = function(value) { 
	return value.number;
};
CardDeckClass.prototype.getCardCoords = function(value) {
	return [value.x,value.y];
};
    
