var cityHTML = document.querySelector('#cityHTML')
console.log("you're in")
var searchButton = document.getElementById('search-button');
var input = document.querySelector('#input');
var cities = document.querySelector('#cities');
var result = document.querySelector('#result');
var tempBox = document.querySelector('#tempBox');
var humidBox = document.querySelector('#humidBox');
var windBox = document.querySelector('#windBox');
var uviBox = document.querySelector('#uviBox');
var card = document.querySelector('#card-div');
var copy = document.querySelector('#copy');
var contentHigher = document.querySelector('#contentHigher');
var userError = document.querySelector('#userError');

function timeConverter(UNIX_timestamp){
    var a = new Date(UNIX_timestamp * 1000)
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
    var year = a.getFullYear()
    var month = months[a.getMonth()]
    var date = a.getDate()

    var time = date + ' ' + month + ' ' + year
    return time
}

iconPlace = document.querySelector("#icon");

init();
var storedlist = JSON.parse(localStorage.getItem('lists'));
function init(){
  var storedlist = JSON.parse(localStorage.getItem('lists'));
  console.log(storedlist);
  if (storedlist !== null) {

      for (var i = 0; i < storedlist.length; i++) {
        var li = document.createElement('li');
        li.setAttribute["data-index", i]
        li.textContent= storedlist[i];
        cities.appendChild(li);
        var values = cities.lastChild.textContent;
        console.log(values);
        input.value = values;
        console.log(input.value);
      }  
  }
  else if (storedlist === null){
    return;
  };
}

$(document).ready(function () {
    if (storedlist !== null) {
      $('.search-button').trigger('click')
      cities.removeChild(cities.lastElementChild);
      input.value = "";  
    }
});

var lists = [];

 function setItem(){
   localStorage.setItem("lists", JSON.stringify(lists));
 }

 searchButton.addEventListener('click', function(e) {
    e.preventDefault();
    $(".icon").empty();

    var inputval = input.value.trim();
    console.log(inputval);
    if (inputval !== null) {
    fetch('https://api.openweathermap.org/data/2.5/weather?q='+ inputval +'&appid=66344966e0a23155ed5633e180b730e8')
    .then(response => response.json())
    .then(data => {
        var lat = data["coord"]["lat"]
        var lon = data["coord"]["lon"]
        console.log(data)
        
        var cityName = data.name;
            if (cityName !== undefined) {
                var li = document.createElement('li')
                li.textContent = cityName
            lists.push(cityName)
            cities.appendChild(li)
            }

        userError.textContent = ""
        input.value = ""
        setItem()
        console.log(data)
        while (cityName === undefined) {
            $("card-div").empty()
            error.textContent = "City not found. Please enter valid city name."
            return

        }
        
        var dt = timeConverter(data['dt'])
        result.innerHTML = data.name + ' (' + dt + ')'

        var tempRaw = parseFloat(data['main']['temp'])
        var temperatureF = ((tempRaw-273.15)*1.8)+32
        tempBox.innerHTML = "Temperature (F): " + Math.round(temperatureF)

        var humidity = data['main']['humidity']
        humidBox.innerHTML = "Humidity: " + humidity + "%"
        
        var windspeed = parseFloat(data['wind']['speed'])
        windBox.innerHTML = "Windspeed: " + Math.round(windspeed * 1.15) + "mph"

        var iconCode = data['weather'][0]['icon']

        var img = document.createElement('img')
        var iconLocation = "http:openweathermap.org/img/w/" + iconCode + ".png"
        img.src = iconLocation
        iconPlace.append(img)
        copy.innerHTML = data['weather']['0']['description']


        openAPIcall ();
        function openAPIcall () {
        fetch('https://api.openweathermap.org/data/2.5/onecall?lat='+lat+'&lon='+lon+'&appid=66344966e0a23155ed5633e180b730e8')
        .then(response => response.json())
        .then(data => {
            console.log(data)

            var uvi = parseFloat(data['current']['uvi'])
            uviBox.innerHTML = "UV Index: " + uvi

            $(".card-div").empty()
            for (var i = 1; i <= 5; i++) {
                var forDate = timeConverter(data['daily'][i]['dt'])
                var forTemp = "Temperature (F): " + (Math.round((data['daily'][i]['temp']['max']-273.15)*1.8)+32)
                var forHumid = "Humidity: " + data['daily'][i]['humidity'] + "%"
                var forIcon = data['daily'][i]['weather']['0']['icon']
                    forIconURL = "http://openweathermap.org/img/w/" + forIcon + ".png"

                    var forImg = document.createElement('img')

                    img.src = forIconURL
                var div = document.createElement('div')
            var br = document.createElement('br')
            
                div.append(forDate)
                div.appendChild(br)
                div.appendChild(br)
                div.append(forImg)
                div.appendChild(br)
                div.appendChild(br)
                div.append(forTemp)
                div.appendChild(br)
                div.appendChild(br)
                div.append(forHumid)

                card.appendChild(div)
            } 
        });
      }  
     });
    
    }
  });

$("#cities").on("click", "li", function () {
    console.log(this)
    var thisvalue = this.textContent
    console.log(thisvalue)
    input.value = thisvalue

    $(".search-button").trigger('click')
    cities.removeChild(this)
});
