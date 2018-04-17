function getValue() {
    let thatVal = 0
    return Promise.resolve(1).then(val => {
        if (val > 0) {
            return thatVal = val + 42
        }

        throw new Error('val error')
    }).then(val2 => {
        return thatVal = val / 0
    }).then(val3 => {
        thatVal = val3 * 2
    }).catch(err => {
        return thatVal = 1 + 1
    }).then(val4 => {
        return thatVal = val4 * val4
    }).catch(err => {
        console.log(err)
        return thatVal
    })
}

function getValue1(val, thatVal) {
    if (val > 0) {
        return thatVal = val + 42
    }

    throw new Error('val error')
}

function getValue2(thatVal, val1) {
    return thatVal = val / 0
}

function getValue3(thatVal) {
    return thatVal *= thatVal
}

async function f1(val) {
    let thatVal = 0
    const val1 = await getValue1(val, thatVal)
    try {
        return await getValue2(thatVal, val1)

    } catch (err) {
        thatVal = 1 + 1
        return thatVal * thatVal
    }
}

if (require.main === module) {
    // getValue().then(console.log)
    console.log(f1(1))
}