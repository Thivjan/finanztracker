<script>
    import { onMount } from "svelte";
    import Dashboard from "$lib/components/Dashboard.svelte";
    import TransaktionenListe from "$lib/components/TransaktionenListe.svelte";
    import Formular from "$lib/components/Formular.svelte";

    let einnahmen = $state();
    let ausgaben = $state();
    let saldo = $state();
    let {transaktionen}= $props();
    let betrag = $state();
    let kategorie = $state();
    let typ = $state('Einnahme');
    let datum = $state();

    // Summen aktualisieren
    function updateSummen() {
        einnahmen = 0;
        ausgaben = 0;
        transaktionen.forEach((t) => {
            if (t.typ === 'Einnahme') einnahmen += t.betrag;
            else if (t.typ === 'Ausgabe') ausgaben += t.betrag;
        });
        saldo = einnahmen - ausgaben;
    }

    // Lade Transaktionen nach der Initialisierung
    onMount(async () => {
        await ladeTransaktionen();
    });

    async function ladeTransaktionen() {
        try {
            const response = await fetch('/api/savetransactions');
            const result = await response.json();
            if (result.success) {
                transaktionen = result.transactions;
                updateSummen();
            } else {
                alert('Fehler beim Laden der Transaktionen.');
            }
        } catch (error) {
            console.error('Fehler beim Laden:', error);
        }
    }

    // Neue Transaktion hinzufügen
    async function transaktionHinzufügen(event) {
        const neueTransaktion = event.detail;
        try {
            const response = await fetch('/api/savetransactions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(neueTransaktion),
            });

            const result = await response.json();
            if (result.success) {
                await ladeTransaktionen(); // Seite aktualisieren
                alert('Transaktion erfolgreich gespeichert!');
            } else {
                alert(result.error || 'Fehler beim Speichern der Transaktion.');
            }
        } catch (error) {
            console.error('Fehler beim Speichern:', error);
            alert('Serverfehler beim Speichern.');
        }
    }

    // Transaktion löschen
    async function transaktionLöschen(id) {
        try {
            const response = await fetch('/api/savetransactions', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ transactionId: id }),
            });

            const result = await response.json();
            if (result.success) {
                await ladeTransaktionen(); // Seite aktualisieren
                alert('Transaktion erfolgreich gelöscht!');
            } else {
                alert(result.error || 'Fehler beim Löschen der Transaktion.');
            }
        } catch (error) {
            console.error('Fehler beim Löschen:', error);
            alert('Serverfehler beim Löschen.');
        }
    }

    // Alle Transaktionen löschen
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
                    transaktionen = [];
                    updateSummen();
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
    <Dashboard {einnahmen} {ausgaben} {saldo} />
    <TransaktionenListe {transaktionen} on:loeschenEinzeln={(event) => transaktionLöschen(event.detail)} />
    <Formular bind:betrag bind:kategorie bind:typ bind:datum on:hinzufuegen={transaktionHinzufügen} />
    <button onclick={alleTransaktionenLöschen} class="delete-all-button">Alle löschen</button>
</div>

<style>
    .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 20px;
    }

    .delete-all-button {
        margin-top: 20px;
        display: block;
        width: fit-content;
    }
</style>
