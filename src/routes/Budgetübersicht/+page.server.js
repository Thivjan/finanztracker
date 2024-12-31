
import db from "$lib/db.js";

export async function load() {
    const transaktionen = await db.getTransactions();
    console.log("Transaktionen von DB:", transaktionen); // Server Log
    return { transaktionen };
}
