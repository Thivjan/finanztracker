<script lang="ts">
    // Exportiert eine konstante Titelvariable für die Seite.
    export const title = "Budget Tracker";
</script>

<main>
    <!-- Zeigt den Seitentitel dynamisch an. -->
    <h1>{title}</h1>
    
    <!-- Platzhalter für Inhalte, die von anderen Komponenten eingefügt werden. -->
    <slot />
</main>
