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
// elements
const inputDate = document.querySelector("#date")
const inputIsIncome = document.querySelector("#isIncome")
const inputPurpose = document.querySelector("#purpose")
const inputToOrFrom = document.querySelector("#toOrFrom")
const inputAmount = document.querySelector("#amount")
const inputCurrency = document.querySelector("#currency")
const inputComment = document.querySelector("#comment")
const btnSubmit = document.querySelector("#submit")
const btnEdit = document.querySelector("#edit")
const btnDelete = document.querySelector("#delete")
const tableContent = document.querySelector("#table-content")
const heads = document.querySelectorAll(".head")
const btnInsert = document.querySelector("#Insert-active")
const insertZone = document.querySelector("#insert")

const tutorialBtn = document.querySelector("#tutorial-active")
const tutorialContent = document.querySelector("#tutorial-content")


// main-table testing database
let prevData = JSON.parse(localStorage.getItem("trading"))
// JS用全局變數
let tradingArray = [];

// function 儲存資料到localStorage
function dataSaveToStorage(){
    let tradingArrayInJSON = JSON.stringify(tradingArray)
    localStorage.setItem("trading",tradingArrayInJSON)
}

// function-將日期的default設為今天
function setToday(){
    const date = new Date();
    const formattedDate = new Intl.DateTimeFormat('en-CA').format(date);
    inputDate.value = formattedDate
}
// function-建立新的紀錄並審查格式
function newTrade(id,date,isIncome,purpose,amount,currency,toFrom,comment){
    // 建立新的object
    let newData = new Trading(id,date,isIncome,purpose,amount,currency,toFrom,comment)
    // 確認資料格式是否空白(備註可空白)
    let err = [];
    for (const property in newData){
        if(property === "toFrom"){continue}
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
// function-重新將array中的資料渲染至畫面
function updateTable(array){
    tableContent.innerHTML = ""
    array.map(item =>{
        tableContent.innerHTML += `<tr id="tr-${item.id}">
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
    let checkboxArr = document.querySelectorAll(".deletedCheck")
    
    for(const checkbox of checkboxArr ){
        checkbox.addEventListener("change",(event)=>{
            let trID = document.querySelector(`#tr-${checkbox.id}`)
            if(event.target.checked){
                trID.style.backgroundColor = "red"
                console.log(`${checkbox.id} checked`,trID)
            }else{
                trID.style.backgroundColor = "white"
                console.log(`${checkbox.id} cancel`)
            }
        })
    }
}
// function-排序
function sortingData(datatype){
    switch(datatype) {
        case "head-date":
            tradingArray.sort((a,b)=>new Date(a.date) - new Date(b.date))
            console.log("sort by date",tradingArray)
                break;
        case "head-isIncome":
            tradingArray.sort((a,b)=> a.isIncome.localeCompare(b.isIncome, 'zh-Hant-TW'))
                console.log("sort by isIncome")
                break;             
        case "head-purpose":
            tradingArray.sort((a,b)=> a.purpose.localeCompare(b.purpose, 'zh-Hant-TW'))
                console.log("sort by purpose")
                break;
        case "head-amount":
            tradingArray.sort((a,b)=>a.amount - b.amount)
                console.log("sort by amount")
                break;         
        case "head-currency":
            tradingArray.sort((a,b)=> a.currency.localeCompare(b.currency, 'en', { sensitivity: 'base' }))
                console.log("sort by currency")
                break;
        case "head-toFrom":
            tradingArray.sort((a,b)=> a.toFrom.localeCompare(b.toFrom, 'zh-Hant-TW'))            
                console.log("sort by toFrom")
                break;             
        case "head-comment":
            tradingArray.sort((a,b)=> a.comment.localeCompare(b.comment, 'zh-Hant-TW'))            
                console.log("sort by comment")
                break;        
            default:
                break;
    } 
    return tradingArray
    
}
// EventListener-sort
heads.forEach(item =>{
    let order = true
    item.addEventListener('click',()=>{
        sortingData(item.id)
        order? updateTable(tradingArray):updateTable(tradingArray.reverse());        
        order = !order
    })
})
// EventListener-送出
btnSubmit.addEventListener("click",()=>{
    let newId = tradingArray.length > 0? Number(tradingArray[tradingArray.length - 1].id) +1 : 1;
    const dataToUpdate = newTrade(
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
        dataSaveToStorage()
    }else{
        console.log(`data incomplete`)
        return}
    updateTable(tradingArray)
})
// EventListener-編輯
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
            tradingArray = tradingArray.filter(item => item.id !== Number(deleteID[i]))
            console.log(`round${i}`,deleteID[i], tradingArray)
        }
        dataSaveToStorage()
        console.log("editing mode close")
        updateTable(tradingArray)
        btnEdit.textContent = "編輯"
    }
})

// EventListener-localStorage DELETE
btnDelete.addEventListener("click" , ()=>{
    const userConfirm = confirm(`Are you sure about that?`)
    if(userConfirm){
        localStorage.removeItem("trading")
        tradingArray = []
        updateTable(tradingArray)
        alert(`data clear`)
    }else{
        alert(`Not thing happened `)
    }
})
btnInsert.addEventListener('click',()=>{
    if(btnInsert.textContent === "Insert")
        {btnInsert.textContent = "Close"}
    else{btnInsert.textContent = "Insert"}
    btnInsert.classList.toggle("active")
    btnInsert.classList.toggle("close")
    insertZone.classList.toggle("mobile-hidden")
})
// 說明欄

tutorialBtn.addEventListener('click',()=>{
    tutorialContent.classList.toggle("hidden-1")
    tutorialContent.classList.toggle("show-content")
})

// default start render and working
if(prevData){tradingArray = prevData}
setToday()
updateTable(tradingArray)





