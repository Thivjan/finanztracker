<script>
    import { createEventDispatcher } from 'svelte'; // Ereignis-Dispatcher erstellen.

    export let betrag = ''; // Betrag initialisieren.
    export let kategorie = ''; // Kategorie initialisieren.
    export let typ = 'Einnahme'; // Typ mit Standardwert initialisieren.
    export let datum = ''; // Datum initialisieren.

    const dispatch = createEventDispatcher(); // Dispatcher-Funktion erstellen.

    function handleSubmit(event) {
        event.preventDefault(); // Standard-Formularaktion verhindern.
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

        const eventData = { betrag: parseFloat(betrag), kategorie, typ, datum }; // Event-Daten sammeln.
        dispatch('hinzufuegen', eventData); // Custom-Event mit Daten auslösen.

        // Formularwerte zurücksetzen.
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
            <input id="betrag" type="number" bind:value={betrag} required /> <!-- Betrag binden. -->
        </div>
        <div>
            <label for="kategorie">Kategorie</label>
            <input id="kategorie" type="text" bind:value={kategorie} required /> <!-- Kategorie binden. -->
        </div>
        <div>
            <label for="typ">Typ</label>
            <select id="typ" bind:value={typ}> <!-- Typ auswählen. -->
                <option value="Einnahme">Einnahme</option>
                <option value="Ausgabe">Ausgabe</option>
            </select>
        </div>
        <div>
            <label for="datum">Datum</label>
            <input id="datum" type="date" bind:value={datum} required /> <!-- Datum binden. -->
        </div>
        <button type="submit">Hinzufügen</button> <!-- Button zum Absenden. -->
    </form>
</section>

<style>
form {
    display: flex; /* Flexibles Layout für das Formular. */
    flex-direction: column; /* Felder vertikal anordnen. */
    gap: 10px; /* Abstände zwischen den Feldern. */
}

input, select {
    font-size: 14px; /* Einheitliche Schriftgröße. */
    color: #203a43; /* Konsistente Schriftfarbe. */
}
</style>
