const request = require('request');
const qs = require('qs');

/*
Internal helper functions
*/

function sendRequest(requestUrl, callback) {
  // Could probably get rid of dependency on the 'request' library to be honest

  request(requestUrl, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      // Convert response into a JSON object
      const statusResponse = JSON.parse(body);

      return callback(statusResponse, false);
    }
    if (error) {
      return callback(false, error);
    }
    const errorResponse = {
      http_status: response.statusCode,
      error_body: body,
    };

    return callback(false, errorResponse);
  });
}

function trimCheck(text) {
  if (text === false) {
    return false;
  }
  if (text.trim() === '') {
    return false;
  }
  return true;
}

/*
Create instance and basic default options
*/

function AlliesPostcodeLookup() {
  if (!(this instanceof AlliesPostcodeLookup)) {
    return new AlliesPostcodeLookup();
  }

  const config = {
    urlBase: 'https://ws.postcoder.com/pcw/',
    pageNum: 0,
    options: {
      lines: 3,
    },
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

AlliesPostcodeLookup.prototype.init = (apiKey, options, debug) => {
  if (typeof apiKey === 'string') {
    this.config.apiKey = apiKey;
  } else {
    this.config.apiKey = 'PCW45-12345-12345-1234X';
  }

  const newOptions = options || false;

  if (newOptions) {
    this.setOptions(newOptions);
  }

  this.config.debug = debug || false;

  if (this.config.debug === true) {
    this.checkStatus((response, error) => {
      if (error) {
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

AlliesPostcodeLookup.prototype.setOptions = (object) => {
  this.config.options = object;
};

/*
Overwrite the pageNum
*/

AlliesPostcodeLookup.prototype.setPageNum = (pageNum) => {
  if (typeof pageNum === 'number') {
    this.config.pageNum = parseInt(pageNum, 10);
  }
};

/*
Status endpoint give information about number of credits available amongst others
*/

AlliesPostcodeLookup.prototype.checkStatus = (callback) => {
  const requestUrl = `${this.config.urlBase}${this.config.apiKey}/status`;
  sendRequest(requestUrl, (result, error) => callback(result, error));
};

/*
Get list of countries including two letter ISO codes
*/

AlliesPostcodeLookup.prototype.getCountries = (callback) => {
  const requestUrl = `${this.config.urlBase}${this.config.apiKey}/country/?${qs.stringify(this.config.options)}`;
  sendRequest(requestUrl, (result, error) => callback(result, error));
};

/*
International address searches
*/

AlliesPostcodeLookup.prototype.searchAddress = (search, country, callback) => {
  const theCountry = country || 'UK';

  let pageNumStr = '';
  if (this.config.pageNum > 0) {
    pageNumStr = `&page=${String(this.config.pageNum)}`;
  }

  const requestUrl = `${this.config.urlBase}${this.config.apiKey}/address/${theCountry}/${encodeURIComponent(search)}?${qs.stringify(this.config.options)}${pageNumStr}`;
  sendRequest(requestUrl, (result, error) => callback(result, error));
};

AlliesPostcodeLookup.prototype.searchAddressGeo = (search, country, callback) => {
  const theCountry = country || 'UK';

  let pageNumStr = '';
  if (this.config.pageNum > 0) {
    pageNumStr = `&page=${String(this.config.pageNum)}`;
  }

  const requestUrl = `${this.config.urlBase}${this.config.apiKey}/addressgeo/${theCountry}/${encodeURIComponent(search)}?${qs.stringify(this.config.options)}${pageNumStr}`;
  sendRequest(requestUrl, (result, error) => callback(result, error));
};

AlliesPostcodeLookup.prototype.getSingleAddress = (udprn, country, callback) => {
  const theUdprn = udprn || false;
  const theCountry = country || 'UK';

  if (trimCheck(theUdprn) !== false) {
    const requestUrl = `${this.config.urlBase}${this.config.apiKey}/address/${theCountry}/udprn?udprn=${encodeURIComponent(theUdprn)}&${qs.stringify(this.config.options)}`;
    sendRequest(requestUrl, (result, error) => callback(result, error));
    return true;
  }
  const errorResponse = {
    http_status: 404,
    error_body: 'No UDPRN parameter supplied',
  };

  return callback(false, errorResponse);
};

AlliesPostcodeLookup.prototype.getSingleAddressGeo = (udprn, country, callback) => {
  const theUdprn = udprn || false;
  const theCountry = country || 'UK';

  if (trimCheck(theUdprn) !== false) {
    const requestUrl = `${this.config.urlBase}${this.config.apiKey}/addressgeo/${theCountry}/udprn?udprn=${encodeURIComponent(theUdprn)}&${qs.stringify(this.config.options)}`;
    sendRequest(requestUrl, (result, error) => callback(result, error));
    return true;
  }
  const errorResponse = {
    http_status: 404,
    error_body: 'No UDPRN parameter supplied',
  };

  return callback(false, errorResponse);
};

/*
UK only street level searches, do not include premise level details
(organisation names, building names or numbers)
*/

AlliesPostcodeLookup.prototype.searchStreet = (search, callback) => {
  const requestUrl = `${this.config.urlBase}${this.config.apiKey}/street/UK/${encodeURIComponent(search)}?${qs.stringify(this.config.options)}`;
  sendRequest(requestUrl, (result, error) => callback(result, error));
};

AlliesPostcodeLookup.prototype.searchStreetGeo = (search, callback) => {
  const requestUrl = `${this.config.urlBase}${this.config.apiKey}/geo/UK/${encodeURIComponent(search)}?${qs.stringify(this.config.options)}`;
  sendRequest(requestUrl, (result, error) => callback(result, error));
};

module.exports = new AlliesPostcodeLookup();
