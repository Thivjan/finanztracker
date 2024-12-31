<script>
    export let einnahmen = 0;
    export let ausgaben = 0;
    export let saldo = 0;
</script>

<section class="dashboard">
    <h1>Einnahmen- und Ausgabenübersicht</h1>
    <div class="cards">
        <div class="card">
            <h3>Einnahmen</h3>
            <p>{einnahmen.toFixed(2)} CHF</p>
        </div>
        <div class="card">
            <h3>Ausgaben</h3>
            <p>{ausgaben.toFixed(2)} CHF</p>
        </div>
        <div class="card">
            <h3>Saldo</h3>
            <p>{saldo.toFixed(2)} CHF</p>
        </div>
    </div>
</section>

<style>
 .cards {
    display: flex;
    justify-content: space-between;
    margin-bottom: 30px;
}
.card {
    padding: 20px;
    border-radius: 10px;
    text-align: center;
    flex: 1;
    margin: 0 10px;
}

</style>
