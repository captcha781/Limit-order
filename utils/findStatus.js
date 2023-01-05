const findStatus = (body, sp) => {
    if (body.orderType === "market") {
        return "open"
    } else if (body.orderType === "limit" && body.type === "buy") {
        if (sp <= body.limitPrice) {
            return "open"
        } else if (sp > body.limitPrice) {
            return "unplaced"
        }
    } else if (body.orderType === "limit" && body.type === "sell") {
        if (sp >= body.limitPrice) {
            return "open"
        } else if (body.limitPrice > sp) {
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