function EZSlots(id,useroptions){
	var that = this; //keep reference to function for use in callbacks
	//set some variables from the options, or with defaults.
	var options = useroptions ? useroptions : {};
	this.reelCount = options.reelCount ? options.reelCount : 3; //how many reels, assume 3 
	this.symbols = options.symbols ? options.symbols : ['A','B','C'];
	this.sameSymbolsEachSlot = true;
	this.winningSet = options.winningSet;
	this.width = options.width ? options.width : 100;
	this.height = options.width ? options.height : 100;
	this.howManySymbolsToAppend = 30; //how many symbols each spin adds
	this.endingLocation = 5; //location for selected symbol... needs to be a few smaller than howManySymbolsToAppend
	this.time = options.time ? options.time : 2000 //time in millis for a spin to take
    this.delay = 500;
	this.jqo = $("#"+id); //jquery object reference to main wrapper
	this.jqoSliders = []; //jquery object reference to strips sliding up and down
	this.spinCost = 200;
	this.balance= 0;
	
	
	var win = document.getElementById("win"); 

	//to initialize we construct the correct number of slot windows
	//and then populate each strip once
	this.init = function(){
		this.jqo.addClass("ezslots"); //to get the css goodness
		//figure out if we are using the same of symbols for each window - assume if the first 
		//entry of the symbols is not a string we have an array of arrays
		if(typeof this.symbols[0] != 'string'){
			this.sameSymbolsEachSlot = false;
		}
		//make each slot window
		for(var i = 0; i < this.reelCount; i++){
			var jqoSlider = $('<div class="slider"></div>');
			var jqoWindow = $('<div class="window window_"'+i+'></div>');
                        var jqoWinLineBox= $('<div class="winLineBox winLineBox_"'+i+'></div>');
                        var jqoWinline0 = $('<div class="winLine"></div>');
                        var jqoWinline1 = $('<div class="winLine1"></div>');
                        var jqoWinline2 = $('<div class="winLine2"></div>');
			if (i == 0){
			this.scaleWid(jqoWindow).append(jqoSlider);}//make window right size and put slider in it
			else {this.scaleWid1(jqoWindow).append(jqoSlider);} 
			this.jqo.append(jqoWindow); //add window to main div
                        if(i<this.reelCount-1){
                        this.jqo.append(jqoWinLineBox); //add winLine Box to main div
                        jqoWinLineBox.append( jqoWinline0,jqoWinline1,jqoWinline2);}
			this.jqoSliders.push(jqoSlider); //keep reference to jqo of slider
			this.addSymbolsToStrip(jqoSlider,i); //and add the initial set 
		}  

	};
	//convenience function since we need to apply width and height to multiple parts
	this.scaleJqo = function(jqo){
		jqo.css("height",this.height+"px").css("width",this.width+"px");
		return jqo;
	}
	
	this.scaleWid = function(jqo){
		jqo.css("height",242+"px").css("width",141+"px").css("margin-left",45+"px");
		return jqo;
	}
	
	this.scaleWid1 = function(jqo){
		jqo.css("height",242+"px").css("width",141+"px");
		return jqo;
	}
	
	// Warn if overriding existing method
if(Array.prototype.equals)
    console.warn("Overriding existing Array.prototype.equals. Possible causes: New API defines the method, there's a framework conflict or you've got double inclusions in your code.");
// attach the .equals method to Array's prototype to call it on any array
Array.prototype.equals = function (array) {
    // if the other array is a falsy value, return
    if (!array)
        return false;

    // compare lengths - can save a lot of time 
    if (this.length != array.length)
        return false;

    for (var i = 0, l=this.length; i < l; i++) {
        // Check if we have nested arrays
        if (this[i] instanceof Array && array[i] instanceof Array) {
            // recurse into the nested arrays
            if (!this[i].equals(array[i]))
                return false;       
        }           
        else if (this[i] != array[i]) { 
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;   
        }           
    }       
    return true;
}
// Hide method from for-in loops
Object.defineProperty(Array.prototype, "equals", {enumerable: false});




	//add the various symbols - but take care to possibly add the "winner" as the symbol chosen
	this.addSymbolsToStrip = function(jqoSlider, whichReel, shouldWin){
		var symbolsToUse = that.sameSymbolsEachSlot ? that.symbols : that.symbols[whichReel];
		setWinSet ();
		var chosen =  shouldWin ? that.winningSet[whichReel] : Math.floor(Math.random()*symbolsToUse.length);
		for(var i = 0; i < that.howManySymbolsToAppend; i++){
			var ctr = (i == that.endingLocation) ? chosen : Math.floor(Math.random()*symbolsToUse.length);
			//we nest "content" inside of "symbol" so we can do vertical and horizontal centering more easily
			var jqoContent = $("<div class='content'>"+symbolsToUse[ctr]+"</div>");
			that.scaleJqo(jqoContent);
			var jqoSymbol = $("<div class='symbol'></div>");
			that.scaleJqo(jqoSymbol);
			jqoSymbol.append(jqoContent);
			jqoSlider.append(jqoSymbol);
		}
               //alert(chosen);
		return chosen;
	}
	//to spin, we add symbols to a strip, and then bounce it down
	this.spinOne = function(jqoSlider,whichReel,shouldWin,delay){
		var heightBefore = parseInt(jqoSlider.css("height"), 10); 
		var chosen = that.addSymbolsToStrip(jqoSlider,whichReel,shouldWin);
		var marginTop = -(heightBefore + ((that.endingLocation) * that.height));
		jqoSlider.stop(true,true).animate(
			{"margin-top":marginTop+"px"},
			{'duration' : that.time + delay, 'easing' : "easeOutElastic"});
		return chosen;
	}

	this.spinAll = function(shouldWin){
		var results = [];
		var spinAudio = document.getElementById("spinAudio"); 
		
		that.balance =  Number(document.getElementById("showBanlance").innerText );
		//alert(typeof that.balance);
		if (that.balance <= 0 ) {
			alert ("please insert coins" );
			return;
		}
		that.balance -= that.spinCost ;
		//alert (that.balance);
		document.getElementById("showBanlance").innerHTML = that.balance;
		
		 $("#cheeryTop, #cheeryCenter, #cheeryBottom, #anyLine7, #conbCherry7, #anyLine3Bar, #anyLine2Bar ,#anyLine1Bar ,#conbBars").removeClass("blink");
		 $(".winLine,.winLine1,.winLine2").css("background-color", "white");
		 spinAudio.play();
		 
		for(var i = 0; i < that.reelCount; i++){
                         
				results.push(that.spinOne(that.jqoSliders[i],i,shouldWin, that.delay*i));
			}
        $("#spin").attr('disabled', true);
	   setTimeout(function() { 
        $("#spin").attr('disabled', false);
        payTable(results) ;
          }, 6200);
		return results;
	}
	
	function payTable(results){
		
		var winAudio = document.getElementById("winAudio"); 
		
		 if ( results.equals([0, 0, 0]) ) {
			that.balance += 60; 
			document.getElementById("showBanlance").innerHTML = that.balance;
			 $("#anyLine3Bar,#anyLine1Bar").addClass("blink");
			 $(".winLine,.winLine2").css("background-color", "red");
			 winAudio.play();
		}
		else if ( results.equals([1, 1, 1]) ) {
			that.balance += 30; 
			document.getElementById("showBanlance").innerHTML = that.balance;
			 $("#anyLine2Bar,#anyLine1Bar").addClass("blink");
			 $(".winLine,.winLine2").css("background-color", "red");
			 winAudio.play();
		}
		else if ( results.equals([2, 2, 2]) ) {
			that.balance += 170; 
			document.getElementById("showBanlance").innerHTML = that.balance;
			 $("#anyLine7,#anyLine2Bar").addClass("blink");
			 $(".winLine,.winLine2").css("background-color", "red");
			 winAudio.play();
		}
		else if ( results.equals([3, 3, 3]) ) {
			that.balance += 4150; 
			document.getElementById("showBanlance").innerHTML = that.balance;
			 $("#cheeryBottom,#anyLine7").addClass("blink");
			 $(".winLine,.winLine2").css("background-color", "red");
			 winAudio.play();
		}
        else if ( results.equals([4, 4, 4]) ) {
			that.balance += 2050; 
			document.getElementById("showBanlance").innerHTML = that.balance;
			 $("#cheeryTop,#anyLine3Bar").addClass("blink");
			 $(".winLine,.winLine2").css("background-color", "red");
			 winAudio.play();
		}
		 else if ( results.equals([5, 5, 5]) ) {
			that.balance += 10; 
			document.getElementById("showBanlance").innerHTML = that.balance;
			 $("#anyLine1Bar").addClass("blink");
			 $(".winLine1").css("background-color", "red");
			 winAudio.play();
		}
		 else if ( results.equals([6, 6, 6]) ) {
			that.balance += 20; 
			document.getElementById("showBanlance").innerHTML = that.balance;
			 $("#anyLine2Bar").addClass("blink");
			 $(".winLine1").css("background-color", "red");
			 winAudio.play();
		}
		else if ( results.equals([7, 7, 7]) ) {
			that.balance += 150; 
			document.getElementById("showBanlance").innerHTML = that.balance;
			 $("#anyLine7").addClass("blink");
			 $(".winLine1").css("background-color", "red");
			 winAudio.play();
		}
		else if ( results.equals([8, 8, 8]) ) {
			that.balance += 1000; 
			document.getElementById("showBanlance").innerHTML = that.balance;
			 $("#cheeryCenter").addClass("blink");
			 $(".winLine1").css("background-color", "red");
			 winAudio.play();
		}
		else if ( results.equals([9, 9, 9 ]) ) {
			that.balance += 50; 
			document.getElementById("showBanlance").innerHTML = that.balance;
			 $("#anyLine3Bar").addClass("blink");
			 $(".winLine1").css("background-color", "red");
			 winAudio.play();
		}
		else if ( results.equals([7, 8, 8 ]) || results.equals([7, 8, 7 ])|| results.equals([7, 7, 8 ]) || results.equals([8, 7, 8 ]) || results.equals([8, 7, 7 ]) || results.equals([8, 8, 7 ]) ) {
			that.balance += 75; 
			document.getElementById("showBanlance").innerHTML = that.balance;
			 $("#conbCherry7").addClass("blink");
			 $(".winLine1").css("background-color", "red");
			 winAudio.play();
		}
		else if ( results.equals([5, 5, 6 ]) || results.equals([5, 6, 5 ])|| results.equals([5, 6, 6 ]) || results.equals([5, 5, 9 ]) || results.equals([5, 9, 5 ]) || results.equals([5, 6, 9 ]) || results.equals([5, 9, 6 ]) || results.equals([5, 9, 9 ]) || results.equals([6, 5, 5 ]) || results.equals([6, 5, 6 ])|| results.equals([6, 6, 5 ]) || results.equals([6, 5, 9 ]) || results.equals([6, 9, 5 ]) || results.equals([6, 9, 9 ]) || results.equals([6, 6, 9 ]) || results.equals([6, 9, 6 ]) || results.equals([9, 5, 5 ]) || results.equals([9, 9, 5 ])|| results.equals([9, 5, 9 ]) || results.equals([9, 6, 5 ]) || results.equals([9, 5, 6 ]) || results.equals([9, 6, 6 ]) || results.equals([9, 6, 9 ]) || results.equals([9, 9, 6 ])) {
			that.balance += 5; 
			document.getElementById("showBanlance").innerHTML = that.balance;
			 $("#conbBars").addClass("blink");
			 $(".winLine1").css("background-color", "red");
			 winAudio.play();
		}
		else if ( results.equals([0, 1, 1 ]) || results.equals([0, 0, 1 ])|| results.equals([0, 1, 0 ]) || results.equals([1, 1, 0 ]) || results.equals([1, 0, 1 ]) || results.equals([1, 0, 0 ]) ) {
			that.balance += 5; 
			document.getElementById("showBanlance").innerHTML = that.balance;
			 $("#conbBars").addClass("blink");
			  $(".winLine,.winLine2").css("background-color", "red");
			  winAudio.play();
		}
	}
	
	function setWinSet (){ 
		if ( $('#symbols').val() == "Bar" && $('#position').val() == "top" ) {
			that.winningSet = [1,1,1] ;
		}
		else if ( $('#symbols').val() == "2xBar" && $('#position').val() == "top" ) {
			that.winningSet = [2,2,2] ;
		}
		else if ( $('#symbols').val() == "3xBar" && $('#position').val() == "top" ) {
			that.winningSet = [0,0,0] ;
		}
		else if ( $('#symbols').val() == "7" && $('#position').val() == "top" ) {
			that.winningSet = [3,3,3] ;
		}
		else if ( $('#symbols').val() == "cherry" && $('#position').val() == "top" ) {
			that.winningSet = [4,4,4] ;
		}
		else if ( $('#symbols').val() == "Bar" && $('#position').val() == "center" ) {
			that.winningSet = [5,5,5] ;
		}
		else if ( $('#symbols').val() == "2xBar" && $('#position').val() == "center" ) {
			that.winningSet = [6,6,6] ;
		}
		else if ( $('#symbols').val() == "3xBar" && $('#position').val() == "center" ) {
			that.winningSet = [9,9,9] ;
		}
		else if ( $('#symbols').val() == "7" && $('#position').val() == "center" ) {
			that.winningSet = [7,7,7] ;
		}
		else if ( $('#symbols').val() == "cherry" && $('#position').val() == "center" ) {
			that.winningSet = [8,8,8] ;
		}
		else if ( $('#symbols').val() == "Bar" && $('#position').val() == "bottom" ) {
			that.winningSet = [0,0,0] ;
		}
		else if ( $('#symbols').val() == "2xBar" && $('#position').val() == "bottom" ) {
			that.winningSet = [1,1,1] ;
		}
		else if ( $('#symbols').val() == "3xBar" && $('#position').val() == "bottom" ) {
			that.winningSet = [4,4,4] ;
		}
		else if ( $('#symbols').val() == "7" && $('#position').val() == "bottom" ) {
			that.winningSet = [2,2,2] ; 
		}
		else if ( $('#symbols').val() == "cherry" && $('#position').val() == "bottom" ) {
			that.winningSet = [3,3,3] ;
		}
	}
	

	this.init();
	return {
		spin : function(){
			return that.spinAll();
		},
		win : function(){
			return that.spinAll(true);
		}
	}
}

