<script lang="ts">
    // Exportiert eine Titel-Variable für die Seite.
    // Diese kann von der übergeordneten Komponente übergeben oder der Standardwert "Renditerechner" verwendet werden.
    export let title = "Renditerechner";
</script>

<main>
    <!-- Zeigt den Titel der Seite an. -->
    <h1>{title}</h1>
    
    <!-- Slot erlaubt es, dynamischen Inhalt von der übergeordneten Komponente einzufügen. -->
    <slot />
</main>
