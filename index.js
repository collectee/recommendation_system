let {Calc} = require('./src/matrix')
let {fileName,fileReduce} = require('./src/file')

let fileBook = new fileReduce()     //bookReduce

let pm2 = new Promise((resolve, reject) => {
    fileBook.readline(fileName.reduce.rating_location,resolve)        //isbn->id,id->isbn
})

Promise.all([pm2]).then(function(result){       //梯度下降处理，predict预测矩阵运算
    let cl = new Calc()

    // 参数形式：[[0-25],[26-40],[40,55],[55,~]]
    let book = fileBook.param_filter(result[0])     //年龄区间作为特征的book参数 初始化
    let user_for_book = fileBook.param_user(result[0],book)      //年龄区间作为特征的user参数 初始化

    //数据矩阵化
    book_theta = cl.createArr(book)
    user_theta = cl.createArr(user_for_book)

    //注入数据，和矩阵化过后的书籍——年龄参数，用户——年龄参数(初始化)
    fileBook.impect(result[0],book_theta,user_theta)

    //梯度下降单一过滤，求出用户感兴趣的年龄层书籍的分布
    let after_descent = fileBook.gradient_descent(0.001,0.001,0.015)

    //书籍参数(原) X 梯度下降后的用户参数
    let out = cl.multiMatrix(after_descent, book_theta.arr)

    //验证准确率
    let precise = fileBook.precise(out)
    console.log('准确率：',precise)

    //操作函数
    main(out,'32188','385497466')
})

function main (matrix,userID,ISBN){       //主要执行函数 params: 预测后的矩阵

    // 给定用户特征矩阵，求关联最高的书
    // let relateBook = fileBook.mostRelative([.2,.4,.4,0],book)
    // let show = fileBook.unique_book_theta[relateBook]

    // console.log(matrix)
    console.log('预测值：',matrix[fileBook.users.id[userID]][fileBook.books.id[ISBN]])
}