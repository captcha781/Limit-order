const isEmpty = (value) => {
    if (typeof value === 'string') {
        if (value.length === 0) {
            return true
        } else {
            return false
        }
    } else if (typeof value === 'object') {
        if (Object.keys(value).length === 0) {
            return true
        } else {
            return false
        }
    }
}

module.exports = isEmpty