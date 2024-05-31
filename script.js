document.addEventListener('DOMContentLoaded', () => {
    const addRowBtn = document.getElementById('addRowBtn');
    const dataForm = document.getElementById('dataForm');
    const inputTable = document.getElementById('inputTable').getElementsByTagName('tbody')[0];
    const budgetInput = document.getElementById('budget');
    const totalExpensesElem = document.getElementById('totalExpenses');
    const remainingBudgetElem = document.getElementById('remainingBudget');
    const ctx = document.getElementById('pieChart').getContext('2d');
    
    let categories = [];
    let amounts = [];
    let totalBudget = 0;

    const pieChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: categories,
            datasets: [{
                data: amounts,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                    'rgba(201, 203, 207, 0.2)'  
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(201, 203, 207, 1)'  
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Expenses'
                }
            }
        },
    });
    

    
    const updateBudgetSummary = () => {
        categories = [];
        amounts = [];
        let totalExpenses = 0;

        const rows = inputTable.rows;

        for (let i = 0; i < rows.length; i++) {
            const categoryInput = rows[i].querySelector('input[name="category"]');
            const amountInput = rows[i].querySelector('input[name="amount"]');
            
            const category = categoryInput.value.trim();
            const amount = parseFloat(amountInput.value.trim());

            if (category && !isNaN(amount)) {
                categories.push(category);
                amounts.push(amount);
                totalExpenses += amount;
            }
        }

        totalBudget = parseFloat(budgetInput.value.trim()) || 0;
        const remainingBudget = totalBudget - totalExpenses;

        categories.push('Remaining Budget');
        amounts.push(remainingBudget);
        if (remainingBudget < 0) {
            reduceExpensesText.style.display = 'block';
        }
        else {
            reduceExpensesText.style.display = 'none';
        }
        totalExpensesElem.textContent = totalExpenses.toFixed(2);
        remainingBudgetElem.textContent = remainingBudget.toFixed(2);

        pieChart.data.labels = categories;
        pieChart.data.datasets[0].data = amounts;
        pieChart.update();
    };
   
    addRowBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const newRow = inputTable.insertRow();
        newRow.innerHTML = `
            <td><input type="text" name="category" placeholder="Category Name" required></td>
            <td><input type="number" name="amount" placeholder="Amount" required></td>
            <td><button type="button" class="deleteBtn">Delete</button></td>
        `;

        newRow.querySelector('.deleteBtn').addEventListener('click', () => {
            newRow.remove();
            updateBudgetSummary();
        });

        newRow.querySelector('input[name="amount"]').addEventListener('input', updateBudgetSummary);
        newRow.querySelector('input[name="category"]').addEventListener('input', updateBudgetSummary);
    });

    budgetInput.addEventListener('input', updateBudgetSummary);

    dataForm.addEventListener('submit', (e) => {
        e.preventDefault();
        updateBudgetSummary();
    });

    const newRow = inputTable.insertRow();
    newRow.innerHTML = `
        <td><input type="text" name="category" placeholder="Category Name" required></td>
        <td><input type="number" name="amount" placeholder="Amount" required></td>
        <td><button type="button" class="deleteBtn">Delete</button></td>
    `;
    newRow.querySelector('.deleteBtn').addEventListener('click', () => {
        newRow.remove();
        updateBudgetSummary();
    });

    newRow.querySelector('input[name="amount"]').addEventListener('input', updateBudgetSummary);
    newRow.querySelector('input[name="category"]').addEventListener('input', updateBudgetSummary);
});
