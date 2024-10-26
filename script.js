
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

    // functions

}

const inputDate = document.querySelector("#date")
const inputIsIncome = document.querySelector("#isIncome")
const inputPurpose = document.querySelector("#purpose")
const inputToOrFrom = document.querySelector("#toOrFrom")
const inputAmount = document.querySelector("#amount")
const inputCurrency = document.querySelector("#currency")
const inputComment = document.querySelector("#comment")
const btnSubmit = document.querySelector("#submit")
const btnEdit = document.querySelector("#edit")
const btnSave = document.querySelector("#save")
const tableContent = document.querySelector("#table-content")


// main-table database
let tradingArray = [];
let dataToUpdate = newTrade("1","2024-10-26","支出","早餐",50,"TWD","巷口早餐","")
let dataToUpdate2 = newTrade("2","2024-10-27","支出","午餐",100,"TWD","巷口午餐","蕭 喝價")
let dataToUpdate3 = newTrade("3","2024-10-27","支出","晚餐",150,"TWD","巷口晚餐","蕭 拍價")

// 將日期的default設為今天
const date = new Date();
const formattedDate = new Intl.DateTimeFormat('en-CA').format(date);
inputDate.value = formattedDate

// 建立新的紀錄並審查格式
function newTrade(id,date,isIncome,purpose,amount,currency,toFrom,comment){
    // 建立新的object
    let newData = new Trading(id,date,isIncome,purpose,amount,currency,toFrom,comment)
    console.log(newData)
    // 確認資料格式
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

function updateTable(array){
    tableContent.innerHTML = ""
    array.map(item =>{
        tableContent.innerHTML += `<tr>
        <td class="checkbox hidden">
        <input class="deletedCheck" type="checkbox" id="${item.id}">
        </td>
        <td>${item.date}</td>
        <td>${item.isIncome}</td>
        <td>${item.purpose}</td>
        <td>${item.toFrom}</td>
        <td>${item.amount}</td>
        <td>${item.currency}</td>
        <td>${item.comment}</td>
        </tr>`
    })
    // render
}

tradingArray.push(dataToUpdate,dataToUpdate2,dataToUpdate3)

updateTable(tradingArray)

btnSubmit.addEventListener("click",()=>{
    let newId = Number(tradingArray[tradingArray.length - 1].id) +1

    let dataToUpdate = newTrade(
        newId,
        inputDate.value,
        inputIsIncome.value,
        inputPurpose.value,
        inputAmount.value,
        inputCurrency.value,
        inputToOrFrom.value,
        inputComment.value
        )
    if(dataToUpdate){    
        tradingArray.push(dataToUpdate)
    }else{return}
    updateTable(tradingArray)
})
// 編輯
btnEdit.addEventListener("click",()=>{

    let target = document.querySelectorAll(".checkbox")
    target.forEach(item=> item.classList.toggle("hidden"))
    if(target[0].classList.value === "checkbox"){
        console.log("editing mode")
        btnEdit.textContent = "刪除"
    }else{
        let deleteTarget = document.querySelectorAll(".deletedCheck")
        let filetedTarget = Array.from(deleteTarget).filter(item =>item.checked)
        let deleteID = []
        filetedTarget.forEach(item => deleteID.push(item.id))
        
        for(let i = 0; i < deleteID.length; i++){
            tradingArray = tradingArray.filter(item => item.id !== deleteID[i])
            console.log(`round${i}`)
        }
        console.log(tradingArray)
        console.log(deleteID)
        console.log("editing mode close")
        updateTable(tradingArray)

        btnEdit.textContent = "編輯"
    }
   
})

btnSave.addEventListener("click" , ()=>{
    let tradingArrayInJSON = JSON.stringify(tradingArray)
    console.log(tradingArrayInJSON)
})