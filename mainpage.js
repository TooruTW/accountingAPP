class Trading {
    constructor(id,date,isIncome,purpose,amount,currency,toFrom,comment){
        this.id = id;
        this.date = date;
        this.isIncome = isIncome;
        this.purpose = purpose;
        this.amount = amount;
        this.currency = currency;
        this.toFrom = toFrom;
        this.comment = comment;
    }
}
const totalAmount = document.querySelector("#total")
const greatestPayInThisMonth = document.querySelector("#greatestPay")
const greatestIncomeInThisMonth = document.querySelector("#greatestIncome")

// quick input BTN
const questions = document.querySelectorAll(".question")
const checkbtn = document.querySelector("#check-btn")
const btns = document.querySelectorAll(".question-btns")
const incomes = document.querySelectorAll(".income")
const payments = document.querySelectorAll(".pay")
const result = document.querySelector("#result")

let questionIndex = 0
let questionArr = Array(questions)
let answer = []

// main-table testing database
let prevData = JSON.parse(localStorage.getItem("trading"))
// JS用全局變數
let tradingArray = [];
if(prevData){tradingArray = prevData}

function getToday(){
    let date = new Date()
    const formattedDate = new Intl.DateTimeFormat('en-CA').format(date);
    return formattedDate
}
function setToday(){
    document.querySelector("#today").innerHTML = `<h1>${getToday()}</h1>`
}
function setDashBoard(){
    let payArr = tradingArray.filter(item => item.isIncome === "支出")
    let incomeArr = tradingArray.filter(item => item.isIncome === "收入")
    let totalPay = payArr.reduce((total, item) => total + Number(item.amount),0)
    let totalIncome = incomeArr.reduce((total, item) => total + Number(item.amount),0)
    
    let greatestPay = payArr.reduce((max, item) => Number(item.amount) > max ? Number(item.amount) : max,0);
    let greatestIncome = incomeArr.reduce((max, item) => Number(item.amount) > max ? Number(item.amount) : max,0);

    if(totalPay > totalIncome){
        totalAmount.style.color = "red"
        totalAmount.textContent = `總資產: ${totalIncome - totalPay}`

    }else{
        totalAmount.style.color = "green"
        totalAmount.textContent = `總資產: ${totalIncome - totalPay}`
    }
     
    let greatestPayItem = payArr.find(item => item.amount == greatestPay)
    let greatestIncomeItem = incomeArr.find(item => item.amount == greatestIncome)
    console.log(greatestPayItem,greatestIncomeItem)  
    if(greatestPayItem){
        greatestPayInThisMonth.innerHTML = `<br/>${greatestPayItem.amount} ${greatestPayItem.purpose} <br/> ${greatestPayItem.comment}`
    }
    if(greatestIncomeItem){
        greatestIncomeInThisMonth.innerHTML = `<br/>${greatestIncomeItem.amount} ${greatestIncomeItem.purpose}<br/> ${greatestIncomeItem.comment}`
    }
}

setToday()
setDashBoard()

// quickInput BTN

function showNextQuestion(p){
    for(const question of questions){
        if(!question.classList.contains("hidden")){question.classList.add("hidden")}
    }
    questions[p].classList.remove("hidden")
    if(answer[0] === "收入"){
        for(const payment of payments ){payment.classList.add("hidden")}
        for(const income of incomes ){income.classList.remove("hidden")}
    }
    if(answer[0] === "支出"){
        for(const payment of payments ){payment.classList.remove("hidden")}
        for(const income of incomes ){income.classList.add("hidden")}
    }
}

function reSet(){
    // 將資料存入local storage
    console.log(answer)
    let newId = tradingArray.length > 0? Number(tradingArray[tradingArray.length - 1].id) +1 : 1;

    const dataToUpdate = new Trading(newId,getToday(),answer[0],answer[1],answer[2],"TWD","","")

    tradingArray.push(dataToUpdate)
        console.log(tradingArray)

    let tradingArrayInJSON = JSON.stringify(tradingArray)
    localStorage.setItem("trading",tradingArrayInJSON)

    // 動畫後重製輸入介面
    result.innerHTML = `<div id="fade-out-animate-${answer[0] === "收入"? "income":"payment"}">$</div>`
    questionIndex = 0
    answer = []
    document.querySelector("#start").classList.add("move-inn")
    setTimeout(()=>{showNextQuestion(questionIndex)},3000)
    setDashBoard()
}

// 重製START的 move-inn 動畫
document.querySelector("#start").addEventListener('click',()=>{
    if(document.querySelector("#start").classList.contains("move-inn")){
        document.querySelector("#start").classList.remove("move-inn")
    }
})

// 金額不可空白確認
checkbtn.addEventListener('click',()=>{
    if(document.querySelector("#input-amount").value){
        answer.push(document.querySelector("#input-amount").value)
        document.querySelector("#result").innerHTML = `<h1 id="input-data">${answer[0]} ${answer[1]} ${answer[2]}元</h1>`
        document.querySelector("#input-data").style.color = `${answer[0]==="支出"? "red":"green"}`
    }else{
        alert(`請輸入金額`) 
        questionIndex --
        return
    }
})
// 按鈕屬性添加 
for(const btn of btns){
    btn.addEventListener('click',()=>{
        if(questionIndex === questions.length -1) return 
        if(btn.value){answer.push(btn.value)}
        questionIndex ++
        showNextQuestion(questionIndex)
    })
}
