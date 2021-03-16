
/**
 * @description: 组装必要与非必要Promise
 * @param {*} promiseArrayMain 必要Promise数组 Array<Promise<any>>
 * @param {*} promiseArrayExtra 非必要Promise数组 Array<Promise<any>>
 * @param {*} timer 必要Promise完成后给非必要Promise的冗余时间 undefined|string
 * @return {*} 返回一个Promise Promise<Array<Array<Object>>>
 */
function creactFetchPromise(promiseArrayMain, promiseArrayExtra, timer) {
    return (async function () {
        let finished = false, extraFinished = false
        const extraRes = []
        const pending = { status: "pending" }
        const promiseExtra = new Promise(resolve => {
            promiseArrayExtra.forEach((pms, index) => {
                extraRes[index] = pending
                pms.then(result => {
                    if (!finished) {
                        extraRes[index] = { status: "fulfilled", value: result }
                    }
                }).catch(e => {
                    if (!finished) {
                        extraRes[index] = { status: "rejected", reason: e }
                    }
                }).finally(() => {
                    if (!finished) {
                        if (!extraRes.includes(pending)) {
                            extraFinished = true
                            resolve()
                        }
                    }
                })
            })
        })


        const mainRes = await Promise.allSettled(promiseArrayMain)

        if (!extraFinished && timer) {
            await Promise.race([
                promiseExtra,
                new Promise(resolve => {
                    setTimeout(() => {
                        resolve()
                    }, timer)
                })
            ])
        }

        finished = true

        return [mainRes, extraRes]
    })()
}