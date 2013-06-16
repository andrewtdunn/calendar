function Calendar(el, country, inputForm, date ){

	var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November','December'];
	var days = ['Su','Mon','Tu','Wed','Th','Fri','Sa'];
	var holidayURL = "http://web1.pdapi.com/cs/JSI/internal/tests/test-recruit-api.php";
	var currMethod = "getHolidays";
	var liteRed = "#FF8888";
	var currMonth,currDate,currYear,currCellDate,maxDaysInMonth;
	var cellwidth = 50;
	var cellHeight = 50;
	var inMonth = true;
	var MILLISECONDS_IN_DAY = 1000 * 60 * 60 * 24;
	var container;
	var calDate;
	var holidays;
	var worldHolidays;
	var dateSet = false;
	var inputFormId;

	


	function init(inputDate){

		//console.log("init el = " + that.container);
		//console.log("init inputForm = " + that.inputFormId);
		// get holidays....
		
		that.calDate  = (that.inputDate)? that.inputDate: new Date();
		currDate = date.getDate();
		currYear = date.getFullYear();
		currMonth = date.getMonth();
		that.daysBewteenFirsts  = getDaysBetweenFirsts(date);
		//console.log("days since the first of the year = " + that.daysBewteenFirsts);
		getDayOfFirstOfMonth(date);
		getDateOfLastOfMonth(date);
		//console.log("maxDaysInMonth" + maxDaysInMonth);
		getHolidays();
	}

	function beginBuild(){
		
		
		construct();
	}

	// get the number of days between the first of the month and the first of the year
	function getDaysBetweenFirsts(date){
		var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
		var firstDate = new Date(date.getYear(),00,01);
		var secondDate = new Date(date.getYear(), date.getMonth(), 1);
		//console.log("first of the year " +  secondDate);
		//console.log("date " + date);
		var diffDays = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime())/(oneDay)));
		return diffDays;
	}

	function getDayOfFirstOfMonth(date){
		// get the day of the week of the first of the month
		// use this to offseet the currCelDate
		var firstOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
		var firstOfMonthDay = firstOfMonth.getDay();
		currCellDate = 1 - firstOfMonthDay;
	}

	function getDateOfLastOfMonth(date){
		var firstOfNextMonth = new Date(date.getFullYear(), date.getMonth() +1 , 1);
		// subtract one day from first of next month and get that date
		firstOfNextMonth.setDate(firstOfNextMonth.getDate()-1);
		maxDaysInMonth = firstOfNextMonth.getUTCDate();
	}

	function construct(){

		//console.log("createTable " + date);

		var table = document.createElement('table');
		table.style.border="3px solid black";
		table.style.borderCollapse = "collapse";
		//console.log("construct: el = " + that.container.id);
		document.getElementById(that.container).appendChild(table);
		table.onclick = onCellClick;
		topRow = table.insertRow(0);

		//topRow.onclick = adjustDate();

		var dblLeft = topRow.insertCell(0);
		styleCell(dblLeft,false, true);
		dblLeft.className = "heading";
		addButton(dblLeft, "subYear", "<<", subtractYear);


		var left = topRow.insertCell(1);
		styleCell(left,false, true);
		left.className = "heading";
		addButton(left, "subMonth", "<", subtractMonth);


		var month = document.createElement('th');
		month.colSpan = 3;
		month.className = "heading";
		topRow.appendChild(month);

		month.innerHTML = that.calDate.getFullYear() + " " + months[that.calDate.getMonth()]; 


		var right = topRow.insertCell(3);
		styleCell(right,false, true);
		right.className = "heading";
		addButton(right, "addMonth", ">", addMonth);

		var dblRight = topRow.insertCell(4);
		styleCell(dblRight,false, true);
		dblRight.className = "heading";
		addButton(dblRight, "addYear", ">>", addYear);

		//console.log("inMonth is " + inMonth);
		while (inMonth) addRow(table);

		//console.log(topRow);
	}


	function addRow(table){
		//console.log("adding row");
		var numRows = table.getElementsByTagName('tr').length;
		var newRow = table.insertRow(numRows);
		for (var i = 0;  i < 7; i++){
			var newCell = createCell(newRow,i);
		}
	
	}	

	function createCell(row, cellNum){
		var newCell = row.insertCell(cellNum);
		styleCell(newCell);
		
		if (currCellDate == currDate && !dateSet) {newCell.style.fontWeight = "bold"; dateSet = true; }
		if (currCellDate > 0  && currCellDate <= maxDaysInMonth)
		{

			newCell.innerHTML = currCellDate;
			newCell.style.cursor = "pointer";
			//console.log("days between firsts = " + that.daysBewteenFirsts);
			var totalDaysSinceJanOne = that.daysBewteenFirsts + currCellDate-1; // because we don't want to count first of the month twice
			//console.log("It is the " + currCellDate + " and the days between first is = " + that.daysBewteenFirsts + " and the totals days is " + totalDaysSinceJanOne);
			//console.log (totalDaysSinceJanOne % 3);
			
			// every third day, beginngin with the first of the year is light green, except weekends
			if (cellNum !== 0 && cellNum !== 6 && (totalDaysSinceJanOne % 3 === 0)){
				newCell.style.backgroundColor = "#98fb98";
			}
			// grey background for weekends
			if (cellNum === 0 || cellNum === 6) newCell.style.backgroundColor = "#dddddd";
			for (var day in holidays){
				if (parseInt(day,10) === currCellDate){
					newCell.style.backgroundColor = liteRed;
					newCell.title=holidays[day];
					newCell.style.cursor="pointer";
					newCell.onmouseover = highlightHoliday;
					newCell.onmouseout = resetHoliday;
				}	
			}
			for (day in worldHolidays){
				if (parseInt(day,10) === currCellDate){
					newCell.style.backgroundColor = liteRed;
					newCell.title=worldHolidays[day];
					newCell.style.cursor="pointer";
					newCell.onmouseover = highlightHoliday;
					newCell.onmouseout = resetHoliday;
				}	
			}
		} 
		currCellDate ++;
		if (currCellDate > maxDaysInMonth) inMonth = false;

	}

	function styleCell(cell,isMonth, isHeader){
		if(!isHeader)cell.style.border="1px solid black";
		cell.style.width = (isMonth)?3*cellwidth+"px":cellwidth+"px";
		cell.style.height = cellHeight + "px";
		cell.style.textAlign = "center";

	}

	function subtractMonth(){
		resetCalendar();
		that.calDate.setMonth(that.calDate.getMonth()-1);
		init(calDate);
	}

	function subtractYear(){
		resetCalendar();
		that.calDate.setYear(that.calDate.getFullYear()-1);
		init(calDate);
	}

	function addMonth(){
		resetCalendar();
		that.calDate.setMonth(that.calDate.getMonth()+1);
		init(calDate);
	}
	function addYear(){
		resetCalendar();
		that.calDate.setYear(that.calDate.getFullYear()+1);
		init(calDate);

	}
	function resetCalendar(){
		inMonth = true;
		var parent = document.getElementById(that.container);
		while (parent.hasChildNodes()) {
			parent.removeChild(parent.lastChild);
		}
	}

	function addButton(el, id, label, callback){
		var newButton = document.createElement("input");
		newButton.type = "button";
		newButton.name = id;
		newButton.id = id;
		newButton.value = label;
		newButton.style.width = "40px";
		newButton.style.cursor = "pointer";
		newButton.onclick = callback;
		el.appendChild(newButton);

	}

	function getHolidays(month,date,year)
	{
		if (!Calendar.prototype.holidaysInitiated)
		{
			var s = document.createElement('script');
			s.type = 'text/javascript';
			var code = 'function loadData(data,data2,object){Calendar.prototype.loadData(object);};';
			try {
				s.appendChild(document.createTextNode(code));
				document.getElementsByTagName('head')[0].appendChild(s);
			} catch (e) {
				s.text = code;
				document.body.appendChild(s);
			}
			Calendar.prototype.holidaysInitiated = true;
		}

		var script = document.createElement('script');
		var dbMonth = currMonth +1;
		script.src = holidayURL+"?month="+dbMonth+"&year="+currYear+"&country="+that.currCountry+"&method="+currMethod+"&protocol=jsonp&callback=loadData";


		document.getElementsByTagName('head')[0].appendChild(script);
	}

	function onCellClick(e){
		var e = window.event  || e;
		var cell = e.target || e.src;
		if(cell.innerHTML != "" && cell.className != "heading"){
			cell.style.backgroundColor="yellow";
			//console.log("onCellClick inputForm = " + that.inputFormId );
			if( that.inputFormId && document.getElementById(that.inputFormId).value != ""){
				console.log("input value " + document.getElementById(that.inputFormId).value);
				cell.innerHTML = document.getElementById(that.inputFormId).value;
			} 
		}
		
	}

	function highlightHoliday(e){
		var e = window.event  || e;
		var cell = e.target || e.src;
		cell.style.backgroundColor = "red";
	}

	function resetHoliday(e){
		var e = window.event  || e;
		var cell = e.target || e.src;
		cell.style.backgroundColor = liteRed;
	}
	
	Calendar.prototype.loadData = function(data){
		//console.log("holidays loaded " + data);
		holidays = data.holidays;
		worldHolidays = data["holidays-world"];
		beginBuild();
	};

	//if(!Calendar.prototype.holidaysInitiated)Calendar.prototype.holidaysInitiated = false;
	this.inputFormId = inputForm;
	this.container = el;
	this.currCountry = country;
	this.inputDate = date;
	this.inMonth = true;
	var that = this;

	init();
}

