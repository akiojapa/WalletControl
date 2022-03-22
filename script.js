const Modal = {
    open(){
        // Abrir Modal
        //Adicionar a classe active ao modal.
        document
        .querySelector('.modal-overlay')
        .classList
        .add('active')
    },
    close(){
        //Fechar Modal
        //Remover a classe active ao modal
        document
        .querySelector('.modal-overlay')
        .classList
        .remove('active')
    }
}    

//Somar entradas
// depois somar as saídas
// remover o valor das entradas e saídas
// então obter o valor total

const Storage = {
    get(){
        return JSON.parse(localStorage.getItem("Dev_Inglorius")) || []
    },

    set(transaction){
        localStorage.setItem("Dev_Inglorius:transactions", JSON.stringify(
        transaction))

    }

}

Storage.set()
Storage.get()

const App = {
    init(){

        Transaction.all.forEach( DOM.addTransaction)
          

        DOM.updateBalance()

        Storage.set(Transaction.all)

    },
    reload(){
        DOM.clearTransactions()
        App.init()
    },
}





const Transaction = {
    all:Storage.get(),
    
    add(transaction){
        Transaction.all.push(transaction)

        App.reload();
    },

    remove(index){
        Transaction.all.splice(index, 1)

        App.reload()
    },

    income(){
        let income = 0;

        //Pegar todas as transações
         //Para cada transação,
        Transaction.all.forEach(transaction => {
            // verificar se a transação é maior que zero
            if(transaction.amount > 0){
            //Somar a uma variável e retornar a variável    
                income += transaction.amount;

            }

        })
       
        

        return income;
    },
    expense(){
           let expense = 0;

        //Pegar todas as transações
         //Para cada transação,
         Transaction.all.forEach(transaction => {
            // verificar se a transação é menor que zero
            if(transaction.amount < 0){
             //Somar a uma variável e retornar a variável    
                expense += transaction.amount;
                
            }

        })
       
       
        return expense;
    },

    total(){
        return Transaction.income() + Transaction.expense();
    }
}

const DOM = {

    transactionsContainer: document.querySelector('#data-table tbody'),

    addTransaction(transaction, index){
        const tr = document.createElement('tr')
        tr.innerHTML = DOM.innerHTMLTransaction(transaction, index)
        tr.dataset.index = index
   
        DOM.transactionsContainer.appendChild(tr)

    },
    innerHTMLTransaction(transaction, index){
        const CSSclass = transaction.amount > 0 ? "income" : "expense"

        const amount = Utils.formatCurrency(transaction.amount)

        const html = `
        <td class="description">${transaction.description}</td>
        <td class="${CSSclass}">${amount} </td>
        <td class="date">${transaction.date}</td>
        <td class= "minus">
            <img onclick="Transaction.remove(${index})" src="./assets/minus.svg" alt="Remove transaction">
        </td>
        `

        return html
    },

    updateBalance(){
            document
            .getElementById('incomeDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.income())
            document
            .getElementById('expenseDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.expense())
            document
            .getElementById('totalDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.total())

    },

    clearTransactions(){
        DOM.transactionsContainer.innerHTML = ""
    }
}

const Utils = {
    formatAmount(value){
        value = Number(value) * 100
        
        return value;

       
    },

    formatDate(date){
        const splittedDate = date.split("-")
        return `${splittedDate[2]}/${splittedDate[1]}/ ${splittedDate[0]}`; //Dia / Mês / Ano
         
        
    },


    formatCurrency(value){
        const signal = Number(value) < 0 ? "-" : ""

        value = String(value).replace(/\D/g, "")

        value = Number(value) / 100

        value = value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"

        })
        return signal + value
    }
}

const Form = {
    description: document.querySelector('input#description'),
    amount: document.querySelector('input#amount'),
    date: document.querySelector('input#date'),

    getValues(){
        return {
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value,
        }
    },


// Verificar se todas as informações foram preenchidas
    ValidateField(){
        const {description, amount, date} = Form.getValues()

        if(description.trim() == "" || amount.trim() == "" || date.trim() == ""){
            throw new Error("Please, fill all fields")
        }

    },

    
    formatData(){
        let{ description, amount, date} = Form.getValues()
        amount = Utils.formatAmount(amount) 
        date = Utils.formatDate(date)

        return{
            description,
            amount,
            date
        }

    },

    saveTransaction(transaction){
        Transaction.add(transaction)
        

    },

    clearFields(transaction){
        Form.description.value = ""
        Form.amount.value = ""
        Form.date.value = ""
    },

    submit(event){
        event.preventDefault()
        
        try{          
        Form.ValidateField()
        // Formatar os dados para salvar
        const transaction = Form.formatData()
        // Salvar
        Form.saveTransaction(transaction)
        // Apagar os dados do formulário
        Form.clearFields(transaction)
        //fechar modal 
        Modal.close()
        //atualizar a aplicação
        App.reload()

        }catch(error){
            alert(error.message)

        }

    },
}





App.init()


 