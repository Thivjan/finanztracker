<script>
    let investmentType = "";
    let investmentAmount = 0;
    let distribution = null;

    const types = {
        konservativ: { Edelmetall: 50, Aktien: 10, Kryptowährungen: 10, Cash: 30 },
        ausgewogen: { Edelmetall: 25, Aktien: 25, Kryptowährungen: 25, Cash: 25 },
        dynamisch: { Edelmetall: 10, Aktien: 20, Kryptowährungen: 70, Cash: 0 },
    };

    const calculateDistribution = () => {
        if (types[investmentType] && investmentAmount > 0) {
            const allocations = types[investmentType];
            distribution = Object.entries(allocations).map(([key, percent]) => ({
                category: key,
                amount: ((percent / 100) * investmentAmount).toFixed(2),
            }));
        } else {
            distribution = null;
        }
    };
</script>

<div class="container my-5">
    <p class="text-center text-light">
        Viele Menschen wissen nicht, wie man ihr Geld anlegen kann. Die meisten
        kennen nur die klassischen Anlagemöglichkeiten wie das Sparkonto, das
        Tagesgeldkonto oder die typische 3a Säule. Dennoch gibt es viele weitere
        Anlagemöglichkeiten, die sich lohnen können und das Kapital vermehren
        können. Wichtig ist es, sich gut zu recherchieren und sich gut zu
        informieren. Genau so wichtig ist es, dass man weiß, welcher Anlegertyp
        man ist und wieviel man bereit ist zu investieren.
    </p>

    <p class="text-center text-light">
        Hier kannst du eine Anlagestrategie erhalten, welche zu deinem
        Risikotyp passt. Du kannst dich zwischen konservativ, ausgewogen und
        dynamisch entscheiden. Du siehst dann die Aufteilung deiner
        Anlagestrategie und wie dein Geld investiert werden sollte. Wichtig: Die
        Aufteilung habe ich selber erstellt und basiert rein von meiner
        Überzeugung und meines Wissen.
    </p>

    <p class="text-center text-light">
        Unten kannst du deinen Risikotyp auswählen und die Anlagestrategie
        erhalten. Die Anlagestrategie ist nur ein Vorschlag und kann von dir
        selber angepasst werden.
    </p>

    <div class="calculator-container bg-dark text-light p-4 rounded shadow-lg">
        <div class="mb-3">
            <label for="type" class="form-label">Wähle deinen Anlage-Typ aus:</label>
            <select id="type" class="form-select" bind:value={investmentType}>
                <option value="" disabled selected>-- Wähle --</option>
                <option value="konservativ">Konservativ</option>
                <option value="ausgewogen">Ausgewogen</option>
                <option value="dynamisch">Dynamisch</option>
            </select>
        </div>

        <div class="mb-3">
            <label for="amount" class="form-label">Deine Investitionssumme:</label>
            <input
                type="number"
                id="amount"
                class="form-control"
                placeholder="z.B. 10000"
                bind:value={investmentAmount}
            />
        </div>

        <button class="btn btn-warning w-100" on:click={calculateDistribution}>Berechnen</button>
    </div>

    {#if distribution}
        <div class="result-container bg-light text-dark mt-4 p-4 rounded shadow-lg">
            <h3 class="text-center text-warning">Aufteilung:</h3>
            <ul class="list-group">
                {#each distribution as { category, amount }}
                    <li class="list-group-item d-flex justify-content-between align-items-center">
                        {category}
                        <span class="badge bg-warning text-dark">CHF {amount}</span>
                    </li>
                {/each}
            </ul>
        </div>
    {/if}
</div>

<style>
    .result-container {
        max-width: 600px;
        margin: 0 auto;
    }
</style>
