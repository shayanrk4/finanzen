document.addEventListener('DOMContentLoaded', function() {
    // Aktualisierungszeit anzeigen
    document.getElementById('update-time').textContent = new Date().toLocaleString('de-DE');
    
    // Filter-Buttons
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            loadInvestments(this.dataset.category);
        });
    });
    
    // Initial alle Anlagen laden
    loadInvestments('all');
});

async function loadInvestments(category) {
    const container = document.querySelector('.investments-container');
    container.innerHTML = '<p>Daten werden geladen...</p>';
    
    try {
        let url = 'http://localhost:5000/api/investments';
        if (category !== 'all') {
            url += `?category=${category}`;
        }
        
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.error) {
            container.innerHTML = `<p class="error">${data.error}</p>`;
            return;
        }
        
        container.innerHTML = '';
        data.data.forEach(investment => {
            const card = document.createElement('div');
            card.className = 'investment-card';
            card.innerHTML = `
                <h3>${investment.name} (${investment.symbol})</h3>
                <p>${investment.info}</p>
                <div class="chart-container">
                    <canvas id="chart-${investment.symbol}"></canvas>
                </div>
            `;
            container.appendChild(card);
            
            // Chart erstellen
            createChart(`chart-${investment.symbol}`, investment.symbol);
        });
        
    } catch (error) {
        container.innerHTML = `
            <div class="error">
                <p>Fehler beim Laden der Daten</p>
                <button onclick="loadInvestments('${category}')">Erneut versuchen</button>
            </div>
        `;
    }
}

function createChart(canvasId, symbol) {
    fetch(`http://localhost:5000/api/history/${symbol}`)
        .then(response => response.json())
        .then(data => {
            const ctx = document.getElementById(canvasId).getContext('2d');
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: data.history.map(item => item.date),
                    datasets: [{
                        label: symbol,
                        data: data.history.map(item => item.value),
                        borderColor: '#3498db',
                        tension: 0.1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        }
                    }
                }
            });
        });
}
