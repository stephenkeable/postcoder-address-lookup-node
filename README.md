# Postcoder address lookup

Simple node wrapper for address lookup and postcode lookup endpoints of the PostCoder Web API from Allies.

[Find out more about the address lookup API](https://www.alliescomputing.com/postcoder/address-lookup) and [sign up for a trial to get an API key](https://www.alliescomputing.com/postcoder/sign-up)

**Note: This is a paid for API**

The API allows searching for addresses around the world, using either a postal code or fragment of an address, along with the country you want to search.

[For full developer documentation](https://developers.alliescomputing.com)

## Install

`npm install postcoder-address-lookup`

https://www.npmjs.com/package/postcoder-address-lookup

### Basic usage

```javascript
var address_lookup = require("postcoder-address-lookup");

address_lookup.init("[YOUR API KEY HERE]");

address_lookup.searchAddress("NR14 7PZ", "GB", function(result, error) {

    if (error) {
        console.log(error);
    } else {
        // returns an array of addresses
        console.log(result);
    }

});
```

### Returning latitude and longitude with addresses

```javascript
var address_lookup = require("postcoder-address-lookup");

address_lookup.init("[YOUR API KEY HERE]");

address_lookup.searchAddressGeo("NR14 7PZ", "GB", function(result, error) {

    if (error) {
        console.log(error);
    } else {
        // returns an array of addresses, including latitude and longitude
        console.log(result);
    }

});
```

### Passing additional options

Extra parameters can be passed using an options object, which is converted into the querystring of the API request.

A full list of these parameters can be found in the [developer documentation](https://developers.alliescomputing.com/postcoder-web-api/address-lookup/premise)

```javascript
var address_lookup = require("postcoder-address-lookup");

var options = {
    lines: 2,
    addtags: "udprn"
};

address_lookup.init("[YOUR API KEY HERE]", options);

address_lookup.searchAddress("NR14 7PZ", "GB", function(result, error) {

    if (error) {
        console.log(error);
    } else {
        // returns an array of addresses
        console.log(result);
    }

});
```

Options can also be passed after the init using `setOptions()`

```javascript
var address_lookup = require("postcoder-address-lookup");

address_lookup.init("[YOUR API KEY HERE]");

var options = {
    lines: 2,
    addtags: "udprn"
};

address_lookup.setOptions(options);

```

### UK Street level searching

For the UK you can also search for street level data (No organisation names, building names or numbers)

```javascript
var address_lookup = require("postcoder-address-lookup");

address_lookup.init("[YOUR API KEY HERE]");

address_lookup.searchStreet("NR14 7PZ", function(result, error) {

    if (error) {
        console.log(error);
    } else {
        // returns an array of street level information
        console.log(result);
    }

});
```

### Check status of your API key

Returns an object with information about number of credits on your account and more

[Full list of fields returned](https://developers.alliescomputing.com/postcoder-web-api/error-handling)

```javascript
var address_lookup = require("postcoder-address-lookup");

address_lookup.init("[YOUR API KEY HERE]");

address_lookup.checkStatus(function(result, error) {

    if (error) {
        console.log(error);
    } else {
        // returns an object with information about number of credits on your account and more
        console.log(result);
    }

});
```

### Note about support

This is a community supported package, maintained by [Stephen Keable](https://github.com/stephenkeable)
