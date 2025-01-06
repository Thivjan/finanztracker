<script>
    import { onMount } from "svelte"; // Lifecycle-Funktion für Initialisierungen.
    import Dashboard from "$lib/components/Dashboard.svelte"; // Dashboard-Komponente.
    import TransaktionenListe from "$lib/components/TransaktionenListe.svelte"; // Liste der Transaktionen.
    import Formular from "$lib/components/Formular.svelte"; // Formular zur Eingabe.

    // Reaktive Zustände für Ein- und Ausgaben sowie Transaktionen.
    let einnahmen = $state();
    let ausgaben = $state();
    let saldo = $state();
    let { transaktionen } = $props(); // Transaktionen aus den Props.
    let betrag = $state();
    let kategorie = $state();
    let typ = $state('Einnahme'); // Standardtyp: 'Einnahme'.
    let datum = $state();

    // Aktualisiert Summen für Einnahmen, Ausgaben und Saldo.
    function updateSummen() {
        einnahmen = 0;
        ausgaben = 0;
        transaktionen.forEach((t) => {
            if (t.typ === 'Einnahme') einnahmen += t.betrag; // Addiere Einnahmen.
            else if (t.typ === 'Ausgabe') ausgaben += t.betrag; // Addiere Ausgaben.
        });
        saldo = einnahmen - ausgaben; // Berechne den Saldo.
    }

    // Lädt Transaktionen beim Mounten der Komponente.
    onMount(async () => {
        await ladeTransaktionen();
    });

    // Ruft Transaktionen vom Server ab.
    async function ladeTransaktionen() {
        try {
            const response = await fetch('/api/savetransactions'); // API-Aufruf.
            const result = await response.json();
            if (result.success) {
                transaktionen = result.transactions; // Aktualisiere Transaktionen.
                updateSummen(); // Summen berechnen.
            } else {
                alert('Fehler beim Laden der Transaktionen.');
            }
        } catch (error) {
            console.error('Fehler beim Laden:', error);
        }
    }

    // Fügt eine neue Transaktion hinzu.
    async function transaktionHinzufügen(event) {
        const neueTransaktion = event.detail; // Detaildaten aus Event.
        try {
            const response = await fetch('/api/savetransactions', {
                method: 'POST', // POST-Methode für neuen Eintrag.
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(neueTransaktion),
            });

            const result = await response.json();
            if (result.success) {
                await ladeTransaktionen(); // Aktualisiere Seite nach Erfolg.
                alert('Transaktion erfolgreich gespeichert!');
            } else {
                alert(result.error || 'Fehler beim Speichern der Transaktion.');
            }
        } catch (error) {
            console.error('Fehler beim Speichern:', error);
            alert('Serverfehler beim Speichern.');
        }
    }

    // Löscht eine einzelne Transaktion anhand ihrer ID.
    async function transaktionLöschen(id) {
        try {
            const response = await fetch('/api/savetransactions', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ transactionId: id }),
            });

            const result = await response.json();
            if (result.success) {
                await ladeTransaktionen(); // Aktualisiere Seite nach Erfolg.
                alert('Transaktion erfolgreich gelöscht!');
            } else {
                alert(result.error || 'Fehler beim Löschen der Transaktion.');
            }
        } catch (error) {
            console.error('Fehler beim Löschen:', error);
            alert('Serverfehler beim Löschen.');
        }
    }

    // Löscht alle Transaktionen nach Bestätigung.
    async function alleTransaktionenLöschen() {
        if (confirm('Möchtest du wirklich alle Transaktionen löschen?')) {
            try {
                const response = await fetch('/api/savetransactions', {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ deleteAll: true }),
                });

                const result = await response.json();
                if (result.success) {
                    transaktionen = []; // Transaktionen leeren.
                    updateSummen(); // Summen zurücksetzen.
                    alert('Alle Transaktionen wurden erfolgreich gelöscht!');
                } else {
                    alert('Fehler beim Löschen aller Transaktionen.');
                }
            } catch (error) {
                console.error('Fehler beim Löschen aller Transaktionen:', error);
                alert('Serverfehler beim Löschen.');
            }
        }
    }
</script>

<div class="container">
    <!-- Dashboard mit Einnahmen, Ausgaben und Saldo. -->
    <Dashboard {einnahmen} {ausgaben} {saldo} />
    <!-- Liste der Transaktionen mit Löschfunktion. -->
    <TransaktionenListe {transaktionen} on:loeschenEinzeln={(event) => transaktionLöschen(event.detail)} />
    <!-- Formular zur Eingabe neuer Transaktionen. -->
    <Formular bind:betrag bind:kategorie bind:typ bind:datum on:hinzufuegen={transaktionHinzufügen} />
    <!-- Button zum Löschen aller Transaktionen. -->
    <button onclick={alleTransaktionenLöschen} class="delete-all-button">Alle löschen</button>
</div>

<style>
    /* Container mit begrenzter Breite und Innenabstand. */
    .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 20px;
    }

    /* Stil für den "Alle löschen"-Button. */
    .delete-all-button {
        margin-top: 20px;
        display: block;
        width: fit-content;
    }
</style>
