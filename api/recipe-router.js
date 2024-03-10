const express = require('express');
const router = express.Router();
const recipeModel = require('../recipeModel');

router.get('/recipes/:id', async (req, res) => {
  try {
    const recipe = await recipeModel.getRecipeById(req.params.id);
    if (recipe) {
      res.json(recipe);
    } else {
      res.status(404).send('Recipe not found');
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.post('/recipes', async (req, res) => {
    try {
        const recipeData = req.body; // Assuming the body contains the recipe structure
        
        // Validate recipeData here (e.g., check for required fields)
        // This is important to avoid inserting incomplete or incorrect data

        const recipeId = await recipeModel.createRecipe(recipeData);

        res.status(201).json({ message: 'Recipe created successfully', recipeId: recipeId });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error creating the recipe');
    }
});

module.exports = router;
