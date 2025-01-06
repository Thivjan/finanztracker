import { MongoClient, ObjectId } from "mongodb";
import { DB_URI } from "$env/static/private";

// Initialisierung des MongoDB-Clients mit der URI aus Umgebungsvariablen.
const client = new MongoClient(DB_URI);
let db;

// Funktion zum Herstellen der Verbindung zur MongoDB-Datenbank.
async function connectToDatabase() {
    try {
        // Verhindert mehrfaches Verbinden, wenn db bereits initialisiert wurde.
        if (!db) {
            await client.connect(); // Verbindung aufbauen.
            db = client.db("Budget-Tracker"); // Datenbank mit Namen auswählen.
            console.log("Erfolgreich mit der MongoDB verbunden.");
        }
    } catch (error) {
        console.error("Fehler bei der Verbindung zur MongoDB:", error);
        throw new Error("Fehler bei der Verbindung zur Datenbank"); // Fehler weiterleiten.
    }
}

// Verbindung herstellen, wenn dieses Modul geladen wird.
await connectToDatabase();

export { db };

// === TRANSAKTIONEN-FUNKTIONEN ===

// Ruft alle Transaktionen aus der Datenbank ab.
export async function getTransactions() {
    try {
        const collection = db.collection("transactions"); // Collection auswählen.
        const documents = await collection.find({}).toArray(); // Alle Dokumente abrufen.
        return documents.map((doc) => ({
            ...doc,
            _id: doc._id.toString(), // ObjectId in String konvertieren.
        }));
    } catch (error) {
        console.error("Fehler beim Abrufen der Transaktionen:", error);
        throw new Error("Fehler beim Abrufen der Transaktionen");
    }
}

// Fügt eine neue Transaktion zur Datenbank hinzu.
export async function addTransaction(transaction) {
    try {
        const { betrag, kategorie, typ, datum } = transaction;

        // Validierung: Überprüfen, ob alle Felder vorhanden sind.
        if (!betrag || !kategorie || !typ || !datum) {
            throw new Error("Fehlende Daten: Betrag, Kategorie, Typ oder Datum.");
        }

        const collection = db.collection("transactions"); // Collection auswählen.
        const result = await collection.insertOne(transaction); // Transaktion einfügen.
        return result.insertedId.toString(); // ID der hinzugefügten Transaktion zurückgeben.
    } catch (error) {
        console.error("Fehler beim Hinzufügen der Transaktion:", error);
        throw new Error(error.message || "Fehler beim Hinzufügen der Transaktion.");
    }
}

// Löscht eine Transaktion anhand ihrer ID.
export async function deleteTransactionById(transactionId) {
    try {
        if (!ObjectId.isValid(transactionId)) {
            console.error("Ungültige ID:", transactionId); // Warnung bei ungültiger ID.
            return false;
        }

        const collection = db.collection("transactions");
        const result = await collection.deleteOne({ _id: new ObjectId(transactionId) }); // Dokument löschen.
        return result.deletedCount > 0; // Gibt true zurück, wenn etwas gelöscht wurde.
    } catch (error) {
        console.error("Fehler beim Löschen der Transaktion:", error);
        throw new Error("Fehler beim Löschen der Transaktion");
    }
}

// Löscht alle Transaktionen in der Datenbank.
export async function deleteAllTransactions() {
    try {
        const collection = db.collection("transactions");
        const result = await collection.deleteMany({}); // Alle Dokumente löschen.
        return result.deletedCount > 0; // Gibt true zurück, wenn Dokumente gelöscht wurden.
    } catch (error) {
        console.error("Fehler beim Löschen aller Transaktionen:", error);
        throw new Error("Fehler beim Löschen aller Transaktionen");
    }
}

// === SPARZIELE-FUNKTIONEN ===

// Ruft alle Sparziele aus der Datenbank ab.
export async function getSavingGoals() {
    try {
        const collection = db.collection("savingGoals");
        const documents = await collection.find({}).toArray(); // Alle Dokumente abrufen.
        return documents.map((doc) => ({
            ...doc,
            _id: doc._id.toString(), // ObjectId in String konvertieren.
        }));
    } catch (error) {
        console.error("Fehler beim Abrufen der Sparziele aus der Datenbank:", error);
        throw new Error("Fehler beim Abrufen der Sparziele");
    }
}

// Fügt ein neues Sparziel hinzu.
export async function addSavingGoal(goal) {
    try {
        const { name, zielBetrag, aktuellerBetrag, endDatum } = goal;

        // Validierung: Sicherstellen, dass erforderliche Felder gültig sind.
        if (!name || isNaN(zielBetrag) || aktuellerBetrag === undefined) {
            throw new Error("Fehlende oder ungültige Eingabedaten: Name, Zielbetrag oder aktueller Betrag");
        }

        const collection = db.collection("savingGoals");
        const result = await collection.insertOne({
            name,
            zielBetrag: parseFloat(zielBetrag), // Zielbetrag in Zahl konvertieren.
            aktuellerBetrag: parseFloat(aktuellerBetrag), // Aktueller Betrag in Zahl konvertieren.
            endDatum: endDatum || null, // Optionales Enddatum.
        });

        console.log("Erfolgreich hinzugefügt, ID:", result.insertedId);
        return result.insertedId.toString(); // ID des hinzugefügten Sparziels zurückgeben.
    } catch (error) {
        console.error("Fehler beim Hinzufügen des Sparziels:", error);
        throw new Error(error.message || "Fehler beim Hinzufügen des Sparziels");
    }
}

// Aktualisiert ein bestehendes Sparziel anhand seiner ID.
export async function updateSavingGoal(id, goal) {
    try {
        if (!ObjectId.isValid(id)) {
            throw new Error("Ungültige Sparziel-ID.");
        }

        const collection = db.collection("savingGoals");
        const result = await collection.updateOne(
            { _id: new ObjectId(id) }, // Dokument anhand der ID suchen.
            { $set: goal } // Felder aktualisieren.
        );
        return result.matchedCount > 0; // Gibt true zurück, wenn etwas aktualisiert wurde.
    } catch (error) {
        console.error("Fehler beim Aktualisieren des Sparziels:", error);
        throw new Error("Fehler beim Aktualisieren des Sparziels");
    }
}

// Löscht ein Sparziel anhand seiner ID.
export async function deleteSavingGoalById(id) {
    try {
        if (!ObjectId.isValid(id)) {
            throw new Error("Ungültige Sparziel-ID.");
        }

        const collection = db.collection("savingGoals");
        const result = await collection.deleteOne({ _id: new ObjectId(id) }); // Dokument löschen.
        return result.deletedCount > 0; // Gibt true zurück, wenn etwas gelöscht wurde.
    } catch (error) {
        console.error("Fehler beim Löschen des Sparziels:", error);
        throw new Error("Fehler beim Löschen des Sparziels");
    }
}

// Löscht alle Sparziele in der Datenbank.
export async function deleteAllSavingGoals() {
    try {
        const collection = db.collection("savingGoals");
        const result = await collection.deleteMany({}); // Alle Dokumente löschen.
        return result.deletedCount > 0; // Gibt true zurück, wenn Dokumente gelöscht wurden.
    } catch (error) {
        console.error("Fehler beim Löschen aller Sparziele:", error);
        throw new Error("Fehler beim Löschen aller Sparziele");
    }
}

// Exportiert alle Funktionen als Standardobjekt.
export default {
    getTransactions,
    addTransaction,
    deleteTransactionById,
    deleteAllTransactions,
    getSavingGoals,
    addSavingGoal,
    updateSavingGoal,
    deleteSavingGoalById,
    deleteAllSavingGoals,
};
