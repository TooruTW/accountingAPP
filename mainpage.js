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

const userInput = document.querySelector("#quickKeyInResult")
const btnquickKeyIn = document.querySelector("#btnquickKeyIn")
const quickKeyIn = document.querySelector("#quickKeyIn")
const btnSaveToStorage = document.querySelector("#btnSaveToStorage")



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
    let greatestPay = payArr.reduce((max, item) => Number(item.amount) > max ? Number(item.amount) : max, Number(payArr[0].amount));
    let greatestIncome = incomeArr.reduce((max, item) => Number(item.amount) > max ? Number(item.amount) : max,Number(incomeArr[0].amount));


    if(totalPay>totalIncome){
        totalAmount.textContent = `總資產: ${totalIncome - totalPay}`
        totalAmount.style.color = "red"
    }else{
        totalAmount.style.color = "green"
        totalAmount.textContent = `總資產: ${totalIncome - totalPay}`
    }

    let greatestPayItem = tradingArray.find(item => item.amount == greatestPay)
    let greatestIncomeItem = tradingArray.find(item => item.amount == greatestIncome)

    greatestPayInThisMonth.textContent = `${greatestPayItem.amount} ${greatestPayItem.purpose} ${greatestPayItem.comment}`
    greatestIncomeInThisMonth.textContent = `${greatestIncomeItem.amount} ${greatestIncomeItem.purpose} ${greatestIncomeItem.comment}`

    
    

    console.log(payArr,incomeArr)
    console.log(greatestIncome,greatestPay)
}

function newTrade(id,date,isIncome,purpose,amount,currency,toFrom,comment){
    // 建立新的object
    let newData = new Trading(id,date,isIncome,purpose,amount,currency,toFrom,comment)
    // 確認資料格式是否空白(備註可空白)
    let err = [];
    for (const property in newData){
        if(property === "comment"){continue}
        if(newData[property] === ""){
            err.push(property)
        }
    }
    if(err.length > 0 ){ 
        alert(`plz enter ${err.join(", ")}`)
        return false
    }
    return newData
}

function dataCheck(rawData){
    let arr = rawData.split(" ")
    let newId = tradingArray.length > 0? Number(tradingArray[tradingArray.length - 1].id) +1 : 1;

    const dataToUpdate = newTrade(newId,getToday(),arr[0],arr[1],arr[3],"TWD",arr[2],arr[4]? arr[4]:"")
    userInput.innerHTML = `<p style="font-style: italic">${dataToUpdate.date} ${dataToUpdate.isIncome}</p>`
    userInput.innerHTML += `<p>目的:${dataToUpdate.purpose} 幣種:${dataToUpdate.currency} 金額:${dataToUpdate.amount} 對象:${dataToUpdate.toFrom} 備註:${dataToUpdate.comment}</p>`
    
    console.log(Number(dataToUpdate.amount))
    console.log(arr,dataToUpdate)

    if(!Number(dataToUpdate.amount)){
        userInput.innerHTML += `<h3 style="color:red; font-size:bold">格式錯誤 請重新確認資料</h3>`
        return false
    }
    else{
        return dataToUpdate
    }
   
}

function addTrade(){
    let dataToUpdate = dataCheck(quickKeyIn.value)
    if(dataToUpdate){
        tradingArray.push(dataToUpdate)
        console.log(tradingArray)

        let tradingArrayInJSON = JSON.stringify(tradingArray)
            localStorage.setItem("trading",tradingArrayInJSON)
    }else{
        alert(`格式錯誤 請重新確認資料`)
        return false
    }
}

btnquickKeyIn.addEventListener('click',()=>{
    if(dataCheck(quickKeyIn.value)){
        btnSaveToStorage.classList.remove("hidden")
    }
})

btnSaveToStorage.addEventListener('click',()=>{
    addTrade()
    console.log(`送出成功`)
    btnSaveToStorage.classList.add("hidden")
    document.querySelector("#saveNotice").classList.add("fadeout")
    setDashBoard()
})
document.querySelector("#saveNotice").addEventListener("animationend", () => {
    // 動畫結束時移除類別
    document.querySelector("#saveNotice").classList.remove("fadeout");
});

setToday()
setDashBoard()

