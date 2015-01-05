/**
 * Manage application session, local and remote
 */
angular.module('cr.session', [])
.service('crSessionService', ['$rootScope', function($rootScope){

	this._adapter = {};
	this._rootSession = "application";
	this._remotes = {}; //?
	this._defaultNamespace = "default";

    /**
     * Set list of adapter
     * @param Object adapter
     * @param String namespace
     */
	this.setRemoteAdapter = function(adapter, namespace) {
    	namespace = (namespace) ? namespace : this._defaultNamespace;
		this._remotes[namespace] = {
			"adapter": adapter,
			"sync": false
		};
		var self = this;
		adapter.get({id:namespace}).then(function(data) {
			self.setNamespace(data, namespace);
			$rootScope.$broadcast("remotesession:get:success", {"namespace":namespace, "data":data});
		}, function(data) {
			$rootScope.$broadcast("remotesession:get:error", {"namespace":namespace, "data":data});
		});
	};

    /**
     * Return all values by namespace
     * @param String namespace
     * @return mixed
     */
	this.getNamespace = function(namespace) {
    	namespace = (namespace) ? namespace : this._defaultNamespace;
        var session = this._adapter.get(this._rootSession);
        if(session[namespace]) {
        	return session[namespace];
        }
        else {
        	return null;
        }
	};

    /**
     * Set Value in namespace
     * @param mixed value
     * @param String namespace
     */
	this.setNamespace = function(value, namespace) {
    	namespace = (namespace) ? namespace : this._defaultNamespace;
        var session = this._adapter.get(this._rootSession);
        session[namespace] = value;
        this._adapter.set(this._rootSession, session);
	};

    /**
     * Return value
     * @param String key
     * @param String namespace
     * @return mixed
     */
    this.get = function(key, namespace) {
    	namespace = (namespace) ? namespace : this._defaultNamespace;
        var session = this._adapter.get(this._rootSession);
        if(session[namespace] && session[namespace][key]) {
        	return session[namespace][key];
        }
        else {
        	return null;
        }
    };

    /**
     * Set value
     * @param key String
     * @param value mixed
     * @param namespace String
     */
    this.set = function(key, value, namespace) {
    	namespace = (namespace) ? namespace : this._defaultNamespace;
    	if(key) {
            var session = this._adapter.get(this._rootSession);
            if (!session) {
                session = {};
            }
            if (!session[namespace]) {
                session[namespace] = {};
            }
        	session[namespace][key] = value;
            if(this._adapter.set) {
            	this._adapter.set(this._rootSession, session);
            }

            var remote = this._remotes[namespace];
            if(remote && remote.adapter) {
            	remote.adapter.post({id:namespace, data: session[namespace]}).then(function(data) {
        			$rootScope.$broadcast("remotesession:set:success", {"namespace":namespace, "data":session[namespace]});
            	}, function(data) {
        			$rootScope.$broadcast("remotesession:set:error", {"namespace":namespace, "data":session[namespace]});
            	});
            }
        }
    };

    /**
     * Delete value
     * @param String key
     * @param String namespace
     */
    this['delete'] = function(key, namespace) {
        namespace = (namespace) ? namespace : this._defaultNamespace;
        var session = this._adapter.get(this._rootSession);
        if(session[key] !== null && session[key] !== undefined) {
            delete session[key];
        }
        if(this._adapter.set) {
            this._adapter.set(this._rootSession, session);
        }
        var remote = this._remotes[namespace];
        if(remote && remote.adapter) {
            remote.adapter.post({id:namespace, data: session[namespace]}).then(function(data) {
                $rootScope.$broadcast("remotesession:delete:success", {"namespace":namespace, "data":session[namespace]});
            }, function(data) {
                $rootScope.$broadcast("remotesession:delete:error", {"namespace":namespace, "data":session[namespace]});
            });
        }

    };

    /**
     * Clean all session
     */
    this.purge = function() {
        var session = this._adapter.get(this._rootSession);
        this._adapter.set(this._rootSession, null);

        var remote = this._remotes[namespace];
        if(remote && remote.adapter) {
        	remote.adapter.post({id:namespace, data: null}).then(function(data) {
    			$rootScope.$broadcast("remotesession:purge:success", {"namespace":namespace, "data":null});
        	}, function(data) {
    			$rootScope.$broadcast("remotesession:purge:error", {"namespace":namespace, "data":null});
        	});
        }
    };

    /**
     * Purge all namespace
     * @param String namespace
     */
    this.purgeNamespace = function(namespace) {
    	namespace = (namespace) ? namespace : this.defaultNamespace;
        var session = this._adapter.get(this._rootSession);
        delete session[namespace];
        this._adapter.set(this._rootSession, session);
        var remote = this._remotes[namespace];
        if(remote && remote.adapter) {
        	remote.adapter.post({id:namespace, data: null}).then(function(data) {
    			$rootScope.$broadcast("remotesession:purgenamespace:success", {"namespace":namespace, "data":null});
        	}, function(data) {
    			$rootScope.$broadcast("remotesession:purgenamespace:error", {"namespace":namespace, "data":null});
        	});
        }
    };

    /**
     * Create service
     * @param Object defaultAdapter default session adapter
     */
    this.createService = function(defaultAdapter) {
    	this._adapter = defaultAdapter;
    	return this;
    };
}])
.provider('crSession', function() {
	this.$get = ['localStorageService', 'crSessionService', function(localStorageService, crSessionService){
		var service = crSessionService.createService(localStorageService);
		return service;
	}];
});
