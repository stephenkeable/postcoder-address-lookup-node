"use strict";

var request = require('request');
var qs = require('qs');

/*

Create instance and basic default options

*/

var AlliesPostcodeLookup = function () {
    
    if (!(this instanceof AlliesPostcodeLookup)) {
        
        return new AlliesPostcodeLookup();
    }
    
    var config = {
        url_base: "https://ws.postcoder.com/pcw/",
        page_num: 0,
        options: {
            lines: 3,
        }
    };
    
    this.config = config;
    
}

/*

Init function

Sets up API key (required, will default to Test key if not supplied)

Optional

Options object which is turned into query string parameters
Debug use true to check search key against status service and console.log the result

*/

AlliesPostcodeLookup.prototype.init = function (api_key, options, debug) {
    
    if (typeof api_key === "string") {
        this.config.api_key = api_key;
    } else {
        this.config.api_key = "PCW45-12345-12345-1234X";
    }
    
    var new_options = options || false;
    
    if (new_options) {
        this.setOptions(new_options);
    }
    
    this.config.debug = debug || false;
    
    if (this.config.debug === true) {
    
        this.checkStatus(function(response, error) {

            if(error) {
                
                console.log(error);   
                
            } else {
            
                console.log(response);
            }
        });
        
    }
    
};

/*

Overwrite the options object after init

*/

AlliesPostcodeLookup.prototype.setOptions = function (object) {
   this.config.options = object; 
};

/*

Overwrite the page_num

*/

AlliesPostcodeLookup.prototype.setPageNum = function (page_num) {
    if(typeof page_num == "number") {
        this.config.page_num = parseInt(page_num, 10); 
    }
};

/*

Status endpoint give information about number of credits available amongst others

*/

AlliesPostcodeLookup.prototype.checkStatus = function (callback) {
  
    var request_url = this.config.url_base + this.config.api_key + "/status";
    
    send_request(request_url, function(result, error) {

        return callback(result, error);
        
    });
    
};

/*

Get list of countries including two letter ISO codes

*/

AlliesPostcodeLookup.prototype.getCountries = function (callback) {
  
    var request_url = this.config.url_base + this.config.api_key + "/country/?" + qs.stringify(this.config.options);
    
    send_request(request_url, function(result, error) {

        return callback(result, error);
        
    });
    
};

/*

International address searches

*/

AlliesPostcodeLookup.prototype.searchAddress = function (search, country, callback) {
    
    var country = country || "UK";
  
    var page_num_str = "";
    if(this.config.page_num > 0) {
        var page_num_str = "&page=" + String(this.config.page_num);
    }
    
    var request_url = this.config.url_base + this.config.api_key + "/address/" + country + "/" + encodeURIComponent(search) + "?" + qs.stringify(this.config.options) + page_num_str;
    
    send_request(request_url, function(result, error) {

        return callback(result, error);
        
    });
    
};

AlliesPostcodeLookup.prototype.searchAddressGeo = function (search, country, callback) {
  
    var country = country || "UK";
    
    var page_num_str = "";
    if(this.config.page_num > 0) {
        page_num_str = "&page=" + String(this.config.page_num);
    }
    
    var request_url = this.config.url_base + this.config.api_key + "/addressgeo/" + country + "/" + encodeURIComponent(search) + "?" + qs.stringify(this.config.options) + page_num_str;
    
    send_request(request_url, function(result, error) {

        return callback(result, error);
        
    });
    
};

AlliesPostcodeLookup.prototype.getSingleAddress = function (udprn, country, callback) {
  
    var udprn = udprn || false;
    var country = country || "UK";
    
    if(trim_check(udprn) !== false) {
  
        var request_url = this.config.url_base + this.config.api_key + "/address/" + country + "/udprn?udprn=" + encodeURIComponent(udprn) + "&" + qs.stringify(this.config.options);

        send_request(request_url, function(result, error) {

            return callback(result, error);

        });
        
    } else {
        
        var error_response = {
            http_status: 404,
            error_body: "No UDPRN parameter supplied"
        };
        
        return callback(false, error_response);
    }
    
};

AlliesPostcodeLookup.prototype.getSingleAddressGeo = function (udprn, country, callback) {
  
    var udprn = udprn || false;
    var country = country || "UK";
    
    if (trim_check(udprn) !== false) {
  
        var request_url = this.config.url_base + this.config.api_key + "/addressgeo/" + country + "/udprn?udprn=" + encodeURIComponent(udprn) + "&" + qs.stringify(this.config.options);

        send_request(request_url, function(result, error) {

            return callback(result, error);

        });
        
    } else {
        
        var error_response = {
            http_status: 404,
            error_body: "No UDPRN parameter supplied"
        };
        
        return callback(false, error_response);
    }
    
};

/*

UK only street level searches, do not include premise level details (organisation names, building names or numbers)

*/

AlliesPostcodeLookup.prototype.searchStreet = function (search, callback) {
  
    var request_url = this.config.url_base + this.config.api_key + "/street/UK/" + encodeURIComponent(search) + "?" + qs.stringify(this.config.options);
    
    send_request(request_url, function(result, error) {

        return callback(result, error);
        
    });
    
};

AlliesPostcodeLookup.prototype.searchStreetGeo = function (search, callback) {
  
    var request_url = this.config.url_base + this.config.api_key + "/geo/UK/" + encodeURIComponent(search) + "?" + qs.stringify(this.config.options);
    
    send_request(request_url, function(result, error) {

        return callback(result, error);
        
    });
    
};

/* 

Internal helper functions

*/

function send_request(request_url, callback) {
    
    // Could probably get rid of dependency on the 'request' library to be honest
    
    request(request_url, function (error, response, body) {

        if (!error && response.statusCode == 200) {

            // Convert response into a JSON object
            var status_response = JSON.parse(body);
            
            return callback(status_response, false);
            
        } else {
            if (error) {
            
                return callback(false, error);
                
            } else {
                
                var error_response = {
                    http_status: response.statusCode,
                    error_body: body
                };
            
                return callback(false, error_response);
            }

        }

    });
    
}

function trim_check(text) {
    
    if(text === false) {
        return false;
    } else if (text.trim() == "") {
        return false;
    } else {
        return true
    }
    
}

module.exports = new AlliesPostcodeLookup();