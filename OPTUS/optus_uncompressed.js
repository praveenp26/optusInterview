var livedata = "";	
	function changeprogress(btn, limit){
	
		var e = document.getElementById("selectprogess"); 
		var selectedprogess = e.options[e.selectedIndex].value;	
		
		var oldval = document.getElementById("percent-"+selectedprogess).innerHTML;
		oldval = oldval.slice(0, - 1);
		
		btn = parseInt(btn,0) + parseInt(oldval,0);
		if (btn >= limit){
			document.getElementById(selectedprogess).style="background-color: red;width:"+btn+"%; visibility: visible;transition: width 0.5s";
			document.getElementById("percent-"+selectedprogess).innerHTML = btn+"%";		
		} else if (btn > 0 ){		
			document.getElementById(selectedprogess).style="width:"+btn+"%; visibility: visible;transition: width 0.5s";
			document.getElementById("percent-"+selectedprogess).innerHTML = btn+"%";		
		} else {
			document.getElementById(selectedprogess).style="width:0%;visibility: hidden;";
			document.getElementById("percent-"+selectedprogess).innerHTML = "0%";
		}
	}
	
	function processresponse(inpjson){
		if (typeof inpjson == "object"){
			livedata = inpjson;			
		} else {
			livedata = JSON.parse(inpjson);
		}
		
		var btnselector = "";
		for (var i = 0; i < livedata.buttons.length; i++) {
			btnselector = btnselector + "<button class='btncontrols' onclick='changeprogress("+livedata.buttons[i]+","+livedata.limit+")' value='"+livedata.buttons[i]+"'>"+ livedata.buttons[i] +"</button>";
		}
		
		document.getElementById("btnctrls").innerHTML = btnselector;
		
		var barselector = "<select id='selectprogess'>";
		var progressUI = "";
		
		
		for (var j = 0; j < livedata.bars.length; j++){
			var counter = j + 1;
			barselector = barselector+ "<option value='progress"+counter+"'>#progress"+ counter +"</option>";
			progressUI = progressUI + "<div class='prog-border'><div id='progress"+counter+"' class='prog-container prog-gray' style='width:"+livedata.bars[j]+"%'></div><div class='percent' title='"+livedata.limit+"' id='percent-progress"+counter+"'>"+livedata.bars[j]+"%</div></div>";
		}
		barselector = barselector + "</select>";
		
		document.getElementById("barctrls").innerHTML = barselector;
		document.getElementById("prog").innerHTML = progressUI;
	}
	function loadJSON(path, success, error)	{
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function()
		{
			if (xhr.readyState === XMLHttpRequest.DONE) {
				if (xhr.status === 200) {
					if (success)
						success(JSON.parse(xhr.responseText));
				} else {
					if (error)
						error(xhr);
				}
			}
		};
		xhr.open("GET", path, true);
		xhr.send();
	}
	loadJSON('http://pb-api.herokuapp.com/bars',
         function(data) { 
		 console.log(data);
			processresponse(data); 			
		 },
         function(data) { 	//302 OK
			console.log(data.response);
			processresponse(data.response); 
			
		 }
	);	