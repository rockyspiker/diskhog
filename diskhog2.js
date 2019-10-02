const fs = require('fs')
const path = require('path')
let pathName = process.argv[2]
let resultsFiles = []
let resultsSizes = []
let newResultsSizes = []

function getSize(curPath) {
    const stats = fs.statSync(curPath)
    let totalSize = 0
    if (!stats.isDirectory()) 
        totalSize = stats.size

    else {
        let files = fs.readdirSync(curPath)
        for (let i in files) {
            let newPath
            if (curPath[-1] === '/')
                newPath = curPath + files[i]
            else
                newPath = curPath + '/' + files[i]
            totalSize += getSize(newPath)
        }
    }

    return totalSize
}

function getAllFiles(curPath) {
    resultsFiles.push(curPath)
    resultsSizes.push(getSize(curPath))
    const stats = fs.statSync(curPath)
    if (stats.isDirectory()) {
        let files = fs.readdirSync(curPath)
        for (let i in files) {
            let newPath = ''
            if (curPath.toString().endsWith('/'))
                newPath = curPath + files[i]
            else
                newPath = curPath + '/' + files[i]            
            getAllFiles(newPath)
        }
    }
}

function format() {
    getAllFiles(pathName)
    for (let i=0;i<resultsFiles.length;i++) {
        let fileSize = resultsSizes[i]
        let newSize = ''
        if (fileSize > 1000000000)
            newSize = '(' + (Math.ceil(fileSize/4096) * 4)/1000000 + ' GB) '
        else if (fileSize > 1000000)
            newSize = '(' + (Math.ceil(fileSize/4096) * 4)/1000 + ' MB) '
        else
            newSize = '(' + (Math.ceil(fileSize/4096) * 4) + ' KB) '
        newResultsSizes[i] = newSize
    }

}

function main(curPath) {
    const stats = fs.statSync(curPath)
    if (stats.isDirectory()) {
        console.group(newResultsSizes.shift(), resultsFiles[0])
        let files = fs.readdirSync(resultsFiles.shift())
        for (let i in files) {
            main(resultsFiles[0])
        }
        console.groupEnd()
    }
    else
        console.log(newResultsSizes.shift(), resultsFiles.shift())
}

format()
main(pathName)