<script>
    // Exportiert die Variablen 'einnahmen', 'ausgaben' und 'saldo', die von einer übergeordneten Komponente übergeben werden können.
    export let einnahmen = 0;
    export let ausgaben = 0;
    export let saldo = 0;
</script>

<section class="dashboard">
    <h1>Einnahmen- und Ausgabenübersicht</h1>
    <div class="cards">
        <!-- Karte für Einnahmen -->
        <div class="card">
            <h3>Einnahmen</h3>
            <!-- Zeigt die Einnahmen mit zwei Dezimalstellen an, gefolgt von 'CHF' -->
            <p>{einnahmen.toFixed(2)} CHF</p>
        </div>
        <!-- Karte für Ausgaben -->
        <div class="card">
            <h3>Ausgaben</h3>
            <!-- Zeigt die Ausgaben mit zwei Dezimalstellen an, gefolgt von 'CHF' -->
            <p>{ausgaben.toFixed(2)} CHF</p>
        </div>
        <!-- Karte für Saldo -->
        <div class="card">
            <h3>Saldo</h3>
            <!-- Zeigt den Saldo mit zwei Dezimalstellen an, gefolgt von 'CHF' -->
            <p>{saldo.toFixed(2)} CHF</p>
        </div>
    </div>
</section>

<style>
/* Stile für das Karten-Container-Element */
.cards {
    display: flex;
    justify-content: space-between;
    margin-bottom: 30px;
}

/* Stile für jede einzelne Karte */
.card {
    padding: 20px;
    border-radius: 10px;
    text-align: center;
    flex: 1;
    margin: 0 10px;
}
</style>