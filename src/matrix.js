class Mtrix {
    constructor (){
        this.preMt1 = []
        this.preMt2 = []
    }
    transpose (arr) {   <!-- 转置 -->
        if (arr[0] instanceof Array) {
            return arr[0].map(function (col, i) {
                return arr.map(row => row[i])
            })
        } else if (typeof arr[0] === "number") {
            return arr.map(row => [row])
        }
    }
    tobe (arr) {
        arr.length = 100
    }
    sum (arr, col = false) {
        if (col) {
            arr = this.transpose(arr)
        }
        return arr.reduce((sum, col) => sum + col)
    }
    mean (arr, col = false) {
        if(col){
            arr = this.transpose(arr)
        }
        return arr.map(row => row.reduce((sum,col) => sum + col)/row.length)
    }
    variate (arr, col = false) {
        if (col){
            arr = this.transpose(arr)
        }
        let mean = this.mean(arr)
        let trans = arr.map((row,i) => row.map(col => Math.pow(col - mean[i],2)))
        return this.transpose(trans)
    }
    multi (arr1, arr2) {      <!-- 矩阵相乘 -->
        if(arr1[0].length !== arr2.length){
            console.log('矩阵不能相乘！')
        }
        let pr2 = this.transpose(arr2)
        return arr1.map(row => pr2.map(row2 => row.reduce((sum,col,i) => sum + row2[i]*col)))
    }
}

class Calc extends Mtrix {
    constructor () {
        super()
    }
    distance (arr1,arr2,fill = false) {
        if(arr1.length !== arr2.length){
            if(fill){
                let fullfill = (less,more) => {
                    let num = more.length - less.length
                    let arr = new Array(num).fill(0)
                    return less.concat(arr)
                }
                arr1.length >= arr2.length ? (arr2 = fullfill(arr2,arr1)):(arr1 = fullfill(arr1,arr2))
            }else {
                console.log('维度不相同 m !== n')
            }
        }
        let vector = arr1.map((row,i) => Math.pow(row - arr2[i],2))
        return Math.sqrt(vector.reduce((sum,row) => sum + row ))
    }
    createArr (obj) {
        let toIs = {}
        let toId = {}
        let arr = []
        for(let idx in obj){
            arr.push(obj[idx])
            toIs[arr.length -1] = idx
            toId[idx] =arr.length -1
        }
        return  {
            id:toId,
            isbn:toIs,
            arr:arr
        }
    }
    toMatrix(d1,d2){
        return d1.map((row,i) => {
            return d2.map((col) => {
                return col
            })
        })
    }
    multiMatrix(d1,d2) {       <!-- theta(j)T * x(i) -->
        return d1.map((row,i) => {
            console.log(parseInt(i/d1.length*100)+'%')
            return d2.map((col) => {
                return this.multi([row],this.transpose(col))[0][0] - 10
            })
        })
    }
}

module.exports = {
    Calc:Calc,
    Matrix:Mtrix
}

// let arr1 = [[12,22,23],[2,3,4],[4,5,6]]
// let arr2 = [[3,5,6],[2,3,4],[4,5,6]]
// let mt = new Mtrix()
// mt.transpose(arr1)
// let arr3 = mt.multi(arr1,arr2)
// let cal = new Calc()
// // console.log()
// let me = mt.mean(arr3,true)
// let me2 = mt.variate(arr3,true)
// let dis = cal.distance(arr1[0],arr2[0],true)
// let predict = cal.multiMatrix(arr1,arr2)
// console.log(predict)