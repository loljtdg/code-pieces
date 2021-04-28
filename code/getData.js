// 缓存数据并合并100ms内的多次请求的方法

// 缓存数据
const cashData = []

// 缓存的多个promise
let promiseObjectArray = []

// 主函数
function getData(id) {

  // 查缓存
  const data = getDataFromCash(id)
  if (data) {
    return Promise.resolve(data)
  }

  // 去请求
  return new Promise((resolve, reject) => {
    // do something
    promiseObjectArray.push({ resolve: resolve, reject: reject, id: id })
    doReallyRequst()

    setTimeout(() => reject('timeout'), 6000)
  })
}



// 发请求
const doReallyRequst = debounce(async () => {
  const thisPromiseResolveArray = promiseObjectArray
  promiseObjectArray = []

  const idList = []
  thisPromiseResolveArray.forEach(promiseObj => {
    idList.push(promiseObj.id)
  })

  if (idList.length > 0) {
    const data = await requstData(idList)
      .catch(e => {
        console.log(e)
        return null
      })

    if (data && data.length > 0) {
      // 放入缓存
      cashData.push(...data)

      thisPromiseResolveArray.forEach(promiseObj => {
        const data = getDataFromCash(promiseObj.id)
        promiseObj.resolve(data)
      })
      return
    }
  }

  thisPromiseResolveArray.forEach(promiseObj => {
    promiseObj.reject('getData error')
  })
}, 100)

// 查缓存
function getDataFromCash(id) {
  if (cashData?.length > 0 && id) {
    for (let element of cashData) {
      if (element?.id === id) {
        return element
      }
    }
  }
}


// 测试方法
function debounce(fn, delay) {
  var ctx;
  var args;
  var timer = null;

  var later = function () {
    fn.apply(ctx, args);
    // 当事件真正执行后，清空定时器
    timer = null;
  };

  return function () {
    ctx = this;
    args = arguments;
    // 当持续触发事件时，若发现事件触发的定时器已设置时，则清除之前的定时器
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }

    // 重新设置事件触发的定时器
    timer = setTimeout(later, delay);
  };
}
function requstData(idList) {
  return new Promise(resolve => {
    const result = idList.map(id => ({ id: id, data: "data:" + id }))
    resolve(result)
  })
}

export default getData