(function(gscope){


	/**
	* Convert a JSON string to object
	*/
	function jsonToObj(json)
	{
		// Make the conversion
		if (typeof(JSON) !== 'undefined') {
			return JSON.parse(json);
		}// end if

		// Don't worry, even the creator of JSON says eval is ok here
		return eval('(' + json + ')');

	}// end jsonToObj


	/**
	* Get all the properties of an object as an array
	*
	* @param object    obj     The object to get the parameters for
	*/
	function getProperties(obj)
	{
		var properties = [];
		for (var propName in obj){
			if (obj.hasOwnProperty(propName)){
				properties.push(propName);
			}// end if
		}// end for

		return properties;

	}// end getProperties


	/**
	* Convert a variable to a boolean
	*/
	function convertToBoolean(variable)
	{
		var ret = false;
		if (variable !== null && typeof(variable) !== "undefined") {
			switch (typeof(variable)) {
				case 'number':
					ret = (variable === 1) ? true : false;
					break;

				case 'boolean':
					ret = variable;
					break;

				case 'string':
					var testVar = variable.toLowerCase();
					if (testVar === 'true' || testVar === '1') {
						ret = true;
					} else if (testVar === 'false' || testVar === '0') {
						ret = false;
					}// end if
					break;
			}// end switch

		}// end if

		return ret;

	}// end convertToBoolean


	/**
	* The API constructor
	*/
	gscope.Squiz_Matrix_API = function(options)
	{
		var self = this;

		if (!options.hasOwnProperty('key') || options.key === '') {
			throw 'An API key is required';
		}// end if

		self.key = options.key;

		self.nonceToken = '';

	};// end construct


	function JSAPIError(request) {
		this.name    = 'JSAPIError';
		this.message = 'JS API Error';
		this.request = request;
	}

	JSAPIError.prototype = Object.create(Error.prototype);
	JSAPIError.prototype.constructor = JSAPIError;


	/**
	* API methods
	*/
	gscope.Squiz_Matrix_API.prototype = {
		syncing_enabled : 0,

		_http: function(options, promiseFns)
		{
			var self = this;

			// Create the HTTPRequest object
			function createRequest()
			{
				var request;
				try {
					request = new XMLHttpRequest();
				} catch (trymicrosoft) {
					try {
						request = new ActiveXObject("Msxml2.XMLHTTP");
					} catch (othermicrosoft) {
						try {
							request = new ActiveXObject("Microsoft.XMLHTTP");
						} catch(nosupport) {
							request = false;
						}// end try
					}// end try
				}// end try

				if (!request) {
					throw 'Your browser does not support Ajax';
				}// end if

				return request;

			}// end createRequest


			// Process parameters into a data array
			function data(params)
			{
				// Automatically append 'key' to every request
				var dataArr = {};

				for (var i = 0, l = params.length; i < l; i+=1) {
					if(params[i]) {
						dataArr[params[i][0]] = params[i][1];
					}
				}// end for
				return JSON.stringify(dataArr);

			}// end data

			// Set some defaults for the HTTP Request
			options = self._options(['params'],{
						url:                'https://camptriangle.co.uk/_ws/set-metadata.js',
						method:             'POST',
						contentType:        'application/json',
						params:             [],
						async:              true,
						onSuccess:          function(){},
						onError:            function(){
													throw 'HTTPRequest call failed';
											}
			},options);

			var http = createRequest();
			http.open(options.method,encodeURI(options.url),options.async);
			http.onreadystatechange = function() {
				var apiError = new JSAPIError(http);
				if (http.readyState === 4) {
					if (http.status === 200) {
						if (typeof(http.responseText) !== 'undefined' || http.responseText !== '' || http.responseText !== null) {
							try {
								var response = jsonToObj(http.responseText);
							} catch (ex) {
								if (promiseFns) {
									promiseFns.reject(ex);
								}
								options.onError.call(this,http);
							}

							if (promiseFns) {
								promiseFns.resolve(response);
							}
							options.onSuccess.call(this,response);
						} else {
							if (promiseFns) {
								promiseFns.reject(apiError);
							}
							options.onError.call(this,http);
						}// end if
					} else {
						if (promiseFns) {
							promiseFns.reject(apiError);
						}
						options.onError.call(this,http);
					}// end if
				}// end if
			};// end onreadstatechange

			http.setRequestHeader("Content-type", options.contentType);
			http.setRequestHeader("X-SquizMatrix-JSAPI-Key", self.key);

			// Send the request
			http.send(data(options.params));

		},// end _ajax


		/**
		* Validates options and returns merged data
		*/
		_options: function(required,defaults,options,discard)
		{
		    if (arguments.length < 4) {
		        discard = true;
		    }

			// Required data
			for (var i = 0, l = required.length; i<l; i+=1) {
				if (!options.hasOwnProperty(required[i])) {
					throw 'Required argument "' + required[i] + '" missing';
				}// end if
			}// end for

			// Merge options and defaults
			for (var def in options) {
			    if (defaults.hasOwnProperty(def)){
					defaults[def] = (options.hasOwnProperty(def)) ? options[def] : defaults[def];
				} else if ((discard === false) && (options.hasOwnProperty(def))) {
				    defaults[def] = options[def];
				}//end if
			}// end for

			if (defaults.hasOwnProperty('dataCallback') && typeof(defaults.dataCallback) !== "function") {
				throw 'Data callback must be a function';
			}// end if

			if (defaults.hasOwnProperty('errorCallback') && ((defaults.errorCallback !== null) && (typeof(defaults.errorCallback) !== "function"))) {
				throw 'Error callback must be a function';
			}// end if

			return defaults;

		},// end _options

			
		/**
		* batches multiple JS API calls and executs them in one HTTP Request
		*
		*
		* @param object		options       JSON string of options
		* {
		*      functions:		json		json of all the function and its respective arguments to be passed in
		*      dataCallback:	function	Custom callback function
		* }
		*/
		batchRequest: function(options)
		{
			var fnName = 'batchRequest';
			if (arguments.length === 0) {
				return {
					// Set the default values
					defaults: {
						functions:          null,
						dataCallback:       function(){},
						errorCallback: null
					},

					// Set the required arguments
					required: ['functions']
				};
			}// end if

			// Extract some configuration and use it to build
			// parameters for the post call
			var fnConfig = this[fnName].call(this);
			options = this._options(fnConfig.required,fnConfig.defaults,options);

			// Package up the required function calls into string to POST
			//var postData = JSON.stringify(options.functions);

			return this._doPost(fnName,[
				['functions', options.functions]
			],options);

		},// end batchRequest

			
		/**
		* Get the value of a metadata field
		*
		* @param object		options       JSON string of options
		* {
		*      asset_id:		string/int	Id of the asset we are setting metadata for
		*      field_id:		string/int	The asset id of the metadata field
		*      field_val:		string		The value to set for the metadata field
		*									(Using <i>null</i> will set it to default)
		*      dataCallback:	function	Custom callback function
		* }
		*/
		setMetadata: function(options)
		{
			var fnName = 'setMetadata';
			if (arguments.length === 0) {
				return {
					// Set the default values
					defaults: {
						asset_id:           null,
						field_id:           '',
						field_val:          '',
						dataCallback:       function(){},
						errorCallback: null
					},

					// Set the required arguments
					required: ['asset_id','field_id','field_val']
				};
			}// end if

			// Extract some configuration and use it to build
			// parameters for the post call
			var fnConfig = this[fnName].call(this);
			options = this._options(fnConfig.required,fnConfig.defaults,options);

			return this._doPost(fnName,[
				['id',options.asset_id],
				['field_id',options.field_id],
				['field_val',options.field_val]
			],options);

		},// end setMetadata


		/**
		* Set the values of multiple metadata fields
		*
		* @param object		options       JSON string of options
		* {
		*      asset_id:		string/int	Id of the asset we are setting attributes for
		*      field_info:		json		Metadata field id and their respective values to be changed to
		*									(Using <i>null</i> for value will set it to default)
		*      dataCallback:	function	Custom callback function
		* }
		*/
		setMetadataAllFields: function(options)
		{
			var fnName = 'setMetadataAllFields';
			if (arguments.length === 0) {
				return {
					// Set the default values
					defaults: {
						asset_id:           null,
						field_info:         null,
						dataCallback:       function(){},
						errorCallback: null
					},

					// Set the required arguments
					required: ['asset_id','field_info']
				};
			}// end if

			// Extract some configuration and use it to build
			// parameters for the post call
			var fnConfig = this[fnName].call(this);
			options = this._options(fnConfig.required,fnConfig.defaults,options);

			var field_ids = [];
			var field_vals  = [];
			for (var field_id in options.field_info) {
				if (options.field_info.hasOwnProperty(field_id)){
					field_ids.push(field_id);
					// because JS join() will convert the null string to empty string
					// further down below we will need to provide a hack around this
					// to let the PHP side know about the value being passed as null here
					if (options.field_info[field_id] === null) {
						options.field_info[field_id] = '__NULL_VALUE__';
					}
					field_vals.push(options.field_info[field_id]);
				}// end if
			}// end of

			return this._doPost(fnName,[
				['field_id',field_ids.join('\\,')],
				['field_val',field_vals.join('\\,')],
				['id',options.asset_id]
			],options);

		},// end setMetadataAllFields

			
		/**
		* Updates a link with provided information
		*
		* @param object		options       JSON string of options
		* {
		*      parent_id:			string/int	Id of parent
		*      child_id:			string/int	Id of child
		*      existing_link_type:	string		type of link we are looking for (SQ_LINK_TYPE_1 link by default)
		*										Valid Values - SQ_LINK_TYPE_1, SQ_LINK_TYPE_2, SQ_LINK_TYPE_3, SQ_LINK_NOTICE
		*      existing_link_value:	string		existing link value betweent the assets ('' by default)
		*      link_type:   	    string		link type to be updated to (SQ_LINK_TYPE_1 link by default)
		*										Valid Values - SQ_LINK_TYPE_1, SQ_LINK_TYPE_2, SQ_LINK_TYPE_3, SQ_LINK_NOTICE
		*      link_value:			string		Value of link to be updated to ('' by default)
		*      sort_order:			int			The new position
		*      locked:				boolean		the asset link lock status(locked by default)
		*      dataCallback:		function	Custom callback function
		* }
		*/
		updateLink: function(options)
		{
			var fnName = 'updateLink';
			if (arguments.length === 0) {
				return {
					// Set the default values
					defaults: {
						parent_id:          null,
						child_id:           null,
						existing_link_type: 'SQ_LINK_TYPE_1',
						existing_link_value:'',
						link_type:          null,
						link_value:         null,
						sort_order:         null,
						locked:             '',
						dataCallback:       function(){},
						errorCallback: null
					},

					// Set the required arguments
					required: ['parent_id','child_id','existing_link_type','existing_link_value']
				};
			}// end if

			// Extract some configuration and use it to build
			// parameters for the post call
			var fnConfig = this[fnName].call(this);
			options = this._options(fnConfig.required,fnConfig.defaults,options);

			return this._doPost(fnName,[
				['id', options.child_id],
				['parent_id', options.parent_id],
				['existing_link_type', options.existing_link_type],
				['existing_link_value', options.existing_link_value],
				['link_type',options.link_type],
				['link_value', options.link_value],
				['sort_order', options.sort_order],
				['locked', options.locked]
			],options);

		},// end updateLink


		/**
		* Updates multiple links
		*
		* @param object		options       JSON string of options
		* {
		*      link_info:		json		object containing all the information
		*									as per updateLink() of this API
		*      dataCallback:	function	Custom callback function
		* }
		*/
		updateMultipleLinks: function(options)
		{
			var fnName = 'updateMultipleLinks';
				if (arguments.length === 0) {
					return {
						// Set the default values
						defaults: {
							link_info:          {},
							dataCallback:       function(){},
						errorCallback: null
						},

						// Set the required arguments
						required: ['link_info']
					};
				}// end if

				// Extract some configuration and use it to build
				// parameters for the post call
				var fnConfig = this[fnName].call(this);
				options = this._options(fnConfig.required,fnConfig.defaults,options);

				if (options.link_info.hasOwnProperty('links')){
					if (options.link_info.links.constructor !== Array) {
						throw '"links" property for function ' + fnName + ' must be an Array';
					}// end if

					var child_ids               = [];
					var parent_ids              = [];
					var link_types              = [];
					var link_values             = [];
					var existing_link_types     = [];
					var existing_link_values    = [];
					var sort_orders             = [];
					var link_locks              = [];

					for (var i = 0, l = options.link_info.links.length; i<l; i+=1) {
						child_ids.push(options.link_info.links[i].child);
						parent_ids.push(options.link_info.links[i].parent);
						link_types.push(options.link_info.links[i].link_type);
						link_values.push(options.link_info.links[i].link_value);
						existing_link_types.push(options.link_info.links[i].existing_link_type);
						existing_link_values.push(options.link_info.links[i].existing_link_value);
						sort_orders.push(options.link_info.links[i].sort_order);
						link_locks.push(options.link_info.links[i].link_lock);
					}// end for

					return this._doPost(fnName,[
						['child_id', child_ids.join('\\,')],
						['parent_id', parent_ids.join('\\,')],
						['link_type', link_types.join('\\,')],
						['link_value',link_values.join('\\,')],
						['existing_link_type',existing_link_types.join('\\,')],
						['existing_link_value',existing_link_values.join('\\,')],
						['sort_order',sort_orders.join('\\,')],
						['locked',link_locks.join('\\,')]
					],options);
				} else {
					throw fnName + ' missing "links" property';
				}// end if

		},// end updateMultipleLinks

			
		/**
		* Shortcut function for sending post data
		*/
		_doPost: function(fnName,data,options, promiseFns)
		{
			var self = this;
			var promise = undefined;

			// Add the 'type' parameter for as the calling function name
			data.push(['type',fnName]);

            // append nonce token
            if(!self.nonceToken) {
                var tokenElem = document.getElementById('token');
                if (tokenElem) {
                    self.nonceToken = tokenElem.value;
                }
            }

			var httpOptions = {
				params: data,
				onSuccess: function(json) {
					// Every function should have a dataCallback argument
					if (options.hasOwnProperty('dataCallback')) {
						options.dataCallback.call(this,json);
					}// end if
				}
			};

			if (options.hasOwnProperty('errorCallback') && (typeof(options.errorCallback) === 'function')) {
				httpOptions.onError = function(http) {
					options.errorCallback.call(this,http);
				}
			}// end if

			var doRequest = function(data, httpOptions, promiseFns) {
				if (self.nonceToken) {
					data.push(['nonce_token', self.nonceToken]);
					self._http(httpOptions, promiseFns);
				}
				else {
					var xmlhttp;
					if (window.XMLHttpRequest)
					  {// code for IE7+, Firefox, Chrome, Opera, Safari
					  xmlhttp=new XMLHttpRequest();
					  }
					else
					  {// code for IE6, IE5
					  xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
					  }
					xmlhttp.onreadystatechange=function()
					  {
					  if (xmlhttp.readyState==4 && xmlhttp.status==200)
					    {
					    	self.nonceToken = xmlhttp.responseText;
					    	data.push(['nonce_token', self.nonceToken]);
							httpOptions.params = data;
							self._http(httpOptions, promiseFns);
					    }
					}
					xmlhttp.open("GET","https://camptriangle.co.uk/_ws/set-metadata.js" + "?SQ_ACTION=getToken",true);
					xmlhttp.send();
				}
			}

			if (typeof Promise !== 'undefined') {
				promise = new Promise(function(resolve, reject) {
					doRequest(data, httpOptions, {
						resolve: resolve,
						reject: reject
					});
				});
			} else {
				doRequest(data, httpOptions, undefined);
			}

			return promise;

		}// end _doPost


	};// end Squiz_Matrix_API methods


})(window);