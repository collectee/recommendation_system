let fs = require('fs')
let path = require('path')
let readline = require('readline')
let {Calc} = require('./matrix')

let fileName = {
    clean:{
        books:path.join(__dirname,'clean/books_clean.csv'),
        books_users_rating:path.join(__dirname,'clean/books_clean_rating.csv'),
        users:path.join(__dirname,'clean/users_clean.csv')
    },
    reduce:{
        rating:path.join(__dirname,'clean/reduced_books_users_ratings.csv'),
        rating_location:path.join(__dirname,'clean/reduced_books_users_ratings_locations.csv')
    },
    raw:{
        books_rating:path.join(__dirname,'BX-Books.csv'),
        books:path.join(__dirname,'BX-Book-Ratings.csv'),
        users:path.join(__dirname,'BX-Users.csv')
    }
}

function fileReduce() {
    this.is_id = {},
    this.id_is = {}
}
fileReduce.prototype = {
    fileName: '',
    fileBefore : '',
    data:[],
    reduceMatrix : [],
    unique_book_theta:{},
    unique_user_theta:{},
    books:{},
    users:{},
    rl : null,
    getData (data) {
        this.fileBefore = data
        readline.on('line', (line) =>
            console.log(line)
        )
    },
    readline (fileName,resolve) {
        if(!this.rl||this.fileName!==fileName){
            this.fileName = fileName
            this.rl = readline.createInterface({
                input: fs.createReadStream(this.fileName)
            })
        }
        let afterArr = []
        let i = 0
        this.rl.on('line', (line) => {
            let row = line.split(',')
            afterArr.push(row)
            this.is_id[row[0]] = i
            this.id_is[i++] = row[0]
        })
        this.rl.on('close',() => {
            afterArr.shift()
            resolve(afterArr)
        })
    },
    param_filter (data,col = 8) {
        data.map((row) => {
            if(!this.unique_book_theta[row[1]]){
                this.unique_book_theta[row[1]]={
                    per:new Array(4).fill(0),
                    sum:0,
                    rating:new Array(4).fill(0)
                }
            }
            let age = parseInt(row[col])
            let score = parseInt(row[2])
            if(!age)console.log(row,age)

            this.unique_book_theta[row[1]].sum+=score
            if(age <= 25){
                // this.unique_book_theta[row[1]].sum+=score
                this.unique_book_theta[row[1]].rating[0]+=score
            }else if(age >= 55){
                // this.unique_book_theta[row[1]].sum[3]++
                this.unique_book_theta[row[1]].rating[3]+=score
            }else{
                // this.unique_book_theta[row[1]].sum[parseInt((age-10) / 15)]++
                this.unique_book_theta[row[1]].rating[parseInt((age-10) / 15)]+=score
            }
        })
        let theta_book = {}
        for(let isbn in this.unique_book_theta){
            theta_book[isbn.replace(/X/i,'')] = this.unique_book_theta[isbn].rating.map((col,i) => {
                return col/this.unique_book_theta[isbn].sum || 0
            })
        }
        return theta_book
    },
    param_user (data,book_age) {
        data.map((row)=>{
            if(!this.unique_user_theta[row[0]]){
                this.unique_user_theta[row[0]]={
                    sum:0,
                    rating:new Array(4).fill(0)
                }
            }
            this.unique_user_theta[row[0]].sum++
            book_age[row[1].replace(/X/i,'')].map((col,i) => {
                this.unique_user_theta[row[0]].rating[i]+= col
            })
        })
        let userlist = {}
        for(user in this.unique_user_theta){
            userlist[user] = this.unique_user_theta[user].rating.map((row) => {
                let leng = Math.max(...this.unique_user_theta[user].rating)-Math.min(...this.unique_user_theta[user].rating)
                return this.sigmoid(row/this.unique_user_theta[user].sum - 0.5) * 10
            })
        }
        return userlist
    },
    J () {
        this.reduceMatrix = new Array(this.users.arr.length).fill(0)
        let cl = new Calc()
        this.data.map((row)=>{
            let b_id = this.books.id[row[1]]
            let u_id = this.users.id[row[0]]
            this.reduceMatrix[u_id] += (cl.multi([this.books.arr[b_id]],cl.transpose(this.users.arr[u_id]))[0][0] - parseInt(row[2]))
        })
        this.reduceMatrix = this.reduceMatrix.map((row,i) => {
            return this.users.arr[i].map((col) => {
                return row * col
            })
        })
        return this.reduceMatrix
    },
    gradient_descent (rate, namda = 0) {
        let sp = 0.5,Jnum = [[100]]
        while (sp < Math.abs(Jnum[0][0])) {
            Jnum = this.J()
            this.users.arr = this.users.arr.map((row,i) => {
                // console.log(Jnum[0][0])
                return row.map((theta,k) => {
                    return theta - rate*Jnum[i][k] + namda*theta
                })
            })
        }
        return this.users.arr
    },
    mostRelative (arr,arrFrom) {
        let min = Infinity
        let id = null
        let cl = new Calc()
        arrFrom.arr.map((row,i) => {
            let d = cl.distance(arr,row)
            if(min !== Math.min(min,d)){
                min = d
                id = i
            }
        })
        return arrFrom.isbn[id]
    },
    impect (rs,book,user) {
        this.books = book
        this.users = user
        this.data = rs
    },
    sigmoid (x,step = 1) {
        return 1/(1+Math.exp(step*x))
    }
}

module.exports = {
    fileName:fileName,
    fileReduce:fileReduce
}
