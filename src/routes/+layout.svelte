<script>
    import './style.css';
    import Navbar from '$lib/components/Navbar.svelte';
    import Footer from '$lib/components/Footer.svelte';

</script>

<Navbar />



<div class="container mt-3">
    <slot /> <!-- Platz für die Inhalte der Seiten -->
</div>

<Footer />
