import db from "$lib/db.js"; // Importiert die Datenbank-Funktionen aus der lokalen Bibliothek.

export async function load() {
    // Ruft alle Transaktionen aus der Datenbank ab.
    const transaktionen = await db.getTransactions();
    
    // Loggt die Transaktionen auf der Serverseite zur Überprüfung.
    console.log("Transaktionen von DB:", transaktionen);

    // Gibt die Transaktionen zurück, um sie in der Svelte-Seite zu nutzen.
    return { transaktionen };
}
