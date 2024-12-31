<script>
    import { createEventDispatcher } from 'svelte';

    export let betrag = '';
    export let kategorie = '';
    export let typ = 'Einnahme';
    export let datum = '';

    const dispatch = createEventDispatcher();

    function handleSubmit(event) {
        event.preventDefault();
        if (!betrag || isNaN(parseFloat(betrag))) {
            alert('Bitte geben Sie einen gültigen Betrag ein.');
            return;
        }
        if (!kategorie) {
            alert('Bitte geben Sie eine Kategorie ein.');
            return;
        }
        if (!datum) {
            alert('Bitte geben Sie ein Datum ein.');
            return;
        }

        const eventData = { betrag: parseFloat(betrag), kategorie, typ, datum };
        dispatch('hinzufuegen', eventData);

        // Formular zurücksetzen
        betrag = '';
        kategorie = '';
        typ = 'Einnahme';
        datum = '';
    }
</script>

<section>
    <h1>Neue Transaktion hinzufügen</h1>
    <form onsubmit={handleSubmit}>
        <div>
            <label for="betrag">Betrag</label>
            <input id="betrag" type="number" bind:value={betrag} required />
        </div>
        <div>
            <label for="kategorie">Kategorie</label>
            <input id="kategorie" type="text" bind:value={kategorie} required />
        </div>
        <div>
            <label for="typ">Typ</label>
            <select id="typ" bind:value={typ}>
                <option value="Einnahme">Einnahme</option>
                <option value="Ausgabe">Ausgabe</option>
            </select>
        </div>
        <div>
            <label for="datum">Datum</label>
            <input id="datum" type="date" bind:value={datum} required />
        </div>
        <button type="submit">Hinzufügen</button>
    </form>
</section>

<style>
form {
    display: flex;
    flex-direction: column;
    gap: 10px; /* Abstände zwischen den Feldern */
}

input, select {
    font-size: 14px; /* Einheitliche Schriftgröße */
    color: #203a43; /* Konsistente Schriftfarbe */
}

</style>
    