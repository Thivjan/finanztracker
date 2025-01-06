import {
    getSavingGoals,        // Funktion zum Abrufen aller Sparziele.
    addSavingGoal,         // Funktion zum Hinzufügen eines neuen Sparziels.
    deleteSavingGoalById,  // Funktion zum Löschen eines spezifischen Sparziels nach ID.
    deleteAllSavingGoals,  // Funktion zum Löschen aller Sparziele.
    updateSavingGoal,      // Funktion zum Aktualisieren eines Sparziels.
} from "$lib/db.js";

// Lädt alle Sparziele beim Aufruf der Seite.
export async function load() {
    const savingGoals = await getSavingGoals(); // Abrufen aller Sparziele aus der Datenbank.
    console.log("DEBUG: Daten an die Seite übergeben:", savingGoals); // Debugging-Ausgabe für die geladenen Daten.
    return { savingGoals }; // Übergibt die Sparziele an die Seite.
}

// Definiert die verschiedenen Aktionen, die auf der Seite ausgeführt werden können.
export const actions = {

    // Hinzufügen eines neuen Sparziels.
    add: async ({ request }) => {
        try {
            const formData = await request.formData(); // Formulardaten aus der Anfrage extrahieren.
            const name = formData.get("name"); // Name des Sparziels.
            const zielBetrag = parseFloat(formData.get("zielBetrag")); // Zielbetrag.
            const aktuellerBetrag = parseFloat(formData.get("aktuellerBetrag")); // Aktueller Betrag.
            const endDatum = formData.get("endDatum"); // Enddatum.

            // Überprüfung der Eingaben.
            if (!name || isNaN(zielBetrag) || isNaN(aktuellerBetrag)) {
                console.error("DEBUG: Invalid input for add action:", {
                    name,
                    zielBetrag,
                    aktuellerBetrag,
                    endDatum,
                });
                return { success: false, error: "Invalid input data" }; // Rückgabe bei ungültigen Eingaben.
            }

            const goal = await addSavingGoal({ name, zielBetrag, aktuellerBetrag, endDatum }); // Sparziel hinzufügen.
            console.log("DEBUG: Goal added successfully:", goal); // Debugging-Ausgabe für erfolgreiches Hinzufügen.
            return { success: true, goal }; // Erfolgsantwort mit dem hinzugefügten Sparziel.
        } catch (error) {
            console.error("Error adding saving goal:", error); // Fehlerprotokoll.
            return { success: false, error: "Server error while adding saving goal" }; // Fehlerantwort.
        }
    },

    // Löschen eines spezifischen Sparziels.
    delete: async ({ request }) => {
        try {
            const formData = await request.formData(); // Formulardaten aus der Anfrage extrahieren.
            const id = formData.get("id"); // ID des zu löschenden Sparziels.

            if (!id) { // Überprüfung, ob eine ID angegeben wurde.
                console.error("DEBUG: Missing ID for delete action");
                return { success: false, error: "No ID provided" }; // Rückgabe bei fehlender ID.
            }

            const success = await deleteSavingGoalById(id); // Sparziel anhand der ID löschen.
            console.log(`DEBUG: Goal with ID ${id} deleted:`, success); // Debugging-Ausgabe für das Löschen.
            return { success }; // Erfolgsantwort.
        } catch (error) {
            console.error("Error deleting saving goal:", error); // Fehlerprotokoll.
            return { success: false, error: "Server error while deleting saving goal" }; // Fehlerantwort.
        }
    },

    // Löschen aller Sparziele.
    deleteAll: async () => {
        try {
            const success = await deleteAllSavingGoals(); // Alle Sparziele löschen.
            console.log("DEBUG: All goals deleted:", success); // Debugging-Ausgabe für das Löschen aller Sparziele.
            return { success }; // Erfolgsantwort.
        } catch (error) {
            console.error("Error deleting all saving goals:", error); // Fehlerprotokoll.
            return { success: false, error: "Server error while deleting all saving goals" }; // Fehlerantwort.
        }
    },

    // Aktualisieren eines spezifischen Sparziels.
    update: async ({ request }) => {
        try {
            const formData = await request.formData(); // Formulardaten aus der Anfrage extrahieren.
            const id = formData.get("id"); // ID des zu aktualisierenden Sparziels.
            const name = formData.get("name"); // Neuer Name.
            const zielBetrag = parseFloat(formData.get("zielBetrag")); // Neuer Zielbetrag.
            const aktuellerBetrag = parseFloat(formData.get("aktuellerBetrag")); // Neuer aktueller Betrag.
            const endDatum = formData.get("endDatum"); // Neues Enddatum.

            // Überprüfung der Eingaben.
            if (!id || !name || isNaN(zielBetrag) || isNaN(aktuellerBetrag)) {
                console.error("DEBUG: Invalid input for update action:", {
                    id,
                    name,
                    zielBetrag,
                    aktuellerBetrag,
                    endDatum,
                });
                return { success: false, error: "Invalid input data" }; // Rückgabe bei ungültigen Eingaben.
            }

            const success = await updateSavingGoal(id, { name, zielBetrag, aktuellerBetrag, endDatum }); // Sparziel aktualisieren.
            console.log(`DEBUG: Goal with ID ${id} updated successfully:`, success); // Debugging-Ausgabe für erfolgreiches Aktualisieren.
            return { success }; // Erfolgsantwort.
        } catch (error) {
            console.error("Error updating saving goal:", error); // Fehlerprotokoll.
            return { success: false, error: "Server error while updating saving goal" }; // Fehlerantwort.
        }
    },
};
