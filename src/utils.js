export const age = timestamp => {
    const floor = val => Math.floor(val);
    const floorOut = val => floor(val).toString(10)

    const now = new Date().getTime()
    const ms = (now - (timestamp * 1000))
    const secs = ms / 1000
    const mins = secs / 60
    const hours = mins / 60
    const days = hours / 24
    const months = days / 30.44
    const years = days / 365.24
    const monthsDiff = months - floor(years) * 12
    const daysDiff = days - floor(months) * 30.44
    const hoursDiff = hours - floor(days) * 24
    const minsDiff = mins - floor(hours) * 60
    const secsDiff = secs - floor(mins) * 60

    const output = [];
    const whatDone = new Map()

    if (years > 1) {
        output.push(floorOut(years) + ' years')
        whatDone.set('years', true)
    }
    if (monthsDiff > 1) {
        output.push(floorOut(monthsDiff) + ' months')
        whatDone.set('months', true)
    }
    if (daysDiff > 1) {
        output.push(floorOut(daysDiff) + ' days')
        whatDone.set('days', true)
    }
    if (hoursDiff > 1) {
        output.push(floorOut(hoursDiff) + ' hours')
        whatDone.set('hours', true)
    }
    if (minsDiff > 1) {
        output.push(floorOut(minsDiff) + ' mins')
        whatDone.set('mins', true)
    }
    if (secsDiff > 1) {
        output.push(floorOut(secsDiff) + ' secs')
        whatDone.set('secs', true)
    }

    // console.log(`x timestamp: ${timestamp} - now: ${now}, ms: ${ms}, sec: ${secs}, secsDiff: ${secsDiff}, min: ${mins}, minsDiff: ${minsDiff}, hours: ${hours} - ${output.join(', ')}`)
    return output.join(' ')
}


export const numberFormat = number => new Intl.NumberFormat().format(number)

/**
 * For long hashes, condense to `0x####...####`
 * @param input
 * @return {*|string}
 */
export const succinctise = input => {
    if (!input) {
        return ''
    }
    return input.length < 11 ? input : input.substring(0, 6) + "..." + input.substring(input.length - 6)
}

