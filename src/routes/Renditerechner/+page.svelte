<script>
    let initialInvestment = 0;
    let annualReturn = 0;
    let years = 0;
    let finalAmount = "0";

    const calculateReturn = () => {
        if (initialInvestment > 0 && annualReturn > 0 && years > 0) {
            finalAmount = (initialInvestment * Math.pow(1 + annualReturn / 100, years)).toFixed(2);
        } else {
            finalAmount = "0";
        }
    };

    const formatInput = (event) => {
        let value = event.target.value;
        value = value.replace(/^0+/, ''); // Entferne führende Nullen
        if (!value) value = 0; // Falls leer, setze auf 0
        event.target.value = value;
    };
</script>

<div class="container my-5">
    <p class="text-center text-light">
        Mit dem Renditerechner kannst du berechnen, wie sich dein Ertrag entwickeln könnte, basierend auf deinem
        Startkapital, der gewünschten jährlichen Rendite und dem Anlagehorizont. Erhalte eine einfache Vorstellung
        davon, wie sich dein Kapital in der Zukunft entwickeln kann.
    </p>

    <div class="calculator-container bg-dark text-light p-4 rounded shadow-lg">
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

        <button class="btn btn-warning w-100" onclick={calculateReturn}>Berechnen</button>
    </div>

    {#if finalAmount > 0}
        <div class="result-container bg-light text-dark mt-4 p-4 rounded shadow-lg">
            <h3 class="text-center text-warning">Ergebnis:</h3>
            <p class="text-center">
                Nach {years} Jahren beträgt dein Kapital: <strong>CHF {finalAmount}</strong>
            </p>
        </div>
    {/if}
</div>
