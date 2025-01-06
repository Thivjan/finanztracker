import { json } from "@sveltejs/kit"; // Importiert die JSON-Funktion für HTTP-Antworten.
import { 
    getTransactions, // Funktion zum Abrufen aller Transaktionen.
    addTransaction,  // Funktion zum Hinzufügen einer Transaktion.
    deleteTransactionById, // Funktion zum Löschen einer Transaktion nach ID.
    deleteAllTransactions, // Funktion zum Löschen aller Transaktionen.
} from "$lib/db.js";

// GET-Methode: Ruft alle Transaktionen ab.
export async function GET() {
    try {
        const transactions = await getTransactions(); // Holt die Transaktionen aus der Datenbank.
        return json({ success: true, transactions }); // Gibt die Transaktionen als JSON zurück.
    } catch (error) {
        console.error("Fehler beim Abrufen der Transaktionen:", error);
        return json(
            { success: false, error: "Fehler beim Abrufen der Transaktionen." }, 
            { status: 500 } // Status 500: Interner Serverfehler.
        );
    }
}

// POST-Methode: Fügt eine neue Transaktion hinzu.
export async function POST({ request }) {
    try {
        const transaction = await request.json(); // Parst die JSON-Daten aus der Anfrage.
        const insertedId = await addTransaction(transaction); // Fügt die Transaktion hinzu und erhält die ID.
        return json(
            { success: true, insertedId }, 
            { status: 201 } // Status 201: Erfolgreich erstellt.
        );
    } catch (error) {
        console.error("Fehler beim Hinzufügen der Transaktion:", error);
        return json(
            { success: false, error: error.message || "Interner Serverfehler." }, 
            { status: 500 } // Status 500: Interner Serverfehler.
        );
    }
}

// DELETE-Methode: Löscht eine oder alle Transaktionen.
export async function DELETE({ request }) {
    try {
        const { transactionId, deleteAll } = await request.json(); // Parst JSON-Daten aus der Anfrage.

        if (deleteAll) {
            // Löscht alle Transaktionen, wenn "deleteAll" gesetzt ist.
            const success = await deleteAllTransactions();
            return json({ success });
        } else if (transactionId) {
            // Löscht eine einzelne Transaktion, wenn eine ID angegeben ist.
            const success = await deleteTransactionById(transactionId);
            return json({ success });
        } else {
            // Gibt einen Fehler zurück, wenn weder "deleteAll" noch eine ID vorhanden ist.
            return json(
                { success: false, error: "Keine ID angegeben." }, 
                { status: 400 } // Status 400: Fehlende oder ungültige Anfrage.
            );
        }
    } catch (error) {
        console.error("Fehler beim Löschen der Transaktion:", error);
        return json(
            { success: false, error: error.message || "Interner Serverfehler." }, 
            { status: 500 } // Status 500: Interner Serverfehler.
        );
    }
}
