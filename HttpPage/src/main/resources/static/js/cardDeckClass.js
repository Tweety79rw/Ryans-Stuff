function CardDeckClass()
{
	//this.cardBack = new WriteableBitmap(new BitmapImage(new Uri("pack://application:,,,/images/animal-grab-back.jpg")));
	this.cardDeck = new Array();
	this.currentCard = 0;
	this.buildDeck();
	//this.reverseCardImage = cardImage.ToDictionary(x => x.Value, x => x.Key);
	this.shuffle();
}
		
		/*class CardDeckClass
    {
        Dictionary<int,CroppedBitmap> cardImage = new Dictionary<int, CroppedBitmap>();
        Dictionary<CroppedBitmap, int> reverseCardImage = new Dictionary<CroppedBitmap, int>();
        var _image = new SpriteSheet(new BitmapImage(new Uri("pack://application:,,,/images/windows-playing-cards.png")));
        var cardBack;
        var image;
        private List<int> cardDeck = new List<int>();
        MathRandom random = new Math.random();
        var currentCard;*/
        
        
CardDeckClass.prototype.buildDeck = function()
{
	//image = new CroppedBitmap(cardBack, new System.Windows.Int32Rect(0, 0, cardBack.PixelWidth, cardBack.PixelHeight));
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
			//this.cardDeck.Add(count);
			//cardImage.Add(count++, _image.GetBitmap(j * (_image.imageWidth() / 13), i * (_image.imageHeight() / 4), (_image.imageWidth() / 13), (_image.imageHeight() / 4)));

		}
	}
	//cardImage.Add(count++, image);
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
/*CardDeckClass.prototype.getCardImage = function(value)
{
	return cardImage[value];
};
CardDeckClass.prototype.getImageNumber = function(value)
{
	return reverseCardImage[value];
};*/
    