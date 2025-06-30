let today = new Date();
let currentDay = today.getDate();
let currentMonth = today.getMonth();
let currentYear = today.getFullYear();
let dayOfWeek = today.getDay(); 
let flag = 0;
let meteo_api;

let but_val = ["dark mode", "light mode"];
let off = 0;
let off_y = 0;
let city = "Torino"; //change the name of the city


let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];


let days = ["Sun", "Mon", "Tu", "Wed", "Thu", "Fri", "Sat"];

let month_days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];


document.addEventListener("DOMContentLoaded", function () {
fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${city}`)
  .then(response => response.json())
  .then(data => {
    if (data.length > 0) {
      const lat = data[0].lat;
      const lon = data[0].lon;
      console.log("lat:" + lat + "  lon:" + lon);
	meteo_api = "https://api.open-meteo.com/v1/forecast?latitude="+lat+"&longitude="+lon+ "&current=is_day,temperature_2m,precipitation,rain&forecast_days=1";

    } else {
      console.log("Città non trovata");
    }


fetch(meteo_api)
	  .then(res => {
	    if (!res.ok) throw new Error("Errore fetch: " + res.status);
	    return res.json();
	  })
	  .then(data => {

		const currentTemp = data.current.temperature_2m;
		const is_day = data.current.is_day;
		const precipitation = data.current.precipitation;
		const rain = data.current.rain;

		document.getElementById("currentTemp").textContent = city+" "+currentTemp + "°C";


	  })
	  .catch(err => console.error(err));

  })
  .catch(error => {
    console.error("Errore nella richiesta:", error);
  });



	write();
	document.getElementById("dm_bt").textContent = but_val[0];

	

});


function write(){
	if (currentYear+off_y % 4 == 0 ) { month_days[1] = 29;}


	document.getElementById("Month").textContent =  "m: "+months[currentMonth+off]; 
	document.getElementById("Year").textContent =  "y: "+(currentYear+off_y);   

	const rows = 7;
	const cols = 7;

	let  container = document.getElementById("container");
	container.innerHTML = "";
	container.style.display = "grid";
	container.style.gridTemplateColumns = `repeat(${cols}, 40px)`;
	container.style.gridTemplateRows = `repeat(${rows}, 40px)`;


	for (let c = 0; c < cols; c++) {
		const box = document.createElement("div");
		if(c==6) 
			box.textContent = days[0]; 
		else 
			box.textContent = days[c+1]; 
		box.style.border = "1px solid #333";
		box.style.textAlign = "center";
		box.style.fontWeight = "bold";
		container.appendChild(box);
	}

	let firstDay = (new Date(currentYear+off_y, currentMonth+off)).getDay();

	let offset = firstDay === 0 ? 6 : firstDay - 1;

	let dayNumber = 1;

	for (let r = 1; r < rows; r++) {
		for (let c = 0; c < cols; c++) {

		const box = document.createElement("div");

		let cellIndex = (r - 1) * cols + c;

		if (cellIndex >= offset && dayNumber <= month_days[currentMonth+off]) {
			box.textContent = dayNumber;
			dayNumber++;
			if(dayNumber == currentDay+1 && off == 0){
				
				if(flag == 0){
					box.style.background = "black";
					box.style.color = "white";
				}else{
					box.style.background = "white";
					box.style.color =  "#121212";
				}

			}


		} else {
			box.textContent = "";
		}
			box.style.border = "1px solid #333";
			box.style.textAlign = "center";
			container.appendChild(box);
		}
	}

}

function next(){
	off++;
	if(currentMonth+off>11){
		off_y++;
		off=-currentMonth;
	}
	write();
	
}

function prev(){
	off--;
	if(currentMonth+off<0){
		off_y--;
		off=11-currentMonth;
	}
	write();

}

document.addEventListener("DOMContentLoaded", function () {

//serach 
    const form = document.getElementById("search-form");
    if (form) {
	form.addEventListener("submit", function (event) {
	event.preventDefault();
	const valore = document.getElementById("search-input").value;
	console.log("Hai cercato:", valore);
	valore.replace(/ /g, '+');
	window.location.replace("https://www.google.com/search?q="+valore);
        });
    }

  const savedMode = localStorage.getItem("darkMode");
    if (savedMode !== null) {
        flag = parseInt(savedMode);
        if (flag === 1) {
            document.body.classList.add("dark-mode");
        }
    }


    document.getElementById("dm_bt").textContent = but_val[flag];


});


//toggle from dark to light mode

function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");

    flag = 1 - flag;
    localStorage.setItem("darkMode", flag);

    document.getElementById("dm_bt").textContent = but_val[flag];
    write();
}


