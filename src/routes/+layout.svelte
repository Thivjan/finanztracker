<script>
    // Importiert die globalen CSS-Stile.
    import './style.css';

    // Importiert die Navbar- und Footer-Komponenten.
    import Navbar from '$lib/components/Navbar.svelte';
    import Footer from '$lib/components/Footer.svelte';
</script>

<!-- Einbindung der Navbar-Komponente -->
<Navbar />

<!-- Hauptcontainer für Seiteninhalte -->
<div class="container mt-3">
    <slot /> <!-- Platzhalter für dynamische Inhalte, die von der übergeordneten Komponente eingefügt werden -->
</div>

<!-- Einbindung der Footer-Komponente -->
<Footer />
