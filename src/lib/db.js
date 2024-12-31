import { MongoClient, ObjectId } from "mongodb";
import { DB_URI } from "$env/static/private";

const client = new MongoClient(DB_URI);
let db;

// Verbindung zur MongoDB herstellen
async function connectToDatabase() {
    try {
        if (!db) {
            await client.connect();
            db = client.db("Budget-Tracker");
            console.log("Erfolgreich mit der MongoDB verbunden.");
        }
    } catch (error) {
        console.error("Fehler bei der Verbindung zur MongoDB:", error);
        throw new Error("Fehler bei der Verbindung zur Datenbank");
    }
}

// Initialisiere die Verbindung, wenn das Modul geladen wird
await connectToDatabase();

export { db };

// === TRANSAKTIONEN-FUNKTIONEN ===
export async function getTransactions() {
    try {
        const collection = db.collection("transactions");
        const documents = await collection.find({}).toArray();
        return documents.map((doc) => ({
            ...doc,
            _id: doc._id.toString(),
        }));
    } catch (error) {
        console.error("Fehler beim Abrufen der Transaktionen:", error);
        throw new Error("Fehler beim Abrufen der Transaktionen");
    }
}

export async function addTransaction(transaction) {
    try {
        const { betrag, kategorie, typ, datum } = transaction;

        if (!betrag || !kategorie || !typ || !datum) {
            throw new Error("Fehlende Daten: Betrag, Kategorie, Typ oder Datum.");
        }

        const collection = db.collection("transactions");
        const result = await collection.insertOne(transaction);
        return result.insertedId.toString();
    } catch (error) {
        console.error("Fehler beim Hinzufügen der Transaktion:", error);
        throw new Error(error.message || "Fehler beim Hinzufügen der Transaktion.");
    }
}

export async function deleteTransactionById(transactionId) {
    try {
        if (!ObjectId.isValid(transactionId)) {
            console.error("Ungültige ID:", transactionId);
            return false;
        }

        const collection = db.collection("transactions");
        const result = await collection.deleteOne({ _id: new ObjectId(transactionId) });
        return result.deletedCount > 0;
    } catch (error) {
        console.error("Fehler beim Löschen der Transaktion:", error);
        throw new Error("Fehler beim Löschen der Transaktion");
    }
}

export async function deleteAllTransactions() {
    try {
        const collection = db.collection("transactions");
        const result = await collection.deleteMany({});
        return result.deletedCount > 0;
    } catch (error) {
        console.error("Fehler beim Löschen aller Transaktionen:", error);
        throw new Error("Fehler beim Löschen aller Transaktionen");
    }
}
// === SPARZIELE-FUNKTIONEN ===
export async function getSavingGoals() {
    try {
        const collection = db.collection("savingGoals");
        const documents = await collection.find({}).toArray();
        return documents.map((doc) => ({
            ...doc,
            _id: doc._id.toString(),
        }));
    } catch (error) {
        console.error("Fehler beim Abrufen der Sparziele aus der Datenbank:", error);
        throw new Error("Fehler beim Abrufen der Sparziele");
    }
}


export async function addSavingGoal(goal) {
    try {
        const { name, zielBetrag, aktuellerBetrag, endDatum } = goal;

        if (!name || isNaN(zielBetrag) || aktuellerBetrag === undefined) {
            throw new Error("Fehlende oder ungültige Eingabedaten: Name, Zielbetrag oder aktueller Betrag");
        }

        const collection = db.collection("savingGoals");
        const result = await collection.insertOne({
            name,
            zielBetrag: parseFloat(zielBetrag),
            aktuellerBetrag: parseFloat(aktuellerBetrag),
            endDatum: endDatum || null,
        });

        console.log("Erfolgreich hinzugefügt, ID:", result.insertedId);
        return result.insertedId.toString();
    } catch (error) {
        console.error("Fehler beim Hinzufügen des Sparziels:", error);
        throw new Error(error.message || "Fehler beim Hinzufügen des Sparziels");
    }
}

export async function updateSavingGoal(id, goal) {
    try {
        if (!ObjectId.isValid(id)) {
            throw new Error("Ungültige Sparziel-ID.");
        }

        const collection = db.collection("savingGoals");
        const result = await collection.updateOne(
            { _id: new ObjectId(id) },
            { $set: goal }
        );
        return result.matchedCount > 0;
    } catch (error) {
        console.error("Fehler beim Aktualisieren des Sparziels:", error);
        throw new Error("Fehler beim Aktualisieren des Sparziels");
    }
}

export async function deleteSavingGoalById(id) {
    try {
        if (!ObjectId.isValid(id)) {
            throw new Error("Ungültige Sparziel-ID.");
        }

        const collection = db.collection("savingGoals");
        const result = await collection.deleteOne({ _id: new ObjectId(id) });
        return result.deletedCount > 0;
    } catch (error) {
        console.error("Fehler beim Löschen des Sparziels:", error);
        throw new Error("Fehler beim Löschen des Sparziels");
    }
}

export async function deleteAllSavingGoals() {
    try {
        const collection = db.collection("savingGoals");
        const result = await collection.deleteMany({});
        return result.deletedCount > 0;
    } catch (error) {
        console.error("Fehler beim Löschen aller Sparziele:", error);
        throw new Error("Fehler beim Löschen aller Sparziele");
    }
}

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
