const findStatus = (body, sp) => {
    if (body.orderType === "market") {
        return "open"
    } else if (body.orderType === "limit") {
        if (body.limitPrice >= sp) {
            return "open"
        } else if (body.limitPrice < sp) {
            return "unplaced"
        }
    } else if (body.orderType === "stop-limit") {
        if (body.stopPrice >= sp) {
            return "open"
        } else {
            return "unplaced"
        }
    }
}

module.exports = findStatus