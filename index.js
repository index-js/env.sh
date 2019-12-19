const fs = require('fs')


const warn = str => {
    let log = '\033[33m [env.sh] \033[0m'
    log += str
    console.warn(log)
}

const parse = (input = '', options = {}) => {
    const debug = !!options.debug

    input = input.toString()
    if (input.indexOf('\r') && debug) warn(`Cannot contain newline "\\r", setfileformat=unix`)

    return input.split(/\r?\n/).map(line => line.trim()).reduce((all, line, index) => {
        if (line) {
            const match = line.match(/^([A-Z\d_]+)(\s*=\s*)(.*)/i)
            if (match) {
                let [$, key, sign, value] = match
                if (sign !== '=' && debug) {
                    warn(`No spaces before or after "=" on line ${ index + 1 }`)
                }

                value = value.replace(/^(['"`])(.*)\1$/, '$2')
                all[key] = value
            } else if (debug) {
                warn(`Line ${ index + 1 } did not match key and value`)
            }
        }
        return all
    }, {})
}

const config = (options = {}) => {
    const envPath = options.path || '.env'
    const encoding = options.encoding || 'utf8'
    const debug = !!options.debug

    const parsed = parse(fs.readFileSync(envPath, encoding), { debug })
    Object.keys(parsed).forEach(key => {
        if (Object.prototype.hasOwnProperty.call(process.env, key)) {
            warn(`"${key}" is already defined`)
        } else {
            process.env[key] = parsed[key]
        }
    })

    return parsed
}


module.exports = {
    parse,
    config
}
