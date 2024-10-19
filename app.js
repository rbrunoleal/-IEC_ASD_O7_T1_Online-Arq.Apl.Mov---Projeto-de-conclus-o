// app.js
const expenseForm = document.getElementById('expense-form');
const expenseList = document.getElementById('expense-list');
const totalOriginElement = document.getElementById('total-origin');
const totalDestinationElement = document.getElementById('total-destination');
const originCurrency = document.getElementById('origin-currency');
const destinationCurrency = document.getElementById('destination-currency');
let expenses = [];
let isEdit = false;
let editIndex = null;

expenseForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const description = document.getElementById('description').value;
    const quantity = parseInt(document.getElementById('quantity').value);
    const value = parseFloat(document.getElementById('value').value);
    const currencyFrom = document.getElementById('currency-from').value;
    const currencyTo = document.getElementById('currency-to').value;
    const convertedValue = await convertCurrency(value, currencyFrom, currencyTo);

    if (isEdit) {
        expenses[editIndex] = { description, quantity, value, currencyFrom, currencyTo, convertedValue };
        isEdit = false;
        editIndex = null;
    } else {
        expenses.push({ description, quantity, value, currencyFrom, currencyTo, convertedValue });
    }

    updateList();
    expenseForm.reset();
});

const updateList = () => {
    expenseList.innerHTML = '';
    let totalOrigin = 0;
    let totalDestination = 0;
    expenses.forEach((expense, index) => {
        const li = document.createElement('li');
        li.style.backgroundColor = '#d3d3d3'; // Aplicando cor de fundo cinza mais escuro
        li.innerHTML = `
            ${expense.description} (x${expense.quantity}) - ${expense.value} ${expense.currencyFrom} (Converted: ${expense.convertedValue.toFixed(2)} ${expense.currencyTo})
            <div>
                <button class="icon-button" onclick="editExpense(${index})">✏️</button>
                <button class="icon-button" onclick="deleteExpense(${index})">🗑️</button>
            </div>
        `;
        expenseList.appendChild(li);
        totalOrigin += expense.value;
        totalDestination += expense.convertedValue;
    });
    totalOriginElement.textContent = totalOrigin.toFixed(2);
    originCurrency.textContent = expenses.length > 0 ? expenses[0].currencyFrom : 'USD';
    totalDestinationElement.textContent = totalDestination.toFixed(2);
    destinationCurrency.textContent = expenses.length > 0 ? expenses[0].currencyTo : 'BRL';
};

const editExpense = (index) => {
    const expense = expenses[index];
    document.getElementById('description').value = expense.description;
    document.getElementById('quantity').value = expense.quantity;
    document.getElementById('value').value = expense.value;
    document.getElementById('currency-from').value = expense.currencyFrom;
    document.getElementById('currency-to').value = expense.currencyTo;
    isEdit = true;
    editIndex = index;
};

const deleteExpense = (index) => {
    expenses.splice(index, 1);
    updateList();
};

const convertCurrency = async (value, currencyFrom, currencyTo) => {
    const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${currencyFrom}`);
    const data = await response.json();
    const rate = data.rates[currencyTo];
    return value * rate;
};
