const knex = require('../db/connection'); // Adjust the path according to your project structure

async function getRecipeById(recipe_id) {
    const recipe = await knex('recipes')
        .where({ id: recipe_id })
        .first();

    const steps = await knex('steps')
        .where({ recipe_id })
        .orderBy('step_number');

    for (let step of steps) {
        const ingredients = await knex('recipe_step_ingredients')
            .join('ingredients', 'recipe_step_ingredients.ingredient_id', '=', 'ingredients.id')
            .where({ step_id: step.id })
            .select('ingredients.id as ingredient_id', 'ingredients.name as ingredient_name', 'recipe_step_ingredients.quantity');

        step.ingredients = ingredients;
    }

    return { ...recipe, steps };
}

async function createRecipe(recipeData) {
    return knex.transaction(async (trx) => {
        const { recipe_name, steps } = recipeData;

        const [recipe_id] = await trx('recipes').insert({ name: recipe_name }, 'id');

        for (let step of steps) {
            const { step_number, step_instructions, ingredients } = step;
            const [step_id] = await trx('steps').insert({
                recipe_id,
                step_number,
                instruction: step_instructions,
            }, 'id');

            if (ingredients && ingredients.length) {
                const stepIngredients = ingredients.map(({ ingredient_id, quantity }) => ({
                    step_id,
                    ingredient_id,
                    quantity,
                }));
                await trx('recipe_step_ingredients').insert(stepIngredients);
            }
        }

        return recipe_id; // Return the new recipe's ID
    });
}

module.exports = {
    getRecipeById,
    createRecipe, // Make sure this function is exported
};
