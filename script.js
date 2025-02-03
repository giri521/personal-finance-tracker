const form = document.getElementById('finance-form');
const descriptionInput = document.getElementById('description');
const amountInput = document.getElementById('amount');
const typeInput = document.getElementById('type');
const monthlySavingsText = document.getElementById('monthly-savings');
const pieChartCanvas = document.getElementById('pie-chart');
const toggleThemeButton = document.getElementById('toggle-theme');

let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
let monthlySavings = 0;

function updateSavings() {
    monthlySavings = transactions.reduce((acc, transaction) => {
        if (transaction.type === 'income') {
            return acc + transaction.amount;
        } else {
            return acc - transaction.amount;
        }
    }, 0);

    monthlySavingsText.innerText = `$${monthlySavings.toFixed(2)}`;
    updatePieChart();
}

function updatePieChart() {
    const incomes = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
    const expenses = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
    const data = {
        labels: ['Income', 'Expense'],
        datasets: [{
            data: [incomes, expenses],
            backgroundColor: ['#36A2EB', '#FF6384'],
            hoverBackgroundColor: ['#36A2EB', '#FF6384']
        }]
    };
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            tooltip: {
                callbacks: {
                    label: function(tooltipItem) {
                        return `$${tooltipItem.raw.toFixed(2)}`;
                    }
                }
            }
        }
    };

    new Chart(pieChartCanvas, {
        type: 'pie',
        data: data,
        options: options
    });
}

function saveTransactions() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

form.addEventListener('submit', function(event) {
    event.preventDefault();

    const description = descriptionInput.value;
    const amount = parseFloat(amountInput.value);
    const type = typeInput.value;

    if (description && !isNaN(amount)) {
        const transaction = { description, amount, type };
        transactions.push(transaction);
        saveTransactions();
        updateSavings();

        descriptionInput.value = '';
        amountInput.value = '';
    }
});

toggleThemeButton.addEventListener('click', function() {
    document.body.classList.toggle('dark-mode');
});

updateSavings();
