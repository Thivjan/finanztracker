<script>
    import { onMount } from "svelte"; // Lifecycle-Methode für Initialisierungen.
    import { Chart, registerables } from "chart.js"; // Import von Chart.js.
    Chart.register(...registerables); // Registriert alle benötigten Chart.js-Module.

    export let data; // Eingabedaten, die von einer übergeordneten Komponente übergeben werden.

    let transaktionen = []; // Liste aller Transaktionen in flacher Form.
    let filteredData = []; // Transaktionen, die durch Filter angezeigt werden.
    let selectedCategory = ""; // Kategorie-Filter.
    let selectedMonth = ""; // Monat-Filter.
    let selectedType = ""; // Typ-Filter (Einnahme oder Ausgabe).
    let chartType = "bar"; // Standardmäßig: Balkendiagramm.
    let chartInstance; // Referenz auf das aktive Diagramm-Objekt.

    let normalizedCategories = []; // Einzigartige Kategorien für den Filter.
    let transactionTypes = ["Einnahme", "Ausgabe"]; // Mögliche Transaktionstypen.

    let saldo = 0; // Saldo (Einnahmen - Ausgaben).

    // Wird ausgeführt, sobald die Komponente geladen ist.
    onMount(() => {
        // Flache Transaktionsstruktur und ISO-Datum sicherstellen.
        transaktionen = flattenTransactions(data.transaktionen).map((t) => ({
            ...t,
            datum: formatToISODate(t.datum),
        }));
        normalizedCategories = getNormalizedCategories(transaktionen); // Einzigartige Kategorien sammeln.
        filteredData = [...transaktionen]; // Alle Daten initial anzeigen.
        calculateSaldo(); // Saldo berechnen.
        createChart(); // Diagramm erstellen.
    });

    // Konvertiert verschachtelte Transaktionen in eine flache Liste.
    function flattenTransactions(transactions) {
        return transactions.flatMap((t) =>
            t.transaktionen ? t.transaktionen : [t]
        );
    }

    // Gibt eine Liste einzigartiger Kategorien zurück.
    function getNormalizedCategories(transactions) {
        const uniqueCategories = new Set(
            transactions.map((t) =>
                t.kategorie.toLowerCase().split(" ")[0] // Kategorien aufteilen und normalisieren.
            )
        );
        return [...uniqueCategories];
    }

    // Formatiert ein Datum ins ISO-Format (YYYY-MM-DD).
    function formatToISODate(date) {
        if (!date.includes("-")) { // Prüft, ob das Datum im deutschen Format ist.
            const [day, month, year] = date.split(".");
            return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
        }
        return date; // Wenn bereits im ISO-Format, zurückgeben.
    }

    // Berechnet den Saldo aus Einnahmen und Ausgaben.
    function calculateSaldo() {
        const totalEinnahmen = filteredData
            .filter((t) => t.typ === "Einnahme") // Nur Einnahmen filtern.
            .reduce((sum, t) => sum + t.betrag, 0); // Summe der Einnahmen berechnen.
        const totalAusgaben = filteredData
            .filter((t) => t.typ === "Ausgabe") // Nur Ausgaben filtern.
            .reduce((sum, t) => sum + t.betrag, 0); // Summe der Ausgaben berechnen.
        saldo = totalEinnahmen - totalAusgaben; // Saldo berechnen.
    }

    // Filtert die Daten basierend auf den ausgewählten Kriterien.
    function filterData() {
        filteredData = transaktionen.filter((t) => {
            const matchesCategory =
                !selectedCategory ||
                t.kategorie.toLowerCase().startsWith(selectedCategory.toLowerCase()); // Kategorie vergleichen.
            const matchesMonth =
                !selectedMonth || t.datum.startsWith(selectedMonth); // Monat vergleichen.
            const matchesType =
                !selectedType || t.typ === selectedType; // Typ vergleichen.
            return matchesCategory && matchesMonth && matchesType;
        });
        calculateSaldo(); // Aktualisiert den Saldo nach dem Filtern.
        createChart(); // Aktualisiert das Diagramm.
    }

    // Generiert eine Farbe für jede Kategorie.
    const categoryColors = {};
    function getCategoryColor(category, opacity = 1) {
        if (!categoryColors[category]) {
            // Zufällige Farbe generieren, wenn nicht vorhanden.
            const r = Math.floor(Math.random() * 256);
            const g = Math.floor(Math.random() * 256);
            const b = Math.floor(Math.random() * 256);
            categoryColors[category] = `rgba(${r}, ${g}, ${b}, ${opacity})`;
        }
        return categoryColors[category].replace(/0.2|1/, opacity);
    }

    // Erstellt oder aktualisiert ein Diagramm basierend auf den gefilterten Daten.
    function createChart() {
        const ctx = document.getElementById("chart").getContext("2d");
        if (chartInstance) chartInstance.destroy(); // Vorheriges Diagramm löschen.

        // Daten und Kategorien für das Diagramm vorbereiten.
        const categories = [...new Set(filteredData.map((t) => t.kategorie))];
        const data = categories.map((category) =>
            filteredData
                .filter((t) => t.kategorie === category)
                .reduce((sum, t) => sum + t.betrag, 0)
        );

        const backgroundColors = categories.map((category) => getCategoryColor(category, 0.2));
        const borderColors = categories.map((category) => getCategoryColor(category, 1));

        chartInstance = new Chart(ctx, {
            type: chartType, // Diagrammtyp (z. B. bar oder pie).
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
                responsive: true, // Diagramm passt sich an die Fenstergröße an.
                plugins: { legend: { display: true } },
                scales: chartType === "bar" ? { y: { beginAtZero: true } } : {}, // Achsenoptionen für Balkendiagramm.
            },
        });
    }
</script>

<div class="container">
    <h2>Budgetübersicht</h2>
    <!-- Filtersektion -->
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

    <!-- Tabelle der Transaktionen -->
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

    <!-- Diagramm -->
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
