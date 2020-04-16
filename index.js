const request = require("request");
const qs = require("qs");

/*
Create instance and basic default options
*/
class AlliesPostcodeLookup {
	constructor() {
		this.config = {
			urlBase: "https://ws.postcoder.com/pcw/",
			pageNum: 0,
			options: {
				lines: 3,
			},
		};
	}

	/*
  Init function

  Sets up API key (required, will default to Test key if not supplied)

  Optional
  Options object which is turned into query string parameters
  Debug use true to check search key against status service and console.log the result
  */
	init(apiKey, options, debug) {
		if (typeof apiKey === "string") {
			this.config.apiKey = apiKey;
		} else {
			this.config.apiKey = "PCW45-12345-12345-1234X";
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
	}

	/*
  Internal helper functions
  */
	static sendRequest(requestUrl, callback) {
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

	static trimCheck(text) {
		if (text === false) {
			return false;
		}
		if (text.trim() === "") {
			return false;
		}
		return true;
	}

	/*
  Overwrite the options object after init
  */
	setOptions(object) {
		this.config.options = object;
	}

	/*
  Overwrite the pageNum
  */
	setPageNum(pageNum) {
		if (typeof pageNum === "number") {
			this.config.pageNum = parseInt(pageNum, 10);
		}
	}

	/*
  Status endpoint give information about number of credits available amongst others
  */
	checkStatus(callback) {
		const requestUrl = `${this.config.urlBase}${this.config.apiKey}/status`;
		AlliesPostcodeLookup.sendRequest(requestUrl, (result, error) =>
			callback(result, error)
		);
	}

	/*
  International address searches
  */
	searchAddress(search, country, callback) {
		const theCountry = country || "UK";

		let pageNumStr = "";
		if (this.config.pageNum > 0) {
			pageNumStr = `&page=${String(this.config.pageNum)}`;
		}

		const requestUrl = `${this.config.urlBase}${
			this.config.apiKey
		}/address/${theCountry}/${encodeURIComponent(search)}?${qs.stringify(
			this.config.options
		)}${pageNumStr}`;
		AlliesPostcodeLookup.sendRequest(requestUrl, (result, error) =>
			callback(result, error)
		);
	}

	searchAddressGeo(search, country, callback) {
		const theCountry = country || "UK";

		let pageNumStr = "";
		if (this.config.pageNum > 0) {
			pageNumStr = `&page=${String(this.config.pageNum)}`;
		}

		const requestUrl = `${this.config.urlBase}${
			this.config.apiKey
		}/addressgeo/${theCountry}/${encodeURIComponent(search)}?${qs.stringify(
			this.config.options
		)}${pageNumStr}`;
		AlliesPostcodeLookup.sendRequest(requestUrl, (result, error) =>
			callback(result, error)
		);
	}

	getSingleAddress(udprn, country, callback) {
		const theUdprn = udprn || false;
		const theCountry = country || "UK";

		if (AlliesPostcodeLookup.trimCheck(theUdprn) !== false) {
			const requestUrl = `${this.config.urlBase}${
				this.config.apiKey
			}/address/${theCountry}/udprn?udprn=${encodeURIComponent(
				theUdprn
			)}&${qs.stringify(this.config.options)}`;
			AlliesPostcodeLookup.sendRequest(requestUrl, (result, error) =>
				callback(result, error)
			);
			return true;
		}
		const errorResponse = {
			http_status: 404,
			error_body: "No UDPRN parameter supplied",
		};

		return callback(false, errorResponse);
	}

	getSingleAddressGeo(udprn, country, callback) {
		const theUdprn = udprn || false;
		const theCountry = country || "UK";

		if (AlliesPostcodeLookup.trimCheck(theUdprn) !== false) {
			const requestUrl = `${this.config.urlBase}${
				this.config.apiKey
			}/addressgeo/${theCountry}/udprn?udprn=${encodeURIComponent(
				theUdprn
			)}&${qs.stringify(this.config.options)}`;
			AlliesPostcodeLookup.sendRequest(requestUrl, (result, error) =>
				callback(result, error)
			);
			return true;
		}
		const errorResponse = {
			http_status: 404,
			error_body: "No UDPRN parameter supplied",
		};

		return callback(false, errorResponse);
	}

	/*
  UK only street level searches, do not include premise level details
  (organisation names, building names or numbers)
  */

	searchStreet(search, callback) {
		const requestUrl = `${this.config.urlBase}${
			this.config.apiKey
		}/street/UK/${encodeURIComponent(search)}?${qs.stringify(
			this.config.options
		)}`;
		AlliesPostcodeLookup.sendRequest(requestUrl, (result, error) =>
			callback(result, error)
		);
	}

	searchStreetGeo(search, callback) {
		const requestUrl = `${this.config.urlBase}${
			this.config.apiKey
		}/geo/UK/${encodeURIComponent(search)}?${qs.stringify(
			this.config.options
		)}`;
		AlliesPostcodeLookup.sendRequest(requestUrl, (result, error) =>
			callback(result, error)
		);
	}
}

module.exports = new AlliesPostcodeLookup();
