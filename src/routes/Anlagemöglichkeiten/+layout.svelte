<script lang="ts">
    // Exportiert eine konstante Titelvariable für die Komponente.
    export const title = "Anlagemöglichkeiten";
</script>

<main>
    <!-- Überschrift der Seite, dynamisch basierend auf dem exportierten Titel. -->
    <h1>{title}</h1>
    
    <!-- Platzhalter für Inhalte, die von außen in die Komponente eingefügt werden. -->
    <slot />
</main>
