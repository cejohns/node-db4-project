// Assuming you have set up Express and imported necessary modules
const express = require('express');
const knex = require('knex')(require('./knexfile').development);
const app = express();
const port = 3000;

app.get('/recipes/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const recipe = await knex('recipes').where({ id }).first();
    const steps = await knex('steps').where({ recipe_id: id }).orderBy('step_number', 'asc');
    
    for (const step of steps) {
      const ingredients = await knex('recipe_step_ingredients')
        .join('ingredients', 'recipe_step_ingredients.ingredient_id', 'ingredients.id')
        .where({ step_id: step.id })
        .select('ingredient_id', 'name as ingredient_name', 'quantity');
      
      step.ingredients = ingredients;
    }
    
    recipe.steps = steps;

    res.json(recipe);
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred');
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
