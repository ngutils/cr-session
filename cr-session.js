
angular.module('cr.session', [])
.service('crSessionService', ['$rootScope', function($rootScope){

	this._adapter = {};
	this._rootSession = "application";
	this._remotes = {}; //?
	this._defaultNamespace = "default";
	
	
//	this._getNamespace = function(namespace) {
//		if(namespace && in)
//	};
	
	this.setRemoteAdapter = function(adapter, namespace) {
    	namespace = (namespace) ? namespace : this._defaultNamespace;
		this._remotes[namespace] = {
			"adapter": adapter,
			"sync": false
		};
		var self = this;
		adapter.get({id:namespace}).then(function(data) {
			self.setNamespace(data, namespace);
			//event in syntax: module:resource:action:result
			$rootScope.$broadcast("cr-session:remote:get:success", {"namespace":namespace, "data":data});
		}, function(data) {
			//event in syntax: module:resource:action:result
			$rootScope.$broadcast("cr-session:remote:get:error", {"namespace":namespace, "data":data});
		});
		
		
	};

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
	
	this.setNamespace = function(value, namespace) {
    	namespace = (namespace) ? namespace : this._defaultNamespace;
        var session = this._adapter.get(this._rootSession);
        session[namespace] = value;
        this._adapter.set(this._rootSession, session);
	};
	
	
    this.get = function(key, namespace) {
    	namespace = (namespace) ? namespace : this._defaultNamespace;
//        var adapter = this.getAdapter(namespace);
//        console.log("questo è l'adapter", adapter.get(this._rootSession));
        var session = this._adapter.get(this._rootSession);

//        console.log("X- sessione al get", session);
        if(session[namespace] && session[namespace][key]) {
        	return session[namespace][key];
        }
        else {
        	return null;
        }
    };
    
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
    //        	if(this.remoteAdapters[namespace]) {
    //        		this.remoteAdapters[namespace].post(key, value);
    //        	}
            }
    
            var remote = this._remotes[namespace];
            if(remote && remote.adapter) {
            	remote.adapter.post({id:namespace, data: session[namespace]}).then(function(data) {
        			$rootScope.$broadcast("cr-session:remote:set:success", {"namespace":namespace, "data":session[namespace]});
            	}, function(data) {
        			$rootScope.$broadcast("cr-session:remote:set:error", {"namespace":namespace, "data":session[namespace]});
            	});
            }
        }
//        console.log("X- sessione dopo il set", session);
    };
    
    
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
                $rootScope.$broadcast("cr-session:remote:delete:success", {"namespace":namespace, "data":session[namespace]});
            }, function(data) {
                $rootScope.$broadcast("cr-session:remote:delete:error", {"namespace":namespace, "data":session[namespace]});
            });
        }
        
    };
    
    this.purge = function() {
        var session = this._adapter.get(this._rootSession);
        this._adapter.set(this._rootSession, null);

        var remote = this._remotes[namespace];
        if(remote && remote.adapter) {
        	remote.adapter.post({id:namespace, data: null}).then(function(data) {
    			$rootScope.$broadcast("cr-session:remote:purge:success", {"namespace":namespace, "data":null});
        	}, function(data) {
    			$rootScope.$broadcast("cr-session:remote:purge:error", {"namespace":namespace, "data":null});
        	});
        }
    };
    
    this.purgeNamespace = function(namespace) {
    	namespace = (namespace) ? namespace : this.defaultNamespace;
        var session = this._adapter.get(this._rootSession);
        delete session[namespace]; 
        this._adapter.set(this._rootSession, session);

        var remote = this._remotes[namespace];
        if(remote && remote.adapter) {
        	remote.adapter.post({id:namespace, data: null}).then(function(data) {
    			$rootScope.$broadcast("cr-session:remote:purgenamespace:success", {"namespace":namespace, "data":null});
        	}, function(data) {
    			$rootScope.$broadcast("cr-session:remote:purgenamespace:error", {"namespace":namespace, "data":null});
        	});
        }
    };
    
    this.createService = function(defaultAdapter) {
    	this._adapter = defaultAdapter;
    	return this;
    };
    
}])
.provider('crSession', function() {
	
	
	this.$get = ['localStorageService', 'crSessionService', function(localStorageService, crSessionService){
		var service = crSessionService.createService(localStorageService);
		
//		{
//			_adapter: ,
//			_rootSession: this._rootSession,
//			_defaultNamespace: this._defaultNamespace,		
//			_remotes: this._remotes,
//			get: this.get,
//			set: this.set,
//			setNamespace: this.setNamespace,
//			getNamespace: this.getNamespace,
//			setRemoteAdapter: this.setRemoteAdapter
//			
//			
//		};
		return service;
	}];
});

