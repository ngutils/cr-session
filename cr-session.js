/**
 * Manage application session, local and remote
 */
angular.module('cr.session', [
  'LocalStorageModule'
])
.service('crSessionService', ['$rootScope', '$log', '$q', function($rootScope, $log, $q){

	this._adapter = {};
	this._rootSession = "application";
	this._remotes = {}; //?
	this._defaultNamespace = "default";
	var self = this;

    /**
     * Set list of adapter
     * @param Object adapter
     * @param String namespace
     */
	self.setRemoteAdapter = function(adapter, namespace) {
    	namespace = (namespace) ? namespace : self._defaultNamespace;
		self._remotes[namespace] = {
			"adapter": adapter,
			"sync": false
		};
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
	self.getNamespace = function(namespace) {
    	namespace = (namespace) ? namespace : self._defaultNamespace;
        var session = self._adapter.get(self._rootSession);
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
	self.setNamespace = function(value, namespace) {
    	namespace = (namespace) ? namespace : self._defaultNamespace;
        var session = self._adapter.get(self._rootSession);
        session[namespace] = value;
        self._adapter.set(self._rootSession, session);
	};

    /**
     * Init root session if is empty
     * @param String namespace
     * @return mixed
     */
    self.initRootSessionNode = function(namespace){
        var session = self._adapter.get(self._rootSession);
        if(session == undefined) {
            var startup = {};
            startup[namespace] = {};
            self._adapter.set(self._rootSession, startup);
        }
        return self._adapter.get(self._rootSession)[namespace];
    };

    /**
     * Return value
     * @param String key
     * @param String namespace
     * @return mixed
     */
    self.get = function(key, namespace) {
    	namespace = (namespace) ? namespace : self._defaultNamespace;
        var session = self._adapter.get(self._rootSession);
        if(session == undefined) {
            session = self.initRootSessionNode(namespace);
        }
        if (namespace in session) {
        	return session[namespace][key];
        }
        return null;
    };

    /**
     * Set value
     * @param key String
     * @param value mixed
     * @param namespace String
     */
    self.set = function(key, value, namespace) {
    	namespace = (namespace) ? namespace : self._defaultNamespace;
    	if(key) {
            var session = self._adapter.get(self._rootSession);
            if (!session) {
                session = {};
            }
            if (!session[namespace]) {
                session[namespace] = {};
            }
        	session[namespace][key] = value;
            if(self._adapter.set) {
              $log.debug("[crSession] Set into "+namespace, value);
            	self._adapter.set(self._rootSession, session);
            }

            var remote = self._remotes[namespace];
            if(remote && remote.adapter) {
            	remote.adapter.post({id:namespace, data: session[namespace]}).then(function(data) {
        			$rootScope.$broadcast("remotesession:set:success", {"namespace":namespace, "data":session[namespace]});
                $log.debug("[crSession] Broadcast remotesession:set:success");
            	}, function(data) {
        			$rootScope.$broadcast("remotesession:set:error", {"namespace":namespace, "data":session[namespace]});
                $log.debug("[crSession] Broadcast remotesession:set:error");
            	});
            }
        }
    };

    /**
     * Delete value
     * @param String key
     * @param String namespace
     */
    self['delete'] = function(key, namespace) {
        namespace = (namespace) ? namespace : self._defaultNamespace;
        var session = self._adapter.get(self._rootSession);
        if(session[namespace][key] !== null && session[namespace][key] !== undefined) {
            delete session[namespace][key];
        }
        if(self._adapter.set) {
            self._adapter.set(self._rootSession, session);
        }
        var remote = self._remotes[namespace];
        if(remote && remote.adapter) {
            remote.adapter.post({id:namespace, data: session[namespace]}).then(function(data) {
                $rootScope.$broadcast("remotesession:delete:success", {"namespace":namespace, "data":session[namespace]});
                $log.debug("[crSession] Broadcast remotesession:delete:success");
            }, function(data) {
                $rootScope.$broadcast("remotesession:delete:error", {"namespace":namespace, "data":session[namespace]});
                $log.error("[crSession] Broadcast remotesession:delete:error");
            });
        }

    };

    /**
     * Clean all session
     */
    self.purge = function() {
        var session = self._adapter.get(self._rootSession);
        self._adapter.set(self._rootSession, null);

        // var remote = self._remotes[namespace];
        // if(remote && remote.adapter) {
        // 	remote.adapter.post({id:namespace, data: null}).then(function(data) {
        //     $rootScope.$broadcast("remotesession:purge:success", {"namespace":namespace, "data":null});
        //     $log.debug("[crSession] Broadcast remotesession:purge:success");
        // 	}, function(data) {
        //     $rootScope.$broadcast("remotesession:purge:error", {"namespace":namespace, "data":null});
        //     $log.error("[crSession] Broadcast remotesession:purge:error");
        // 	});
        // }
    };

    /**
     * Purge all namespace
     * @param String namespace
     */
    self.purgeNamespace = function(namespace) {
    	namespace = (namespace) ? namespace : self.defaultNamespace;
        var session = self._adapter.get(self._rootSession);
        delete session[namespace];
        self._adapter.set(self._rootSession, session);
        var remote = self._remotes[namespace];
        if(remote && remote.adapter) {
        	remote.adapter.post({id:namespace, data: null}).then(function(data) {
            $rootScope.$broadcast("remotesession:purgenamespace:success", {"namespace":namespace, "data":null});
        	}, function(data) {
            $rootScope.$broadcast("remotesession:purgenamespace:error", {"namespace":namespace, "data":null});
        	});
        }
    };

    /**
     * Retrieve remote data and write on local data after successful set of identity
     */
    $rootScope.$on("auth:identity:success", function(event, data) {
        var callbackSuccess = function(data) {
            self.setNamespace(data, iii);
            $rootScope.$broadcast("remotesession:get:success", {"namespace":iii, "data":data});
        };
        var callbackError = function(data) {
            $rootScope.$broadcast("remotesession:get:error", {"namespace":iii, "data":data});
        };
        for(var iii in self._remotes) {
            self._remotes[iii].adapter.get({id:iii}).then(callbackSuccess, callbackError);
        }
    });

    /**
     * Create service
     * @param Object defaultAdapter default session adapter
     */
    self.createService = function(defaultAdapter) {
    	self._adapter = defaultAdapter;

      self.init = defaultAdapter.init;
      if(self.init === undefined) {
        self.init = function() {
          var d = $q.defer();
          d.resolve();
          return d.promise;
        };
      }
    	return self;
    };
}])
.provider('crSession', function() {
	this.$get = ['localStorageService', 'crSessionService', function(localStorageService, crSessionService){
		var service = crSessionService.createService(localStorageService);
		return service;
	}];
});
