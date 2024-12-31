<script>
    import { createEventDispatcher } from 'svelte';
    export let transaktionen = [];
    const dispatch = createEventDispatcher();

    function loescheEinzeln(id) {
        dispatch('loeschenEinzeln', id);
    }

    async function speichereTransaktionen() {
        try {
            const response = await fetch('/api/savetransactions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(transaktionen),
            });

            const result = await response.json();
            if (result.success) {
                alert('Transaktionen erfolgreich gespeichert!');
            } else {
                alert(result.error || 'Fehler beim Speichern der Transaktionen.');
            }
        } catch (error) {
            console.error('Fehler beim Speichern:', error);
            alert('Serverfehler beim Speichern.');
        }
    }
</script>

<section>
    <h1>Transaktionen</h1>
    <table>
        <thead>
            <tr>
                <th>Betrag</th>
                <th>Kategorie</th>
                <th>Typ</th>
                <th>Datum</th>
                <th>Aktionen</th>
            </tr>
        </thead>
        <tbody>
            {#if transaktionen.length > 0}
                {#each transaktionen as t}
                    <tr>
                        <td>{t.betrag.toFixed(2)} CHF</td>
                        <td>{t.kategorie}</td>
                        <td>{t.typ}</td>
                        <td>{t.datum}</td>
                        <td>
                            <button onclick={() => loescheEinzeln(t._id)}>Löschen</button>
                        </td>
                    </tr>
                {/each}
            {:else}
                <tr>
                    <td colspan="5">Keine Transaktionen vorhanden</td>
                </tr>
            {/if}
        </tbody>
    </table>
    </section>

<style>
table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 20px;
}

th, td {
    padding: 10px;
    text-align: center;
    border: 1px solid; /* Die Rahmenfarbe könnte durch eine spezifische Farbe ersetzt werden */
}

button {
    background: rgb(212, 143, 117);
    color: #fff;
    border: none;
    padding: 10px;
    border-radius: 5px;
    cursor: pointer;
    transition: transform 0.3s; /* Sanfter Übergang hinzugefügt */
}

button:hover {
    background: #e76f51;
    transform: scale(1.05);
}

</style>
