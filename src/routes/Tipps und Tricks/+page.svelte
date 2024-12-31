<script>
  import { onMount } from "svelte";
  import { Chart, registerables } from "chart.js";
  Chart.register(...registerables);

  let bitcoinData = [];

  onMount(() => {
    fetchBitcoinData();
  });

  async function fetchBitcoinData() {
    try {
      const response = await fetch(
        "https://api.blockchain.info/charts/market-price?timespan=30days&format=json&cors=true"
      );
      if (!response.ok) {
        throw new Error("Fehler beim Abrufen der Bitcoin-Daten");
      }
      const data = await response.json();
      bitcoinData = data.values.map((item) => ({
        date: new Date(item.x * 1000).toLocaleDateString(),
        value: item.y,
      }));
      renderBitcoinChart();
    } catch (error) {
      console.error("Fehler beim Abrufen der Bitcoin-Daten:", error);
    }
  }

  function renderBitcoinChart() {
    const ctx = document.getElementById("bitcoinChart").getContext("2d");
    new Chart(ctx, {
      type: "line",
      data: {
        labels: bitcoinData.map((item) => item.date),
        datasets: [
          {
            label: "Bitcoin-Preis (USD)",
            data: bitcoinData.map((item) => item.value),
            borderColor: "rgba(255, 159, 64, 1)", // Warme Farbe
            backgroundColor: "rgba(255, 159, 64, 0.2)", // Halbtransparente Hintergrundfarbe
            tension: 0.4, // Weiche Kurven
            borderWidth: 3, // Breitere Linien
            pointRadius: 5, // Größere Punkte
            pointBackgroundColor: "rgba(255, 99, 132, 1)", // Akzentfarbe für Punkte
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
            labels: {
              color: "#ffcc70", // Warme Akzentfarbe für die Legende
              font: {
                size: 14,
                weight: "bold",
              },
            },
          },
          tooltip: {
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            titleColor: "#ffcc70",
            bodyColor: "#fff",
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
              color: "#ffcc70", // Akzentfarbe für X-Achse
              font: {
                size: 12,
              },
            },
            grid: {
              display: false,
            },
          },
          y: {
            ticks: {
              color: "#ffcc70", // Akzentfarbe für Y-Achse
              font: {
                size: 12,
              },
              callback: (value) => `$${value}`, // Formatierung für Dollarzeichen
            },
            grid: {
              color: "rgba(255, 255, 255, 0.1)", // Dezentes Gitter
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


  <!-- Tipp 1 -->
  <div class="d-flex align-items-center mb-4 tip-card">
    <img src="/KostenSenken.png" alt="Kosten senken" class="tip-image">
    <div class="ms-4">
      <h5>Tipp 1: Kosten senken</h5>
      <p>
        Senke deine Kosten, sodass du mehr sparen kannst. Fixkosten lassen sich oft schwer reduzieren, aber variable Kosten bieten großes Einsparpotenzial. Statt auswärts zu essen, kannst du Mahlzeiten von zuhause mitnehmen. Oder statt alle zwei Wochen zum Coiffeur zu gehen, reicht vielleicht ein Besuch pro Monat.
      </p>
    </div>
  </div>

  <!-- Tipp 2 -->
  <div class="d-flex align-items-center mb-4 tip-card">
    <img src="/ZweitenJob.png" alt="Zweiten Job annehmen" class="tip-image">
    <div class="ms-4">
      <h5>Tipp 2: Einen zweiten Job annehmen</h5>
      <p>
        Dieser Tipp ist besonders für diejenigen geeignet, die etwas mehr Zeit haben. Wenn deine Fixkosten zu hoch sind und du mehr Geld im Monat zur Verfügung haben möchtest, könnte ein Nebenjob eine gute Lösung sein.
      </p>
    </div>
  </div>

  <!-- Tipp 3 -->
  <div class="d-flex align-items-center mb-4 tip-card">
    <img src="/SkillErlernen.png" alt="Skill erlernen" class="tip-image">
    <div class="ms-4">
      <h5>Tipp 3: Einen Skill aneignen und damit Geld verdienen</h5>
      <p>
        Wenn du eher ein kreativer Mensch bist, könnte das etwas für dich sein. Du kannst deine Zeit investieren, um einen neuen Skill zu erlernen, und damit Geld verdienen.
      </p>
    </div>
  </div>

  <!-- Tipp 4 -->
  <div class="d-flex align-items-center mb-4 tip-card">
    <img src="/Investieren.png" alt="Investieren" class="tip-image">
    <div class="ms-4">
      <h5>Tipp 4: Geld anlegen</h5>
      <p>
        Mein Lieblingstipp: Ich empfehle jedem, ein Fundamentwissen in einem oder mehreren Märkten aufzubauen, um Geld anzulegen. Ich persönlich investiere ein wenig in Bitcoin, jedoch gibt es auch andere lukrative Märkte. Hier siehst du den Bitcoin-Chart:
      </p>
    </div>
  </div>

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
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.7);
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
