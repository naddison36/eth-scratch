(function(ext) {
    // Cleanup function when the extension is unloaded
    ext._shutdown = function() {};

    // Status reporting code
    // Use this to report missing hardware, plugin or unsupported browser
    ext._getStatus = function() {
        return {status: 2, msg: 'Ready'};
    };

    ext.get_temp = function(location, callback) {
        console.log(`about to get temp for ${location}`);

        // Make an AJAX call to the Open Weather Maps API
        $.ajax({
            // using https://cors.io/ to get around Cross-Origin Resource Sharing
            // the browser will not let scratchx.org access other domains like samples.openweathermap.org
            url: 'https://cors.io/?https://samples.openweathermap.org/data/2.5/weather?q=London,uk&appid=b6907d289e10d714a6e88b30761fae22',
              dataType: 'json',
              jsonp: false,
              success: function( weather_data ) {
                  console.log(`weather data: ${JSON.stringify(weather_data)}`);

                  // Got the data - parse it and return the temperature
                  temperature = weather_data['main']['temp'];
                  callback(temperature);
              }
        });
    };

    // Block and block menu descriptions
    var descriptor = {
        blocks: [
            ['R', 'current temperature in city %s', 'get_temp', 'London, UK'],
        ]
    };

    // Register the extension
    ScratchExtensions.register('Weather extension', descriptor, ext);
})({});