# crSession
[![Build Status](https://travis-ci.org/ngutils/cr-session.svg)](https://travis-ci.org/ngutils/cr-session)

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

## Advanced usage
This library support `namespace` a good strategy to divide the session in different arguments, default namespace is `application` but you can change it or you can use different namespace in the same app.
```javascript
crSession.set("key-test", "{my: 'content'}", "namespace-new"")
console.log(crSession.get("key-test", "namespace-new")); // "{my: 'content'}"
crSession.purgeNamespace("namespace-new")
```

`purgeNamespace` delete all keys for this namespace but you can delete single key:
```javascript
crSession.delete("test", "namespace-new")
```
