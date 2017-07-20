//Global variables
var pos = {lat: 0, long: 0};


//Click handlers

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
    });

//Functions
4