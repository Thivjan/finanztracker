<script>
    import { onMount } from "svelte"; // Lifecycle-Methode für Initialisierungen.
    import { Chart, registerables } from "chart.js"; // Import von Chart.js.
    Chart.register(...registerables); // Registriert alle benötigten Chart.js-Module.

    let { data } = $props(); // Eingabedaten, die von einer übergeordneten Komponente übergeben werden.

    let transaktionen = $state([]); // Liste aller Transaktionen in flacher Form.
    let filteredData = $state([]); // Transaktionen, die durch Filter angezeigt werden.
    let selectedCategory = $state(""); // Kategorie-Filter.
    let selectedMonth = $state(""); // Monat-Filter.
    let selectedType = $state(""); // Typ-Filter (Einnahme oder Ausgabe).
    let chartType = $state("bar"); // Standardmäßig: Balkendiagramm.
    let chartInstance; // Referenz auf das aktive Diagramm-Objekt.

    let normalizedCategories = $state([]); // Einzigartige Kategorien für den Filter.
    let transactionTypes = $state(["Einnahme", "Ausgabe"]); // Mögliche Transaktionstypen.

    let saldo = $state(0); // Saldo (Einnahmen - Ausgaben).

    // Wird ausgeführt, sobald die Komponente geladen ist.
    onMount(() => {
        if (!data || !data.transaktionen) {
            console.error("Keine Transaktionsdaten verfügbar");
            return;
        }

        try {
            transaktionen = flattenTransactions(data.transaktionen).map((t) => ({
                ...t,
                datum: formatToISODate(t.datum),
            }));
            normalizedCategories = getNormalizedCategories(transaktionen);
            filteredData = [...transaktionen];
            calculateSaldo();
            createChart();
        } catch (error) {
            console.error("Fehler beim Initialisieren der Daten:", error);
        }
    });

    function flattenTransactions(transactions) {
        return transactions.flatMap((t) =>
            t.transaktionen ? t.transaktionen : [t]
        );
    }

    function getNormalizedCategories(transactions) {
        return [...new Set(
            transactions.map((t) =>
                t.kategorie.toLowerCase().split(" ")[0]
            )
        )];
    }

    function formatToISODate(date) {
        if (!date.includes("-")) {
            const [day, month, year] = date.split(".");
            return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
        }
        return date;
    }

    function calculateSaldo() {
        const { einnahmen, ausgaben } = filteredData.reduce(
            (totals, t) => {
                if (t.typ === "Einnahme") totals.einnahmen += t.betrag;
                else if (t.typ === "Ausgabe") totals.ausgaben += t.betrag;
                return totals;
            },
            { einnahmen: 0, ausgaben: 0 }
        );

        saldo = einnahmen - ausgaben;
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

        calculateSaldo();
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
        <input id="month" type="month" bind:value={selectedMonth} onchange={filterData} />
    </div>

    <table>
        <thead>
            <tr>
                <th>Betrag</th>
                <th>Kategorie</th>
                <th>Typ</th>
                <th>Datum</th>
            </tr>
        </thead>
        <tbody>
            {#each filteredData as t}
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
        <div class="card-header bg-gradient-primary text-white text-center">
            <h5>Diagramm</h5>
        </div>
        <div class="card-body">
            <label for="chartType" class="form-label fw-bold">Diagrammtyp:</label>
            <select id="chartType" class="form-select w-auto" bind:value={chartType} onchange={createChart}>
                <option value="bar">Balkendiagramm</option>
                <option value="pie">Kuchendiagramm</option>
            </select>
            <canvas id="chart"></canvas>
        </div>
    </div>
</div>

<style>
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
        margin-right: 10px;
        border-radius: 5px;
    }

    table {
        width: 100%;
        margin-top: 20px;
        border-collapse: collapse;
    }

    th, td {
        padding: 10px;
        text-align: center;
        border: 1px solid #ddd;
    }

    th {
        background-color: rgb(212, 143, 117);
    }

    .card {
        margin-top: 20px;
    }
</style>
