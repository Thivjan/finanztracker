<script>
    // Empfängt Daten vom Server, die als Prop übergeben werden.
    let {data} = $props(); 

    // Initialisiert die Sparziele und die Variable für das aktuell bearbeitete Sparziel.
    let savingGoals = data?.savingGoals; 
    let editGoal = $state(); // Bearbeitungsmodus für ein Ziel.

    // Debugging-Ausgabe, um die geladenen Sparziele zu überprüfen.
    console.log("DEBUG: Sparziele geladen:", savingGoals);
</script>

<div class="container">
    <h1>Sparziele</h1>

    <!-- Überprüft, ob Sparziele vorhanden sind. -->
    {#if savingGoals && savingGoals.length > 0}
        <!-- Tabelle zur Darstellung der Sparziele. -->
        <table class="sparziel-table">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Zielbetrag</th>
                    <th>Aktueller Betrag</th>
                    <th>Fehlender Betrag</th>
                    <th>Enddatum</th>
                    <th>Aktionen</th>
                </tr>
            </thead>
            <tbody>
                {#each savingGoals as ziel}
                    <tr>
                        <td>{ziel.name}</td>
                        <td>{ziel.zielBetrag.toFixed(2)} CHF</td>
                        <td>{ziel.aktuellerBetrag.toFixed(2)} CHF</td>
                        <td>{(ziel.zielBetrag - ziel.aktuellerBetrag).toFixed(2)} CHF</td>
                        <td>{ziel.endDatum || "Kein Datum"}</td>
                        <td>
                            <!-- Formular zum Löschen eines Ziels. -->
                            <form method="POST" action="?/delete" class="delete-form">
                                <input type="hidden" name="id" value={ziel._id} />
                                <button type="submit" class="delete-button">Löschen</button>
                            </form>
                            <!-- Button, um ein Ziel zu bearbeiten. -->
                            <button onclick={() => editGoal = ziel}>Bearbeiten</button>
                        </td>
                    </tr>
                {/each}
            </tbody>
        </table>
    {:else}
        <!-- Nachricht, wenn keine Sparziele vorhanden sind. -->
        <p>Keine Sparziele vorhanden.</p>
    {/if}

    <!-- Bearbeitungsformular, wenn ein Ziel ausgewählt wurde. -->
    {#if editGoal}
        <h1>Sparziel bearbeiten</h1>
        <form method="POST" action="?/update">
            <input type="hidden" name="id" value={editGoal._id} />
            <label for="edit-name">Name:</label>
            <input id="edit-name" type="text" name="name" bind:value={editGoal.name} required />

            <label for="edit-zielbetrag">Zielbetrag:</label>
            <input id="edit-zielbetrag" type="number" name="zielBetrag" bind:value={editGoal.zielBetrag} required />

            <label for="edit-aktuellerbetrag">Aktueller Betrag:</label>
            <input id="edit-aktuellerbetrag" type="number" name="aktuellerBetrag" bind:value={editGoal.aktuellerBetrag} required />

            <label for="edit-enddatum">Enddatum:</label>
            <input id="edit-enddatum" type="date" name="endDatum" bind:value={editGoal.endDatum} />

            <button type="submit">Speichern</button>
        </form>
    {/if}

    <!-- Formular zum Hinzufügen eines neuen Sparziels. -->
    <h1>Neues Sparziel hinzufügen</h1>
    <form class="sparziel-form" method="POST" action="?/add">
        <label for="new-name">Name:</label>
        <input id="new-name" type="text" name="name" required />

        <label for="new-zielbetrag">Zielbetrag:</label>
        <input id="new-zielbetrag" type="number" name="zielBetrag" required />

        <label for="new-aktuellerbetrag">Aktueller Betrag:</label>
        <input id="new-aktuellerbetrag" type="number" name="aktuellerBetrag" required />

        <label for="new-enddatum">Enddatum:</label>
        <input id="new-enddatum" type="date" name="endDatum" />

        <button type="submit">Hinzufügen</button>
    </form>

    <!-- Formular zum Löschen aller Sparziele. -->
    <form method="POST" action="?/deleteAll" class="delete-all">
        <button type="submit" class="delete-all-button">Alle löschen</button>
    </form>
</div>

<style>
    /* Zentrierte Nachricht. */
    p {
        text-align: center;
    }

    /* Allgemeine Container-Einstellungen. */
    .container {
        max-width: 900px;
        margin: auto;
        padding: 20px;
    }

    /* Tabellenstil für die Sparziele. */
    .sparziel-table {
        width: 100%;
        border-collapse: collapse;
        margin: 20px 0;
        text-align: center;
    }

    /* Zellenabstand und Rahmenfarbe. */
    th, td {
        padding: 10px;
        border: 1px solid #ddd;
    }

    /* Tabellenkopf-Hintergrundfarbe. */
    th {
        background-color: rgb(212, 143, 117);
        color: white;
    }

    /* Stil für Buttons. */
    button {
        width: 120px;
        height: 40px;
    }

    /* Hover-Effekt für Buttons. */
    button:hover {
        background-color: rgb(212, 100, 100);
    }

    /* Entfernt Rahmen und Schatten für spezielle Formulare. */
    form.delete-all,
    form.delete-form {
        background-color: transparent;
        box-shadow: none;
    }
</style>
