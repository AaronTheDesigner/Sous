//Global variables
var pos = {lat: 0, long: 0};
var bHavePos = false;
var weather = {temp: 0, rain: false, snow: false, humidity: 0, desc: ""};
var season = "summer";


//Click handlers
window.onload = function () {
  getLatLong();

  getSeason();

}

function getSeason() {
  var currentTime = moment();
  var month = moment().month();
  var date = moment().date();

  //month is a 0 based index
  //March - May = spring
  //June - August  =  summer
  //September - November  =  autumn
  //December - February  =  winter.
  if(month >= 2 && month <= 4)
    season = "spring";
  else if(month >= 5 && month <= 7)
    season = "summer";
  else if(month >= 8 && month <= 10)
    season = "autumn";
  else if( month == 12 || month == 0 || month == 1)
    season = "winter";

}

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
                    bHavePos = true;
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

// Initialize Firebase
  var config = {
    apiKey: "AIzaSyDtVG5YDE6ULEymmmVSew-JH_53LEaBox8",
    authDomain: "allyourbase-5e700.firebaseapp.com",
    databaseURL: "https://allyourbase-5e700.firebaseio.com",
    projectId: "allyourbase-5e700",
    storageBucket: "allyourbase-5e700.appspot.com",
    messagingSenderId: "777682871332"
  };
  
  firebase.initializeApp(config);

  var database = firebase.database();

  //Yummly Variables
  var appID = "5129dd16";

  var appKey = "9772f1db10ba433223ad4e765dc2b537";
  var ingredients = [];

  //var queryURL
  var queryURL = "http://api.yummly.com/v1/api/recipes";
  //ajax
 var getresults = function(ingred, callback){
  $.ajax({
      url: queryURL,
      data: {
        "_app_id": appID,
        "_app_key": appKey,
        "q": season,
        "allowedIngredient":ingred,
        "source": ""
      },
      method: "Get"
    }).then(function(response) {
      queryURL = "http://api.yummly.com/v1/api/recipe/"+response.matches[0].id;
      console.log("Logging: "+response.matches[0].id);
      $.ajax({
      url: queryURL,
      data: {
       "_app_id": appID,
        "_app_key": appKey

      },
      method: "Get"
    }).done(function(recipe) {
        console.log("test", response);
        console.log("test", recipe);
      callback(response, recipe);
       })
    })
}


  
  function callback(response, recipe){
    console.log("Callback", response);
    console.log("Callback", response.matches[0].source);
    console.log("Callback Recipe: ",recipe);

    var showDiv = $("<div class='show'>");
    //emplty #show of previous results
    $("#show").empty();
    $("#matchList").empty();
    //Store Recipename
    var recipeName = response.matches[0].recipeName;
    $("#matchTitle").text(recipeName);
    //element to have Name displayed
    //var pOne = $("<p>").text(recipeName);
    //display Recipename
    //showDiv.append(pOne);
    //image url
    var imageURL = recipe.images[0].hostedMediumUrl;
    //element to hold image
    //var image = $("<img>").attr("src", imageURL);
    ///display image
    $("#img").attr('src', imageURL);
    //result ingredient list
    var ingList = response.matches[0].ingredients;
    //display ingLis
  //Displaying the recipe
    $("#matchList").prepend(showDiv);

    
    //for loop
    for (var i = 0; i < ingList.length; i++) {
      
      var matchDiv = $("<div>");
      //store 
      var matchList = ingList[i];
      //element to have list displayed
      var element = $("<li class='list-group-item text-center'>").text(matchList);
      //display list
      matchDiv.append(element);
      //prepend list to match list
      $("#matchList").prepend(matchDiv);

      //storage
      var matchItem = {
        matchItems: matchList
      };
      //database upload
      database.ref().push(matchItem);
      //log
      console.log(matchItem.matchItems);

  
    };

  //onclick event for add list
      $("#add").on("click",function(event){
        event.preventDefault();
        //empty ing
        $("#ing").empty();

      
        //sigh another for loop
        var pushList = response.matches[0].ingredients;
        for (var j = 0; j < pushList.length; j++) {
          console.log(pushList[j]);
          //div
          var listDiv = $("<div>");
          //store
          var listGo = pushList[j];
          //element to have list displayed
          var listElement = $("<li class='list-group-item text-center'>").text(listGo);
          //append to ing
          $("#ing").append(listElement);
          $("#matchList").empty();
        };
        //replace with chosen recipe
        
      });

    


  };
    $("#submit").on("click", function(event){
    event.preventDefault();

   if(!bHavePos){

      //Don't want to check more than about 20 times
      var counter = 0;
      if(counter < 20 && !bHavePos){
          counter++;
          //setTimeout(getLatLong, 250);          
      }

    }

    //button for adding ingredients
    var itemName = $("#input").val().trim();

    //Storage
  var newItem = {
      item: itemName
    };

    //database upload
    database.ref().push(newItem);

    //log to console
    var sub = newItem.item;
    ingredients.push(itemName);
    //clear search
    $("#input").val("");

    getresults(ingredients, callback);
    $("#ing").append("<li class='list-group-item text-center'>" + newItem.item + "</li>");
    $("#card").removeClass('hide');

    console.log(newItem.item); 
});
  //reset button
  $("#reset").on("click", function(event){
    event.preventDefault();
    $("#card").addClass('hide');
    $("#ing").empty();
  });