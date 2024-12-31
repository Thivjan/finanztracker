<script>
    import { onMount } from "svelte";
    import { Chart, registerables } from "chart.js";
    Chart.register(...registerables);

    export let data; // Daten, die vom Server geladen werden
    let transaktionen = []; // Enthält die flachen Transaktionen
    let filteredData = []; // Enthält gefilterte Transaktionen
    let selectedCategory = "";
    let selectedMonth = "";
    let selectedType = ""; // Hinzugefügt: Typ-Filter
    let chartType = "bar";
    let chartInstance;

    let normalizedCategories = []; // Einzigartige Kategorien
    let transactionTypes = ["Einnahme", "Ausgabe"]; // Mögliche Typen für den Filter

    let saldo = 0; // Saldo-Wert

    onMount(() => {
        transaktionen = flattenTransactions(data.transaktionen).map((t) => ({
            ...t,
            datum: formatToISODate(t.datum), // ISO-Datumsformat sicherstellen
        }));
        normalizedCategories = getNormalizedCategories(transaktionen); // Einmalige Kategorien erzeugen
        filteredData = [...transaktionen]; // Alle Daten initial anzeigen
        calculateSaldo(); // Saldo initial berechnen
        createChart(); // Diagramm erstellen
    });

    function flattenTransactions(transactions) {
        return transactions.flatMap((t) =>
            t.transaktionen ? t.transaktionen : [t]
        );
    }

    function getNormalizedCategories(transactions) {
        const uniqueCategories = new Set(
            transactions.map((t) =>
                t.kategorie.toLowerCase().split(" ")[0]
            )
        );
        return [...uniqueCategories];
    }

    function formatToISODate(date) {
        if (!date.includes("-")) {
            const [day, month, year] = date.split(".");
            return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
        }
        return date;
    }

    function calculateSaldo() {
        const totalEinnahmen = filteredData
            .filter((t) => t.typ === "Einnahme")
            .reduce((sum, t) => sum + t.betrag, 0);
        const totalAusgaben = filteredData
            .filter((t) => t.typ === "Ausgabe")
            .reduce((sum, t) => sum + t.betrag, 0);
        saldo = totalEinnahmen - totalAusgaben;
    }

    function filterData() {
        filteredData = transaktionen.filter((t) => {
            const matchesCategory =
                !selectedCategory ||
                t.kategorie.toLowerCase().startsWith(selectedCategory.toLowerCase());
            const matchesMonth =
                !selectedMonth || t.datum.startsWith(selectedMonth);
            const matchesType =
                !selectedType || t.typ === selectedType;
            return matchesCategory && matchesMonth && matchesType;
        });
        calculateSaldo(); // Saldo aktualisieren
        createChart();
    }

    const categoryColors = {};
    function getCategoryColor(category, opacity = 1) {
        if (!categoryColors[category]) {
            const r = Math.floor(Math.random() * 256);
            const g = Math.floor(Math.random() * 256);
            const b = Math.floor(Math.random() * 256);
            categoryColors[category] = `rgba(${r}, ${g}, ${b}, ${opacity})`;
        }
        return categoryColors[category].replace(/0.2|1/, opacity);
    }

    function createChart() {
        const ctx = document.getElementById("chart").getContext("2d");
        if (chartInstance) chartInstance.destroy();

        const categories = [...new Set(filteredData.map((t) => t.kategorie))];
        const data = categories.map((category) =>
            filteredData
                .filter((t) => t.kategorie === category)
                .reduce((sum, t) => sum + t.betrag, 0)
        );

        const backgroundColors = categories.map((category) => getCategoryColor(category, 0.2));
        const borderColors = categories.map((category) => getCategoryColor(category, 1));

        chartInstance = new Chart(ctx, {
            type: chartType,
            data: {
                labels: categories,
                datasets: [
                    {
                        label: "Beträge (CHF)",
                        data,
                        backgroundColor: backgroundColors,
                        borderColor: borderColors,
                        borderWidth: 1
                    },
                ],
            },
            options: {
                responsive: true,
                plugins: { legend: { display: true } },
                scales: chartType === "bar" ? { y: { beginAtZero: true } } : {},
            },
        });
    }
</script>

<div class="container">
    <h2>Budgetübersicht</h2>
    <div class="filter">
        <label for="category">Kategorie:</label>
        <select id="category" bind:value={selectedCategory} onchange={filterData}>
            <option value="">Alle</option>
            {#each normalizedCategories as category}
                <option value={category}>{category}</option>
            {/each}
        </select>

        <label for="type">Typ:</label>
        <select id="type" bind:value={selectedType} onchange={filterData}>
            <option value="">Alle</option>
            {#each transactionTypes as type}
                <option value={type}>{type}</option>
            {/each}
        </select>

        <label for="month">Monat:</label>
        <input
            id="month"
            type="month"
            bind:value={selectedMonth}
            onchange={filterData}
        />
    </div>
    </div>

    <table>
        <thead>
            <tr>
                <th onclick={() => toggleSort("betrag")}>Betrag</th>
                <th onclick={() => toggleSort("kategorie")}>Kategorie</th>
                <th onclick={() => toggleSort("typ")}>Typ</th>
                <th onclick={() => toggleSort("datum")}>Datum</th>
            </tr>
        </thead>
        <tbody>
            {#each filteredData as t, index}
                <tr>
                    <td>{t.betrag.toFixed(2)} CHF</td>
                    <td>{t.kategorie}</td>
                    <td>{t.typ}</td>
                    <td>{t.datum}</td>
                </tr>
            {/each}
        </tbody>
        <tfoot>
            <tr>
                <td colspan="4" style="text-align: right; font-weight: bold;">
                    Saldo: {saldo.toFixed(2)} CHF
                </td>
            </tr>
        </tfoot>
    </table>
    
    <div class="card shadow-lg mt-4">
        <div class="card-header bg-gradient-primary text-white d-flex justify-content-center align-items-center">
            <h5 class="mb-0">Diagramm</h5>
            <i class="bi bi-graph-up ms-2"></i>
        </div>
        <div class="card-body">
            <div class="d-flex justify-content-between align-items-center mb-3">
                <label for="chartType" class="form-label fw-bold">Diagrammtyp:</label>
                <select id="chartType" class="form-select w-auto" bind:value={chartType} onchange={createChart}>
                    <option value="bar">Balkendiagramm</option>
                    <option value="pie">Kuchendiagramm</option>
                </select>
            </div>
            <div class="text-center">
                <canvas id="chart" class="p-3 border rounded" style="max-width: 100%;"></canvas>
            </div>
        </div>
    </div>
    
    <style>
        h5 {
            text-align: center;
            color: rgb(212, 143, 117);
        }
        h2 {
            margin-top: 20px;
        }
    
        .container {
            max-width: 900px;
        }
    
        .filter {
            margin-bottom: 20px;
            display: flex;
            justify-content: space-between;
        }
        select, input {
            padding: 8px;
            border: 1px solid #ccc;
            border-radius: 5px;
            margin-right: 10px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        th, td {
            padding: 10px;
            text-align: center;
            border: 1px solid #ddd;
        }
        th {
            background-color: rgb(212, 143, 117);
        }
    </style>
    