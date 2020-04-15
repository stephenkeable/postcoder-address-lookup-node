"use strict";

var assert = require('assert');

describe('AlliesPostcodeLookup', function() {

    describe('.init()',function() {

        it("Should default to the test key, when no key passed", function() {

            var address_lookup = require("../");
            address_lookup.init();

            assert.equal("PCW45-12345-12345-1234X", address_lookup.config.apiKey);

        });

        it("Should default to the test key, when non string passed", function() {

            var address_lookup = require("../");
            address_lookup.init(3);

            assert.equal(address_lookup.config.apiKey, "PCW45-12345-12345-1234X");

        });

        it("Should use the key passed when is string", function() {

            var address_lookup = require("../");
            address_lookup.init("ABC45-56789-12345-1234X");

            assert.equal(address_lookup.config.apiKey, "ABC45-56789-12345-1234X");

        });

        it("Should use the default this.config.options object", function() {

            var address_lookup = require("../");

            address_lookup.init("ABC45-56789-12345-1234X");

            assert.equal(address_lookup.config.options.lines, 3);

        });

        it("Should overwrite this.config.options object when one supplied", function() {

            var address_lookup = require("../");

            var options = {
                lines: 4,
                addtags: "udprn"
            }

            address_lookup.init("ABC45-56789-12345-1234X", options);

            assert.equal(address_lookup.config.options.lines, 4);
            assert.equal(address_lookup.config.options.addtags, "udprn");

        });

        it("Should console.log info about apiKey being used when passing true in third parameter");

    });

    describe('.setOptions()',function() {

        it("Should overwrite this.config.options object when one supplied", function() {

            var address_lookup = require("../");

            var options = {
                lines: 4,
                addtags: "udprn"
            }

            address_lookup.init();

            address_lookup.setOptions(options);

            assert.equal(address_lookup.config.options.lines, 4);
            assert.equal(address_lookup.config.options.addtags, "udprn");

        });

    });

    describe('.setPageNum()',function() {

        it("Should NOT overwrite this.config.pageNum value when non number supplied", function() {

            var address_lookup = require("../");

            address_lookup.init();

            address_lookup.setPageNum("garbage");

            assert.equal(address_lookup.config.pageNum, 0);

        });

        it("Should overwrite this.config.pageNum value when integer supplied", function() {

            var address_lookup = require("../");

            address_lookup.init();

            address_lookup.setPageNum(1);

            assert.equal(address_lookup.config.pageNum, 1);

        });

        it("Should overwrite this.config.pageNum value when non integer number supplied (converts using parseint)", function() {

            var address_lookup = require("../");

            address_lookup.init();

            address_lookup.setPageNum(1.3);

            assert.equal(address_lookup.config.pageNum, 1);

        });

        it("Should overwrite this.config.pageNum value when 0 supplied", function() {

            var address_lookup = require("../");

            address_lookup.init();

            address_lookup.setPageNum(0);

            assert.equal(address_lookup.config.pageNum, 0);

        });

    });

    describe('.checkStatus()',function() {

        it("Should return result object and false for error.", function(done) {

            var address_lookup = require("../");

            address_lookup.init();

            address_lookup.checkStatus( function(result, error) {

                assert.equal(typeof result, "object");
                assert.equal(error, false);

                done();

            });

        });

        it("Should fail when can't reach API, needs way of simulating broken connection");

        it("Should inform you when using test key", function(done) {

            var address_lookup = require("../");

            address_lookup.init();

            address_lookup.checkStatus( function(result, error) {

                assert.equal(result.state, "Test Key");
                assert.equal(result.correctsearchkey, true);

                done();

            });

        });

        it("Should inform you when using incorrect key", function(done) {

            var address_lookup = require("../");

            address_lookup.init("rsetghtdejgkfk");

            address_lookup.checkStatus( function(result, error) {

                assert.equal(result.state, "Incorrect Search Key");
                assert.equal(result.correctsearchkey, false);

                done();

            });

        });

    });

    describe('.getCountries()',function() {

        it("Should return result object and false for error.", function(done) {

            var address_lookup = require("../");

            address_lookup.init();

            address_lookup.getCountries( function(result, error) {

                assert.equal(typeof result, "object");
                assert.equal(error, false);

                done();

            });

        });

        it("Should return Afghanistan first and Zimbabwe last", function(done) {

            var address_lookup = require("../");

            address_lookup.init();

            address_lookup.getCountries( function(result, error) {

                var first_country = result[0];
                var last_country = result[result.length - 1];

                assert.equal(first_country.iso2, "AF");
                assert.equal(last_country.iso2, "ZW");

                done();

            });

        });

    });

    describe('.searchAddress()',function() {

        it("Should return result array with more than one record", function(done) {

            var address_lookup = require("../");

            address_lookup.init();

            address_lookup.searchAddress("NR14 7PZ", "UK", function(result, error) {

                assert.equal(Array.isArray(result), true);
                assert.equal(result.length > 1, true);

                done();

            });

        });

        it("Should default to UK with blank country parameter");

        it("Should return empty array with blank search parameter", function(done) {

            var address_lookup = require("../");

            address_lookup.init();

            address_lookup.searchAddress("", "UK", function(result, error) {

                assert.equal(Array.isArray(result), true);
                assert.equal(result.length, 0);

                done();

            });

        });

        it("Should return error.http_code=404 for unknown country code", function(done) {

            var address_lookup = require("../");

            address_lookup.init();

            address_lookup.searchAddress("NR14 7PZ", "fsdsdf", function(result, error) {

                assert.equal(error.http_status, 404);

                done();

            });

        });

    });

    describe('.searchAddressGeo()',function() {

        it("Should return result array with more than one record", function(done) {

            var address_lookup = require("../");

            address_lookup.init();

            address_lookup.searchAddressGeo("NR14 7PZ", "UK", function(result, error) {

                assert.equal(Array.isArray(result), true);
                assert.equal(result.length > 1, true);

                done();

            });

        });

        it("Should default to UK with blank country parameter");

        it("Should return empty array with blank search parameter", function(done) {

            var address_lookup = require("../");

            address_lookup.init();

            address_lookup.searchAddressGeo("", "UK", function(result, error) {

                assert.equal(Array.isArray(result), true);
                assert.equal(result.length, 0);

                done();

            });

        });

        it("Should return error.http_code=404 for unknown country code", function(done) {

            var address_lookup = require("../");

            address_lookup.init();

            address_lookup.searchAddressGeo("NR14 7PZ", "fsdsdf", function(result, error) {

                assert.equal(error.http_status, 404);

                done();

            });

        });

        it("Should include latitude and longitude fields in first record", function(done) {

            var address_lookup = require("../");

            address_lookup.init();

            address_lookup.searchAddressGeo("NR14 7PZ", "UK", function(result, error) {

                assert.equal(Array.isArray(result), true);
                assert.equal(result.length > 1, true);
                assert.equal(result[0].latitude != 'undefined', true);
                assert.equal(result[0].longitude != 'undefined', true);

                done();

            });

        });

    });

    describe('.getSingleAddress()',function() {

        it("Should return result array with one record", function(done) {

            var address_lookup = require("../");

            address_lookup.init();

            address_lookup.getSingleAddress("17448021", "UK", function(result, error) {

                assert.equal(Array.isArray(result), true);
                assert.equal(result.length == 1, true);

                done();

            });

        });

        it("Should default to UK with blank country parameter");

        it("Should return error when blank updrn parameter supplied", function(done) {

            var address_lookup = require("../");

            address_lookup.init();

            address_lookup.getSingleAddress("", "UK", function(result, error) {

                assert.equal(typeof error, "object");
                assert.equal(result, false);

                done();

            });

        });

        it("Should return error.http_code=404 for unknown country code", function(done) {

            var address_lookup = require("../");

            address_lookup.init();

            address_lookup.getSingleAddress("17448021", "fsdsdf", function(result, error) {

                assert.equal(error.http_status, 404);

                done();

            });

        });

    });

    describe('.getSingleAddressGeo()',function() {

        it("Should return result array with one record", function(done) {

            var address_lookup = require("../");

            address_lookup.init();

            address_lookup.getSingleAddressGeo("17448021", "UK", function(result, error) {

                assert.equal(Array.isArray(result), true);
                assert.equal(result.length == 1, true);

                done();

            });

        });

        it("Should default to UK with blank country parameter");

        it("Should return error when blank updrn parameter supplied", function(done) {

            var address_lookup = require("../");

            address_lookup.init();

            address_lookup.getSingleAddressGeo("", "UK", function(result, error) {

                assert.equal(typeof error, "object");
                assert.equal(result, false);

                done();

            });

        });

        it("Should return error.http_code=404 for unknown country code", function(done) {

            var address_lookup = require("../");

            address_lookup.init();

            address_lookup.getSingleAddressGeo("17448021", "fsdsdf", function(result, error) {

                assert.equal(error.http_status, 404);

                done();

            });

        });

        it("Should include latitude and longitude fields in first record", function(done) {

            var address_lookup = require("../");

            address_lookup.init();

            address_lookup.getSingleAddressGeo("17448021", "UK", function(result, error) {

                assert.equal(Array.isArray(result), true);
                assert.equal(result.length == 1, true);
                assert.equal(result[0].latitude != 'undefined', true);
                assert.equal(result[0].longitude != 'undefined', true);

                done();

            });

        });

    });

    describe('.searchStreet()',function() {

        it("Should return result array with one record for NR14 7PZ", function(done) {

            var address_lookup = require("../");

            address_lookup.init();

            address_lookup.searchStreet("NR14 7PZ", function(result, error) {

                assert.equal(Array.isArray(result), true);
                assert.equal(result.length == 1, true);

                done();

            });

        });

        it("Should return empty array with blank search parameter", function(done) {

            var address_lookup = require("../");

            address_lookup.init();

            address_lookup.searchStreet("", function(result, error) {

                assert.equal(Array.isArray(result), true);
                assert.equal(result.length, 0);

                done();

            });

        });

    });

    describe('.searchStreetGeo()',function() {

        it("Should return result array with one record for NR14 7PZ", function(done) {

            var address_lookup = require("../");

            address_lookup.init();

            address_lookup.searchStreetGeo("NR14 7PZ", function(result, error) {

                assert.equal(Array.isArray(result), true);
                assert.equal(result.length == 1, true);

                done();

            });

        });

        it("Should return empty array with blank search parameter", function(done) {

            var address_lookup = require("../");

            address_lookup.init();

            address_lookup.searchStreetGeo("", function(result, error) {

                assert.equal(Array.isArray(result), true);
                assert.equal(result.length, 0);

                done();

            });

        });

        it("Should include latitude and longitude fields in first record", function(done) {

            var address_lookup = require("../");

            address_lookup.init();

            address_lookup.searchStreetGeo("NR14 7PZ", function(result, error) {

                assert.equal(Array.isArray(result), true);
                assert.equal(result.length == 1, true);
                assert.equal(result[0].latitude != 'undefined', true);
                assert.equal(result[0].longitude != 'undefined', true);

                done();

            });

        });

    });

});
