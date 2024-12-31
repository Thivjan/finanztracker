<script>
    const pages = [
        { name: "Budget-Tracker", link: "/Budget-Tracker" },
        { name: "Budgetübersicht", link: "/Budgetübersicht" },
        { name: "Anlagemöglichkeiten", link: "/Anlagemöglichkeiten" },
        { name: "Renditerechner", link: "/Renditerechner" },
        { name: "Sparziel", link: "/Sparziel" },
        { name: "Tipps und Tricks", link: "/Tipps und Tricks" },
    ];
</script>

<nav class="navbar navbar-expand-lg navbar-dark bg-dark shadow">
    <div class="container-fluid">
        <a class="navbar-brand d-flex align-items-center" href="/">
            <img src="/Thivis.png" alt="Logo" style="height: 40px; margin-right: 10px;">
            Thivis Finanzhorizont
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown"
            aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNavDropdown">
            <ul class="navbar-nav w-100 d-flex justify-content-between">
                {#each pages as page}
                    <li class="nav-item">
                        <a class="nav-link text-warning" href={page.link}>{page.name}</a>
                    </li>
                {/each}
            </ul>
        </div>
    </div>
</nav>
<style>
    .nav-link {
        font-weight: bold; /* Stärkt die Linkschrift */
        transition: color 0.3s; /* Sanfter Hover-Effekt */
    }
    
    .nav-link:hover {
        color: #fff; /* Hover-Farbe für Links */
    }
    </style>
