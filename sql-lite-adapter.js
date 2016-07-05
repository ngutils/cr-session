


angular.module('LocalStorageModule', [
 'ngCordova'
])
.service('localStorageService', ['$cordovaSQLite', '$q', '$log', function($cordovaSQLite, $q, $log) {
  var service = {
    db: false,
    stored: {}
  };

  service.set = function (key, value) {
    service.stored = value;
    $log.debug("SQL SETTING", key, value, service.stored);
    service.save();
  };

  service.get = function (key) {
    $log.debug("SQL GETTING", key, service.stored);
    return service.stored;
  };

  service.save = function() {
    $cordovaSQLite.execute(service.db, "UPDATE mysession SET storeddata = ? WHERE id = ?", [escape(JSON.stringify(service.stored, null, '')), 1]).then(function(result) {
    });
  };

  service.init = function() {
    var d = $q.defer();
    service.db = $cordovaSQLite.openDB({ name: "mylocaldb", location: 'default' });
    $cordovaSQLite.execute(service.db, "CREATE TABLE IF NOT EXISTS mysession (id integer primary key, storeddata text)").then(function() {
      $cordovaSQLite.execute(service.db, "SELECT * FROM mysession WHERE id = ?", [1]).then(function(result) {
        if(result.rows.length === 0) {
          var def = {};
          $cordovaSQLite.execute(service.db, "INSERT INTO mysession (id, storeddata) VALUES (?,?)", [1, escape(JSON.stringify(def, null, ''))]).then(function(result) {
            d.resolve({});
          }, function(err) {

          });
        }
        else {
          service.stored = JSON.parse(unescape(result.rows.item(0).storeddata));
          d.resolve(service.stored);
        }
      }, function(err) {
        d.reject();
      });

    }, function(err) {
      d.reject();
    });
    return d.promise;
  };

  return service;
}])
;
