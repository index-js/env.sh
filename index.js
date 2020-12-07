const FS = require('fs')


const warn = str => {
    console.warn(`[.env][DEBUG] ${str}`)
}

const parse = (input = '', debug = false) => {
    input = input.toString()
    if (debug && input.indexOf('\r\n')) warn(`Change CRLF to LF`)

    return input.split(/\r?\n/).map(line => line.trim()).reduce((all, line, index) => {
        if (line) {
            const match = line.match(/^\s*([A-Z\d_]+)(\s*=\s*)([^#]*)/i)
            if (match) {
                let [$, key, sign, value] = match
                if (sign !== '=' && debug) warn(`No spaces before or after "=" on line ${ index + 1 }`)

                value = value.trim()
                value = value.replace(/^(['"`])(.*)\1$/, '$2')
                all[key] = value
            } else if (debug) warn(`Line ${ index + 1 } did not match key and value`)
        }
        return all
    }, {})
}

const config = (options = {}) => {
    const envPath = options.path || '.env'
    const debug = options.debug || false

    const str = FS.readFileSync(envPath, 'utf8')
    if (debug && str.startsWith('\uFEFF')) warn(`Use UTF-8 without BOM`)

    const parsed = parse(str, debug)
    Object.keys(parsed).forEach(key => {
        if (process.env.hasOwnProperty(key)) warn(`"${key}" is already defined`)
        else process.env[key] = parsed[key]
    })

    return parsed
}


module.exports = {
    parse,
    config
}
