<script>
    import { createEventDispatcher } from 'svelte'; // Dispatcher für Ereignisse erstellen.
    export let transaktionen = []; // Liste der Transaktionen exportieren.
    const dispatch = createEventDispatcher(); // Dispatcher initialisieren.

    function loescheEinzeln(id) {
        dispatch('loeschenEinzeln', id); // Einzelne Transaktion löschen.
    }

    async function speichereTransaktionen() {
        try {
            const response = await fetch('/api/savetransactions', {
                method: 'POST', // Daten per POST senden.
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(transaktionen), // Transaktionen als JSON senden.
            });

            const result = await response.json();
            if (result.success) {
                alert('Transaktionen erfolgreich gespeichert!'); // Erfolgsmeldung.
            } else {
                alert(result.error || 'Fehler beim Speichern der Transaktionen.'); // Fehlermeldung.
            }
        } catch (error) {
            console.error('Fehler beim Speichern:', error); // Fehler in Konsole loggen.
            alert('Serverfehler beim Speichern.'); // Serverfehler melden.
        }
    }
</script>

<section>
    <h1>Transaktionen</h1>
    <table>
        <thead>
            <tr>
                <!-- Tabellenkopf mit Spaltenüberschriften -->
                <th>Betrag</th>
                <th>Kategorie</th>
                <th>Typ</th>
                <th>Datum</th>
                <th>Aktionen</th>
            </tr>
        </thead>
        <tbody>
            {#if transaktionen.length > 0}
                <!-- Iteration über Transaktionen -->
                {#each transaktionen as t}
                    <tr>
                        <td>{t.betrag.toFixed(2)} CHF</td> <!-- Betrag anzeigen -->
                        <td>{t.kategorie}</td> <!-- Kategorie anzeigen -->
                        <td>{t.typ}</td> <!-- Typ anzeigen -->
                        <td>{t.datum}</td> <!-- Datum anzeigen -->
                        <td>
                            <!-- Button zum Löschen -->
                            <button onclick={() => loescheEinzeln(t._id)}>Löschen</button>
                        </td>
                    </tr>
                {/each}
            {:else}
                <!-- Nachricht, wenn keine Transaktionen -->
                <tr>
                    <td colspan="5">Keine Transaktionen vorhanden</td>
                </tr>
            {/if}
        </tbody>
    </table>
</section>

<style>
table {
    width: 100%; /* Tabelle über gesamte Breite */
    border-collapse: collapse; /* Rahmen zusammenfassen */
    margin-bottom: 20px; /* Abstand nach unten */
}

th, td {
    padding: 10px; /* Innenabstand */
    text-align: center; /* Zentrierter Text */
    border: 1px solid; /* Tabellenrahmen */
}

button {
    background: rgb(212, 143, 117); /* Button-Hintergrund */
    color: #fff; /* Button-Textfarbe */
    border: none; /* Kein Rahmen */
    padding: 10px; /* Innenabstand */
    border-radius: 5px; /* Abgerundete Ecken */
    cursor: pointer; /* Zeiger auf Hand ändern */
    transition: transform 0.3s; /* Hover-Übergang */
}

button:hover {
    background: #e76f51; /* Hover-Farbe */
    transform: scale(1.05); /* Leichte Vergrößerung */
}
</style>
