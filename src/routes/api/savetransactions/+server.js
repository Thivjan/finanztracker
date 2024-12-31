

import { json } from "@sveltejs/kit";
import { getTransactions, addTransaction, deleteTransactionById, deleteAllTransactions } from "$lib/db.js";

export async function GET() {
    try {
        const transactions = await getTransactions();
        return json({ success: true, transactions });
    } catch (error) {
        console.error("Fehler beim Abrufen der Transaktionen:", error);
        return json({ success: false, error: "Fehler beim Abrufen der Transaktionen." }, { status: 500 });
    }
}

export async function POST({ request }) {
    try {
        const transaction = await request.json();
        const insertedId = await addTransaction(transaction);
        return json({ success: true, insertedId }, { status: 201 });
    } catch (error) {
        console.error("Fehler beim Hinzufügen der Transaktion:", error);
        return json({ success: false, error: error.message || "Interner Serverfehler." }, { status: 500 });
    }
}

export async function DELETE({ request }) {
    try {
        const { transactionId, deleteAll } = await request.json();

        if (deleteAll) {
            const success = await deleteAllTransactions();
            return json({ success });
        } else if (transactionId) {
            const success = await deleteTransactionById(transactionId);
            return json({ success });
        } else {
            return json({ success: false, error: "Keine ID angegeben." }, { status: 400 });
        }
    } catch (error) {
        console.error("Fehler beim Löschen der Transaktion:", error);
        return json({ success: false, error: error.message || "Interner Serverfehler." }, { status: 500 });
    }
}
