<script>
  import { onMount } from "svelte"; // Wird verwendet, um Aktionen beim Laden der Komponente auszuführen.
  import { Chart, registerables } from "chart.js"; // Importiert Chart.js und seine Module.
  Chart.register(...registerables); // Registriert alle notwendigen Chart.js-Komponenten.

  let bitcoinData = []; // Array zur Speicherung der Bitcoin-Daten.

  // Funktion, die beim Laden der Komponente ausgeführt wird.
  onMount(() => {
    fetchBitcoinData(); // Ruft die Bitcoin-Daten ab.
  });

  // Funktion zum Abrufen von Bitcoin-Daten aus der API.
  async function fetchBitcoinData() {
    const url = "https://api.blockchain.info/charts/market-price?timespan=30days&format=json&cors=true";

    const response = await fetch(url);
    const { values } = await response.json();

    bitcoinData = values.map((item) => ({
        date: new Date(item.x * 1000).toLocaleDateString(),
        value: item.y,
    }));

    renderBitcoinChart();
}


  // Erstellt und rendert ein Bitcoin-Diagramm.
  function renderBitcoinChart() {
    const ctx = document.getElementById("bitcoinChart").getContext("2d");
    new Chart(ctx, {
      type: "line", // Liniendiagramm.
      data: {
        labels: bitcoinData.map((item) => item.date), // Datum auf der X-Achse.
        datasets: [
          {
            label: "Bitcoin-Preis (USD)", // Beschriftung des Datensatzes.
            data: bitcoinData.map((item) => item.value), // Bitcoin-Preise auf der Y-Achse.
            borderColor: "rgba(255, 159, 64, 1)", // Linie in warmer Farbe.
            backgroundColor: "rgba(255, 159, 64, 0.2)", // Transparente Füllung unter der Linie.
            tension: 0.4, // Glatte Kurven.
            borderWidth: 3, // Breitere Linien.
            pointRadius: 5, // Größere Punkte.
            pointBackgroundColor: "rgba(255, 99, 132, 1)", // Farbe der Punkte.
          },
        ],
      },
      options: {
        responsive: true, // Passt sich der Fenstergröße an.
        plugins: {
          legend: {
            display: true, // Zeigt die Legende an.
            labels: {
              color: "#ffcc70", // Farbe der Legendentexte.
              font: {
                size: 14,
                weight: "bold",
              },
            },
          },
          tooltip: {
            backgroundColor: "rgba(0, 0, 0, 0.7)", // Hintergrundfarbe der Tooltips.
            titleColor: "#ffcc70", // Farbe des Tooltip-Titels.
            bodyColor: "#fff", // Farbe des Tooltip-Inhalts.
            titleFont: {
              size: 16,
              weight: "bold",
            },
            bodyFont: {
              size: 14,
            },
          },
        },
        scales: {
          x: {
            ticks: {
              color: "#ffcc70", // Farbe der X-Achsenticks.
              font: {
                size: 12,
              },
            },
            grid: {
              display: false, // Versteckt das Gitter für die X-Achse.
            },
          },
          y: {
            ticks: {
              color: "#ffcc70", // Farbe der Y-Achsenticks.
              font: {
                size: 12,
              },
              callback: (value) => `$${value}`, // Fügt Dollarzeichen zu den Y-Achsenwerten hinzu.
            },
            grid: {
              color: "rgba(255, 255, 255, 0.1)", // Dezentes Gitter.
            },
          },
        },
      },
    });
  }
</script>


<div class="container my-5">
  <h1>Tipps und Tricks</h1>
  <p class="text-center text-light bg-dark py-3 rounded shadow-lg">
    <strong class="text-warning">
        Hier zeige ich dir, welche Methoden ich nutze, um ein Sparziel zu verfolgen und langfristig von Investitionen zu profitieren.
    </strong>
  </p>

  <!-- Tipps -->
  <div class="d-flex align-items-center mb-4 tip-card">
    <img src="/KostenSenken.png" alt="Kosten senken" class="tip-image">
    <div class="ms-4">
      <h5>Tipp 1: Kosten senken</h5>
      <p>
        Senke deine Kosten, sodass du mehr sparen kannst.
      </p>
    </div>
  </div>

  <div class="d-flex align-items-center mb-4 tip-card">
    <img src="/ZweitenJob.png" alt="Zweiten Job annehmen" class="tip-image">
    <div class="ms-4">
      <h5>Tipp 2: Einen zweiten Job annehmen</h5>
      <p>
        Erhöhe dein Einkommen durch einen Nebenjob.
      </p>
    </div>
  </div>

  <div class="d-flex align-items-center mb-4 tip-card">
    <img src="/SkillErlernen.png" alt="Skill erlernen" class="tip-image">
    <div class="ms-4">
      <h5>Tipp 3: Einen Skill aneignen</h5>
      <p>
        Lerne einen neuen Skill und verdiene Geld.
      </p>
    </div>
  </div>

  <div class="d-flex align-items-center mb-4 tip-card">
    <img src="/Investieren.png" alt="Investieren" class="tip-image">
    <div class="ms-4">
      <h5>Tipp 4: Geld anlegen</h5>
      <p>
        Investiere klug und beobachte deine Renditen.
      </p>
    </div>
  </div>

  <!-- Bitcoin-Chart -->
  <div class="container my-5">
    <h2 class="text-center text-light mb-4">Bitcoin-Chart</h2>
    <canvas id="bitcoinChart" width="400" height="200"></canvas>
  </div>
</div>


<style>
  canvas {
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  padding: 10px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.3);
}

h2 {
  color: #ffcc70;
  font-size: 1.8rem;
  font-weight: bold;
}

.tip-card {
  background-color: rgba(255, 255, 255, 0.1);
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.tip-image {
  max-width: 150px;
  border-radius: 8px;
  object-fit: cover;
}

h5 {
  color: #ffcc70;
}

p {
  color: #ddd;
}

</style>
