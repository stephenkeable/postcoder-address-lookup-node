# Postcoder address lookup

Simple node wrapper for address lookup and postcode lookup endpoints of the
Postcoder API from Allies.

[Find out more about the address lookup API](https://postcoder.com/address-lookup)
and [sign up for a trial to get an API key](https://postcoder.com/sign-up)

The API allows searching for addresses around the world, using either a
postal code or fragment of an address, along with the country you want to search.
**Note: This is a paid for API**

[For full developer documentation](https://postcoder.com/docs/address-lookup)

## v1 to v2

Move to ES6 syntax within module.
ally the same however the getCountries() method has been removed.

## Install

`npm install postcoder-address-lookup`

[Package on npm](https://www.npmjs.com/package/postcoder-address-lookup)

### Basic usage

```javascript
const addressLookup = require('postcoder-address-lookup');

addressLookup.init('[YOUR API KEY HERE]');

addressLookup.searchAddress('NR14 7PZ', 'GB', (result, error) => {

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
var addressLookup = require('postcoder-address-lookup');

addressLookup.init('[YOUR API KEY HERE]');

addressLookup.searchAddressGeo('NR14 7PZ', 'GB', (result, error) => {

    if (error) {
        console.log(error);
    } else {
        // returns an array of addresses, including latitude and longitude
        console.log(result);
    }

});
```

### Passing additional options

Extra parameters can be passed using an options object, which is
converted into the querystring of the API request.

A full list of these parameters can be found in the
[developer documentation](https://postcoder.com/docs/address-lookup#additional-data)

```javascript
var addressLookup = require('postcoder-address-lookup');

var options = {
    lines: 2,
    addtags: 'udprn',
};

addressLookup.init('[YOUR API KEY HERE]', options);

addressLookup.searchAddress('NR14 7PZ', 'GB', (result, error) => {

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
var addressLookup = require('postcoder-address-lookup');

addressLookup.init('[YOUR API KEY HERE]');

var options = {
    lines: 2,
    addtags: 'udprn',
};

addressLookup.setOptions(options);

```

### UK Street level searching

For the UK you can also search for street level data (No organisation names,
  building names or numbers)

```javascript
var addressLookup = require('postcoder-address-lookup');

addressLookup.init('[YOUR API KEY HERE]');

addressLookup.searchStreet('NR14 7PZ', (result, error) => {

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

[Full list of fields returned](https://postcoder.com/docs/status)

```javascript
var addressLookup = require('postcoder-address-lookup');

addressLookup.init('[YOUR API KEY HERE]');

addressLookup.checkStatus((result, error) => {

    if (error) {
        console.log(error);
    } else {
        // returns an object with information about number of credits
        // on your account and more
        console.log(result);
    }

});
```

### Note about support

This is a community supported package, maintained by [Stephen Keable](https://github.com/stephenkeable)
