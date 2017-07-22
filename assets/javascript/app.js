//Global variables
var pos = {lat: 0, long: 0};
var bHavePos = false;
var weather = {temp: 0, rain: false, snow: false, humidity: 0, desc: ""};


//Click handlers
//window.onload = function () {
function getLatLong(){
        // Try HTML5 geolocation.
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
            pos = {
                  lat: position.coords.latitude,
                  lng: position.coords.longitude
                };

                bHavePos = true;
              }, function() {

                 $("#geoModal").modal();
              },{timeout:5000}
            );
        } else {

            $("#geoModal").modal();
        } 

        getWeather();

    };



$(document).on("click", "#submitAddressBtn", function(event){
      var zipcode ;//= prompt("Enter zip code");
      var regEx = /^\b\d{5}(-\d{4})?\b$/;
      var bValid = false;
      zipcode = $("#zip").val().trim();
      address = $("#address").val().trim();
      address += " ";
      address += $("#city").val().trim();
      address += " ";
      address += zipcode;
      if(zipcode.match(regEx) )
      {
          var geocoder = new google.maps.Geocoder();
            geocoder.geocode({'address':address}, function(results, status){
                if(status == google.maps.GeocoderStatus.OK){
                    pos = {
                      lat: results[0].geometry.location.lat(),
                      lng: results[0].geometry.location.lng()
                    };
                    //console.log(pos);
                }
            });
        }
        else
        {
            //This isn't working properly, will fix later so user does not have to start over from the beginning, but for now, 
            //user will have to start over from the beginning
             // Stop submission of the form
            event.preventDefault();
            var text = "SOUS has to know your general area to tailor the search results to you.";

            text += "\nThe zip code entered was not valid.";

            $("#modalText").text(text);

            }
        if(bValid){
           $("#geoModal").modal();
      }
      getWeather();
});

//Functions
function getLatLong(){
    // Try HTML5 geolocation.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
        pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            console.log(pos);
          }, function() {

             $("#geoModal").modal();
          });
    } else {

        $("#geoModal").modal();
    } 
}

function getWeather(){

    if(bHavePos){
        //pos.lat = 35.34558848;
        //pos.lng = -80.7119484;
        if(pos.lat != 0 && pos.lng != 0){

            var queryURL = "http://api.openweathermap.org/data/2.5/find?lat="+pos.lat+"&lon="+pos.lng+"&units=imperial&appid=166a433c57516f51dfab1f7edaed8413";

               // Creates AJAX call for the specific lon and lat of a city

               $.ajax({
                  url: queryURL,
                  method: "GET"
                }).done(function(response) {
                  console.log(response);
                  console.log(response.list[0].weather[0]);

               weather.temp = response.list[0].main.temp;
               weather.rain = response.list[0].rain;
               weather.snow = response.list[0].snow;
               weather.humidity = response.list[0].main.humidity;
               weather.desc = response.list[0].weather[0].main;
               console.log(weather);            
                });
            }
                
        } else {
            //Don't want to check more than about 20 times
            var counter = 0;
            if(counter < 20){
                counter++;

                setTimeout(getWeather, 250); 
               
            }

        }       
    
}