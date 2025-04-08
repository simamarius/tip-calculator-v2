const amountInput = document.getElementById("amount")
const tipButtons = document.querySelectorAll(".buttons-container button")
const customTipInput = document.getElementById("tip")
const peopleInput = document.getElementById("number-of-people")
const tipPerson = document.getElementById("tip-person")
const totalTipPerson = document.getElementById("tip-total-person")
const resetButton = document.getElementById("rest")
const calculate = document.querySelector(".calculate")
const errorMsg = document.querySelector(".error-msg")

// History data table
const history = document.querySelector("tbody"); 
const table = document.querySelector("table")
const noData =  document.querySelector("#no-data")

document.querySelector("form").addEventListener("submit", function (event) {
    event.preventDefault(); 
    
});


let tipPercentage = 0;
let data = []

tipButtons.forEach(button => {
    button.addEventListener("click", (e) => {
        const amountValue = parseFloat(amountInput.value);
        
        // Dacă valoarea din amountInput nu este validă (e.g. goală sau mai mică decât 0), nu lăsăm butoanele să funcționeze
        if (isNaN(amountValue) || amountValue <= 0) {
            return; // Ieșim din funcție, astfel încât butonul de tip nu va face nimic
        }
        
        tipButtons.forEach(btn => btn.classList.remove("active"))
    
        e.target.classList.add("active")
        const tipValue = e.target.textContent
        tipPercentage = parseInt(tipValue);
        customTipInput.value = ""
        console.log(tipPercentage)
        

    })
});

customTipInput.addEventListener("input", () => {
    const customTipValue = parseInt(customTipInput.value)
    if (!isNaN(customTipValue) && customTipValue > 0) {
      tipPercentage = customTipValue
   console.log(tipPercentage)
      tipButtons.forEach(btn => btn.classList.remove("active"))
    
    }
    else{
        tipPercentage = 0 ;
    }
  });


  amountInput.addEventListener("input", function() {
    if ( isNaN(amountInput.value) || parseFloat(amountInput.value) < 0  || amountInput.value === "") {
        calculate.disabled = true; // Dezactivează butonul dacă valoarea este invalidă
    } else {
        calculate.disabled = false; // Activează butonul dacă valoarea este validă
    }
});


  function calculateTip() {
    const amount = parseFloat(amountInput.value) || 0;
    const numberOfPeople = parseInt(peopleInput.value);

   

    if (!numberOfPeople || numberOfPeople <= 0) {
       
            errorMsg.style.display = "block"
       
        return;
    } else {
       
            errorMsg.style.display = "none"
        
    }

    if (amount > 0 && numberOfPeople > 0 && tipPercentage > 0) {
        const tipAmount = (amount * (tipPercentage / 100))/numberOfPeople;
        const totalAmount = (amount * (tipPercentage/100) + amount)/numberOfPeople
        const dataCalcul = new Date()
        let formattedDate = new Intl.DateTimeFormat('ro-RO').format(dataCalcul); // Formatul "26.03.2025"
// declaram variabila ce va contine array ul 
        let inputValori = [
            amount,  
            numberOfPeople,
            tipPercentage,
            formattedDate
           ]

        tipPerson.textContent = `$${tipAmount.toFixed(2)}`
        totalTipPerson.textContent = `$${totalAmount.toFixed(2)}`

        resetButton.disabled = false
        resetButton.style.backgroundColor = "var(--green-400)"
          noData.style.display = "none"

// aici creem obiectul si il adaugam in array ul data
        let newData ={
            bill: inputValori[0],
            people: inputValori[1],
            tip: inputValori[2],
           date: inputValori[3]
        }
        data.push(newData);
        updateHistory();
        updateStatistics();

    } else {
        tipPerson.textContent = "$0.00"
        totalTipPerson.textContent = "$0.00"
        resetButton.disabled = true
       noData.style.display = "block"
        table.style.display = "none"
        
    }
}


resetButton.addEventListener("click", () => {
    
    amountInput.value = ""
    peopleInput.value = ""
    customTipInput.value = ""

   
    tipPerson.textContent = "$0.00"
    totalTipPerson.textContent = "$0.00"

   
    errorMsg.style.display = "none"

 
    tipButtons.forEach(btn => btn.classList.remove("active"))
    tipPercentage = 0

   
    resetButton.disabled = true;
    resetButton.style.backgroundColor = "#0D686D"

});



function updateHistory() {
 

    history.innerHTML = "" // Golim tabelul inainte de a adauga valori noi

    if (data.length === 0) {
        // daca nu sunt date afisam paragraful si ascundem tabelul
        noData.style.display = "block"
        table.style.display = "none"
    } else {
        // da sunt date afisam tabel 
        noData.style.display = "none"
        table.style.display = "table"
        
        //  map pentru a crea randuri pentru fiecare obiect din data
        history.innerHTML = data.map((randData, index) => `
            <tr>
                <td id="amountInput">${randData.bill}</td>
                <td id="tipInput">${randData.tip}%</td>
                <td id="peopleInput">${randData.people}</td>
                <td id="dateInput">${randData.date}</td>
                <td><i onclick="editRand(${index})" class="fa-solid fa-pen-to-square"></i></td>
                <td><i onclick="deleteRand(${index})" class="fa-solid fa-trash"></i></td>
            </tr>
        `).join("")
    }
}




function deleteRand(index) {
        data.splice(index, 1)

        
        updateHistory();
        updateStatistics();
}

function editRand(index) {
    const rand = data[index]

    // Înlocuiește rândul cu un formular de editare
    const row = `
        <tr>
            <td><input type="number" id="editBill" value="${rand.bill}"></td>
            <td><input type="number" id="editTip" value="${rand.tip}"></td>
            <td><input type="number" id="editPeople" value="${rand.people}"></td>
            <td>${rand.date}</td>
            <td>
                <button onclick="saveEdit(${index})"><i class="fa-solid fa-check"></i></button>
            </td>
            <td>
                <button onclick="updateHistory()"><i class="fa-solid fa-xmark"></i></button>
            </td>
        </tr>
    `

    // Înlocuiește doar rândul curent din tabel
    const rows = history.querySelectorAll("tr")
    rows[index].outerHTML = row
}

function saveEdit(index) {
    // Preluăm noile valori din input-uri
    const newBill = parseFloat(document.getElementById("editBill").value)
    const newTip = parseFloat(document.getElementById("editTip").value)
    const newPeople = parseInt(document.getElementById("editPeople").value)

    // Actualizăm obiectul din array
    data[index].bill = newBill
    data[index].tip = newTip
    data[index].people = newPeople

    // Reafișăm istoricul
    updateHistory();
    updateStatistics();
}

function updateStatistics() {
    const statisticsDiv = document.querySelector(".statistics");

    // Dacă nu avem date, nu afișăm nimic
    if (data.length === 0) {
        statisticsDiv.innerHTML = "";
        return;
    }

    const totalBills = data.reduce((sum, item) => sum + item.bill, 0);
    const totalTips = data.reduce((sum, item) => sum + item.tip, 0);
    const maxBill = Math.max(...data.map(item => item.bill));

    const avgBill = (totalBills / data.length).toFixed(2);
    const avgTip = (totalTips / data.length).toFixed(2);

    statisticsDiv.innerHTML = `
        <div class="stat-card">
            <h3>Average Bill</h3>
            <p>$${avgBill}</p>
        </div>
        <div class="stat-card">
            <h3>Average Tip</h3>
            <p>${avgTip}%</p>
        </div>
        <div class="stat-card">
            <h3>The Most Expensive</h3>
            <p>$${maxBill.toFixed(2)}</p>
        </div>
    `;
}
