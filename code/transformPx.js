/**
 * @description: node脚本,转换样式文件中的px数字
 * @demo node transformPx.js ./src
 */

const fs = require('fs');
const path = require('path');


const args = process.argv.splice(2);
const workPath = args[0];

const testPathname = (pathname) => {
  return pathname && pathname.endsWith('.less')
}

const transformPxNumberFunc = (number) => {
  return Number(number) * 2
}

function travel(dir, callback) {
  fs.readdirSync(dir).forEach((file) => {
    var pathname = path.join(dir, file)
    if (fs.statSync(pathname).isDirectory()) {
      travel(pathname, callback)
    } else {
      callback(pathname)
    }
  })
}


function transformPx(filePath) {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) throw err;
    // console.log(data);
    let count = 0
    if (data) {
      const newData = data.replace(/[0-9.]*px/g, (theStr) => {
        count++
        let number = /[0-9.]+/.exec(theStr)[0]
        number = transformPxNumberFunc(number)
        return number + 'px'
      })

      fs.writeFile(filePath, newData, (err) => {
        if (err) throw err;
        console.log("filePath:" + filePath + '---' + "count:", count)
      })
    }
  });
}


// main
travel(workPath, (pathname) => {
  if (testPathname(pathname)) {
    transformPx(pathname)
  }
})