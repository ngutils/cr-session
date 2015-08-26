[![Build Status](https://travis-ci.org/ngutils/cr-session.svg)](https://travis-ci.org/ngutils/cr-session)

# CrSession
This library helps you to manage the application session. It has an adapter layer, at the moment it supports

* local storage
* Cookie

## Install
```bash
bower install cr-session
```

```javascript
angular.module(
        'ngtest',
        [
            'LocalStorageService',
            'cr.session'
        ]
)
```

## Getting Started
Its public API is very easy it supports `get` and `set` of value.

```javascript
crSession.set("test", "content")
console.log(crSession.get("test")); // content
```

You can delete a value from session
```javascript
crSession.delete("test")
```

Or purge ALL session
```javascript
crSession.purge()
```
