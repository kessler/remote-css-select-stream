# remote-css-select-stream
Quickly run a css selector against a remote page source.

Use programmatically or as a command line tool

## Programmatically

### install
```
npm install --save remote-css-select-stream
```

### usage
```javascript
var rcss = require('remote-css-select-stream')

// list all the files in this github page
rcss({ 
    url: 'https://github.com/kessler/remote-css-select-stream', 
    selector: 'a.js-directory-link', 
    filter: '.+\\.js'
}).pipe(process.stdout)
```

## CLI

### install
```
npm install -g remote-css-select-stream
```

### usage
```
rcss --url=https://github.com/kessler/remote-css-select-stream --selector=a.js-directory-link --filter=.+\\.js
```

## Debugging
name: remote-css-select-stream, see [debug](https://github.com/tj/debug)
