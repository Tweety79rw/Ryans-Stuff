function Nav_Header(){
	
}

Nav_Header.prototype.header = function(){
	var nav = $("<nav>").appendTo('body')
		.attr('class','navbar navbar-default navbar-fixed-top');
	var fluid = $('<div>').attr('class','container-fluid').appendTo(nav);
	var head = $("<div>").attr('class','navbar-header')
		.appendTo(fluid);
	$("<a>").attr('class','navbar-brand').html("Ryan's Stuff").appendTo(head);
	var button = $('<button>').attr('type','button')
		.attr('class','navbar-toggle collapsed')
		.attr('data-toggle','collapse')
		.attr('data-target','#ryans_nav');
	$('<span>').attr('class','sr-only').html('Toggle navigation').appendTo(button);
	$('<span>').attr('class','icon-bar').appendTo(button);
	$('<span>').attr('class','icon-bar').appendTo(button);
	$('<span>').attr('class','icon-bar').appendTo(button);
	button.appendTo(head);
	var navs = $('<div>').attr('class','collapse navbar-collapse')
		.attr('id','ryans_nav');
	var ul = $('<ul>').attr('class','nav navbar-nav').appendTo(navs);
	var index = $('<a>').attr('href','index.html').html('Home')
		.appendTo($('<li>').appendTo(ul));
	var poker = $('<a>').html('Poker').attr('href','poker.html')
		.appendTo($('<li>').appendTo(ul));
	var conway = $('<a>').html('Conways').attr('href','game.html')
		.appendTo($('<li>').appendTo(ul));
	navs.appendTo(fluid);
	if(window.location.pathname.indexOf('poker')>=0){
		$('<span>').attr('class','sr-only').html('(current)').appendTo(poker);
		poker.parent().attr('class','active');
	}else if(window.location.pathname.indexOf('game')>=0){
		$('<span>').attr('class','sr-only').html('(current)').appendTo(conway);
		conway.parent().attr('class','active');
	}else{
		$('<span>').attr('class','sr-only').html('(current)').appendTo(index);
		index.parent().attr('class','active');
	}
};

Nav_Header.prototype.left_header = function(){

};

Nav_Header.prototype.center_header = function(){
	
};

Nav_Header.prototype.right_header = function(){
	
};

Nav_Header.prototype.nav_area = function(){
	
};

$(document).ready(function(){
	window.nav_header = new Nav_Header();
	window.nav_header.header();
	
});
