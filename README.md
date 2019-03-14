# remote-css-select-stream
Quickly run a css selector against a remote page source.

Use programmatically or as a nifty command line tool

## Programmatically

### install
```
npm install --save remote-css-select-stream
```

### usage
```javascript
var rcss = require('remote-css-select-stream')

// list all the javascript  files in this github page
rcss({ 
    url: 'https://github.com/kessler/remote-css-select-stream', // required
    selector: 'a.js-navigation-open', // optional
    filter: '^.+\\.js$' // optional
}).pipe(process.stdout)
```

#### reusing the same request
You can reuse an existing request object, this was only testing using [hyperquest](https://github.com/substack/hyperquest)

```javascript
var rcss = require('remote-css-select-stream')
var request = require('hyperquest')

var req = request('https://github.com/kessler/remote-css-select-stream')

// list all the javascript files in this github page
rcss({ 
    request: req , // required
    selector: 'a.js-navigation-open', // optional
    filter: '^.+\\.js$' // optional
}).pipe(process.stdout)

// list all markdown files
rcss({ 
    request: req , // required
    selector: 'a.js-navigation-open', // optional
    filter: '^.+\\.md$' // optional
}).pipe(process.stdout)
```

## CLI

### install
```
npm install -g remote-css-select-stream
```

### usage
Same as the above programmatic example, but this time through command line
```
rcss --url=https://github.com/kessler/remote-css-select-stream --selector=a.js-navigation-open --filter=^.+\\.js$
```

## Debugging
name: remote-css-select-stream, see [debug](https://github.com/tj/debug)
