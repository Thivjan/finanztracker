<script>
    // Variablen für Benutzerangaben und Berechnungsergebnis.
    let initialInvestment = 0; // Startkapital.
    let annualReturn = 0; // Jährliche Rendite in Prozent.
    let years = 0; // Anlagehorizont in Jahren.
    let finalAmount = "0"; // Ergebnis der Berechnung.

    // Berechnet den zukünftigen Wert basierend auf der Formel für Zinseszinsen.
    const calculateReturn = () => {
    if (initialInvestment > 0 && annualReturn > 0 && years > 0) {
        let finalAmount = initialInvestment;
        for (let i = 0; i < years; i++) {
            finalAmount *= (1 + annualReturn / 100); // Zuwachs für jedes Jahr
        }
        return finalAmount.toFixed(2); // Ergebnis formatieren
    } else {
        return "0"; // Ungültige Eingaben
    }
};


    // Formatiert Benutzereingaben, entfernt führende Nullen und setzt leere Felder auf 0.
    const formatInput = (event) => {
        let value = event.target.value;
        value = value.replace(/^0+/, ''); // Entfernt führende Nullen.
        if (!value) value = 0; // Falls leer, Wert auf 0 setzen.
        event.target.value = value;
    };
</script>

<div class="container my-5">
    <!-- Einführungstext zum Renditerechner -->
    <p class="text-center text-light">
        Mit dem Renditerechner kannst du berechnen, wie sich dein Ertrag entwickeln könnte, basierend auf deinem
        Startkapital, der gewünschten jährlichen Rendite und dem Anlagehorizont. Erhalte eine einfache Vorstellung
        davon, wie sich dein Kapital in der Zukunft entwickeln kann.
    </p>

    <!-- Rechner-Eingaben -->
    <div class="calculator-container bg-dark text-light p-4 rounded shadow-lg">
        <!-- Eingabe für Startkapital -->
        <div class="mb-3">
            <label for="investment" class="form-label">Startkapital:</label>
            <input
                type="number"
                id="investment"
                class="form-control"
                bind:value={initialInvestment}
                oninput={formatInput}
                placeholder="z.B. 10000"
            />
        </div>

        <!-- Eingabe für jährliche Rendite -->
        <div class="mb-3">
            <label for="return" class="form-label">Jährliche Rendite (%):</label>
            <input
                type="number"
                id="return"
                class="form-control"
                bind:value={annualReturn}
                oninput={formatInput}
                placeholder="z.B. 5"
            />
        </div>

        <!-- Eingabe für Anlagehorizont -->
        <div class="mb-3">
            <label for="years" class="form-label">Anlagehorizont (Jahre):</label>
            <input
                type="number"
                id="years"
                class="form-control"
                bind:value={years}
                oninput={formatInput}
                placeholder="z.B. 10"
            />
        </div>

        <!-- Berechnungsbutton -->
        <button class="btn btn-warning w-100" onclick={calculateReturn}>Berechnen</button>
    </div>

    <!-- Ergebnisanzeige -->
    {#if finalAmount > 0}
        <div class="result-container bg-light text-dark mt-4 p-4 rounded shadow-lg">
            <h3 class="text-center text-warning">Ergebnis:</h3>
            <p class="text-center">
                Nach {years} Jahren beträgt dein Kapital: <strong>CHF {finalAmount}</strong>
            </p>
        </div>
    {/if}
</div>
