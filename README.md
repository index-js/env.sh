# env.sh
> Load environment variables from .env file

In file `".env"`, Add environment-specific variables on new lines in the form of `KEY=VALUE`.

`KEY` can only contain letters, numbers and underscores, `VALUE` contains special characters (such as spaces) must be quoted, and there must be no spaces around `"="`

Therefore, the file `".env"` can be defined in [`process.env`](https://nodejs.org/docs/latest/api/process.html#process_process_env) and run directly as `shell`.



## Installation

Install via `npm`:

```
$ npm i env.sh
```



## Usage

As early as possible in your application, require and configure.

```javascript
require('env.sh').config()
```

Create a `.env` file in the root directory of your project.
For example:

```dosini
DB_HOST=localhost
DB_USER=root
DB_PASS=123456
```

`process.env` now has the keys and values you defined in your `.env` file.

```javascript
const db = require('db')
db.connect({
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASS
})
```



## Config

`config` will read your `.env` file, parse the contents, assign it to
[`process.env`](https://nodejs.org/docs/latest/api/process.html#process_process_env),
and return an Object or throw an `error`.


### Options

#### Path

Default: `.env`

You may specify a custom path if your file containing environment variables is located elsewhere.

```js
require('env.sh').config({ path: 'path/to/.env' })
```

#### Debug

Default: `false`

You may turn on logging to help debug why certain keys or values are not being set as you expect.

```js
require('env.sh').config({ debug: process.env.DEBUG })
```


## Parse

The engine which parses the contents of your file containing environment
variables is available to use. It accepts a String or Buffer and will return
an Object with the parsed keys and values.

```js
const buf = Buffer.from('FooBar=foobar')
const config = require('env.sh').parse(buf, /* debug = false */) // will return an object
console.log(typeof config, config) // object { FooBar : 'foobar' }
```

### Rules

The parsing engine currently supports the following rules:

- lines beginning with `#` are treated as comments
- `FooBar=foorbar` becomes `{FooBar: 'foobar'}`
- value trim
- `JSON='{"foo": "bar"}'` becomes `{JSON:'{"foo": "bar"}'`
- value contains `space` or `$` requires single quotes
- single and double quoted wrapper are removed


## Authors

**Yanglin** ([i@yangl.in](mailto:mail@yanglin.me))


## License

Copyright (c) 2019 Yanglin

Released under the MIT license
