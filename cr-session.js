angular.module('cr.session', [])
.provider('crSession', [function() {
    /**
     * @var Object
     */
    this.adapters = {};

    /**
     * Default adapter name
     * @var string
     */
    this._defaultAdapterName = "default";

    /**
     * Default namespace
     * @var string
     */
    this._baseNamespace = "application";

    /**
     * Add adapter to pool
     * @param adapter Object session adapter
     * @param key     String adapter name
     */
    this.setAdapter = function(adapter, key){
        key = (key) ? key : this._defaultAdapterName;
        this.adapters[key] = adapter;
    };

    /**
     * Get adapter by name
     * @param key string
     */
    this.getAdapter = function(key){
        key = (key) ? key : this._defaultAdapterName;
        if (this.adapters[key]) {
            return this.adapters[key];
        }
        throw "Adapter "+key+" not exist";
    };

    /**
     * Set into default adapter
     * @param key String
     * @param value
     * @param namespace String adapter name
     */
    this.set = function(key, value, namespace) {
        if (!namespace) {
            namespace = this._defaultAdapterName;
        }
        var adapter = this.getAdapter(namespace);
        var session = adapter.get([this._baseNamespace]);
        if (!session) {
            session = {};
        }
        if (!session[namespace]) {
            session[namespace] = {};
        }
        session[namespace][key] = value;
        adapter.set(this._baseNamespace, session);
    };

    /**
     * Return value by namespace
     * @param key String
     * @param namespace String adapter name
     * @return mixed
     */
    this.get = function(key, namespace) {
        var defaultAdapter = this.getAdapter(namespace);
        console.log(defaultAdapter.get(this._baseNamespace));
        return defaultAdapter.get(this._baseNamespace)[namespace][key];
    };

    this.$get = [function(){
        return {
            _defaultAdapterName: this._defaultAdapterName,
            _baseNamespace: this._baseNamespace,
            adapters: this.adapters,
            setAdapter: this.setAdapter,
            getAdapter: this.getAdapter,
            set: this.set,
            get: this.get
        };
    }];
}]);
