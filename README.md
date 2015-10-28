# crSession
[![Build Status](https://travis-ci.org/ngutils/cr-session.svg)](https://travis-ci.org/ngutils/cr-session)

## Overview

This library helps you to manage the application session. It has an adapter layer, at the moment it supports

* local storage
* Cookie (if local storage is not supported)

The session is stored by the client so you can use it also after page reload or new tab opening.

## Install
```bash
bower install cr-session
```

add to your html:

```html
<script src="bower_components/angular-local-storage/dist/angular-local-storage.js"></script>
<script src="bower_components/cr-session/cr-session.js"></script>
```
then inject it:

```javascript
angular.module(
        'ngtest',
        [
            'LocalStorageService',
            'cr.session'
        ]
)
```

## GET/SET

Push and get data to/from your session:

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

## Namespaces

crSession supports `namespace` to divide the session in different buckets. The default namespace is `application` but you can change it or you can use different namespaces in the same app.

```javascript
crSession.set("key-test", "{my: 'content'}", "namespace-new")
console.log(crSession.get("key-test", "namespace-new")); // "{my: 'content'}"
crSession.purgeNamespace("namespace-new")
```

`purgeNamespace` delete all keys for this namespace but you can delete single key:
```javascript
crSession.delete("test", "namespace-new")
```

## Purge

You can destroy a single namespace:

```javascript
crSession.purgeNamespace("namespace-name");
```

or the whole session:

```javascript
crSession.purge();
```
