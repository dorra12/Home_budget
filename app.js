const balance = document.getElementById("balance");
const inflow = document.getElementById("income");
const outflow = document.getElementById("expense");
const list = document.getElementById("list");
const form = document.getElementById("form");
const text = document.getElementById("text");
const amount = document.getElementById("amount");
const btnDelete =document.getElementsByClassName("delete-btn");
let transactions = [];

//Get transaction from local strorage
const localStorageTransactions= JSON.parse(localStorage.getItem("transactions"));
let transaction = 
localStorage.getItem("transactions") !== null ?
localStorageTransactions : [];

//add transaction function
function addTransaction(e){
    e.preventDefault();
    //1.conditional to check if the fields are empty or not
    if (text.value.trim()==="" || amount.value.trim()===""){
        document.getElementById("error-msg").innerHTML = "<span>Error.Enter text and amount first</span>";
        setTimeout(
            () => (document.getElementById("error-msg").innerHTML =""),
            5000
        );
    }else{
        const transaction = {
            id: generateID(),
            text: text.value,
            amount: +amount.value,
        };
        transactions.push(transaction);

        //I want to add transaction to document object model DOM- for local storage
        addTransactionDOM(transaction);
        //Update the value
        updateValues();
        //update the local storage 
        updateLocalStorage();
        //set text and amount to ""
        text.value = "";
        amount.value="";
        //Invoke add transaction DOM
    }
    //3. generate random ID for delete button
    function generateID(){
        return Math.floor(Math.random() * 100000000)
    }
    //2. transaction history
    function addTransactionDOM(transaction){
        //3. Sign(+ or -)
        const sign = transaction.amount < 0 ? "-" : "+";
        const item = document.createElement("li");

        //4. add list element based on the sign
        item.classList.add(transaction.amount < 0 ? "minus" : "plus");

        //5. adding (rendering) the list element with thedelete button on the page using innerHTML property
        item.innerHTML = `${transaction.text} ${sign} ${Math.abs(transaction.amount)}
        <button class="delete-btn" onclick="removeTransaction(${transaction.id})" 
        X
        </button>`; 

        list.appendChild(item);
    }
    //7. update the balance
    function updateValues(){
        const amounts = transactions.map((transaction)=>
        transaction.amount);

        const total =amounts
        .reduce((bal,value)=>(bal+=value),0);

        const income =amounts
        .filter((value) => value > 0)
        .reduce((bal, value)=>(bal += value), 0);

        const expense =amounts
        .filter((value) => value < 0)
        .reduce((bal, value) => (bal +=value), 0 * -(1));

        //8. displaying balace, inflox and outflow
        balance.innerText = `${total}`;
        inflow.innerText = `${income}`;
        outflow.innerText = `${expense}`;
    }
        //6.Remove transaction by ID
    function removeTransaction(id){
        transactions = transactions.filter((transaction)=> 
        transaction.id !==id);
        //9. need to update the storage after removing
        updateLocalStorage();
        //need to start the whole app
        start();
    }
    //10. update the storage after removing
    function updateLocalStorage(){
        localStorage.setItem("transactions",JSON.stringify(transactions));
    }
    //11. starting the application
    function start(){
        list.innerHTML="";
        transactions.forEach(addTransactionDOM);
        updateValues();
    }
    //invoke the start function
    start();
}
form.addEventListener("submit", addTransaction);