import {
    getSavingGoals,
    addSavingGoal,
    deleteSavingGoalById,
    deleteAllSavingGoals,
    updateSavingGoal,
} from "$lib/db.js";



export async function load() {
    const savingGoals = await getSavingGoals();
    console.log("DEBUG: Daten an die Seite übergeben:", savingGoals);
    return { savingGoals };
}


export const actions = {
    add: async ({ request }) => {
        try {
            const formData = await request.formData();
            const name = formData.get("name");
            const zielBetrag = parseFloat(formData.get("zielBetrag"));
            const aktuellerBetrag = parseFloat(formData.get("aktuellerBetrag"));
            const endDatum = formData.get("endDatum");

            if (!name || isNaN(zielBetrag) || isNaN(aktuellerBetrag)) {
                console.error("DEBUG: Invalid input for add action:", {
                    name,
                    zielBetrag,
                    aktuellerBetrag,
                    endDatum,
                });
                return { success: false, error: "Invalid input data" };
            }

            const goal = await addSavingGoal({ name, zielBetrag, aktuellerBetrag, endDatum });
            console.log("DEBUG: Goal added successfully:", goal);
            return { success: true, goal };
        } catch (error) {
            console.error("Error adding saving goal:", error);
            return { success: false, error: "Server error while adding saving goal" };
        }
    },

    delete: async ({ request }) => {
        try {
            const formData = await request.formData();
            const id = formData.get("id");

            if (!id) {
                console.error("DEBUG: Missing ID for delete action");
                return { success: false, error: "No ID provided" };
            }

            const success = await deleteSavingGoalById(id);
            console.log(`DEBUG: Goal with ID ${id} deleted:`, success);
            return { success };
        } catch (error) {
            console.error("Error deleting saving goal:", error);
            return { success: false, error: "Server error while deleting saving goal" };
        }
    },

    deleteAll: async () => {
        try {
            const success = await deleteAllSavingGoals();
            console.log("DEBUG: All goals deleted:", success);
            return { success };
        } catch (error) {
            console.error("Error deleting all saving goals:", error);
            return { success: false, error: "Server error while deleting all saving goals" };
        }
    },

    update: async ({ request }) => {
        try {
            const formData = await request.formData();
            const id = formData.get("id");
            const name = formData.get("name");
            const zielBetrag = parseFloat(formData.get("zielBetrag"));
            const aktuellerBetrag = parseFloat(formData.get("aktuellerBetrag"));
            const endDatum = formData.get("endDatum");

            if (!id || !name || isNaN(zielBetrag) || isNaN(aktuellerBetrag)) {
                console.error("DEBUG: Invalid input for update action:", {
                    id,
                    name,
                    zielBetrag,
                    aktuellerBetrag,
                    endDatum,
                });
                return { success: false, error: "Invalid input data" };
            }

            const success = await updateSavingGoal(id, { name, zielBetrag, aktuellerBetrag, endDatum });
            console.log(`DEBUG: Goal with ID ${id} updated successfully:`, success);
            return { success };
        } catch (error) {
            console.error("Error updating saving goal:", error);
            return { success: false, error: "Server error while updating saving goal" };
        }
    },
};
