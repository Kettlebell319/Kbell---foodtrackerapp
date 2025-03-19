import React, { useState } from 'react';
import FoodSearch from './FoodSearch';

function FoodEntry({ onAddMeal }) {
  const [food, setFood] = useState({
    name: '',
    protein: '',
    carbs: '',
    fats: '',
    category: 'breakfast'
  });

  const mealCategories = ['breakfast', 'lunch', 'dinner', 'snacks'];

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddMeal({
      ...food,
      protein: Number(food.protein),
      carbs: Number(food.carbs),
      fats: Number(food.fats),
      date: new Date(),
    });
    setFood({ name: '', protein: '', carbs: '', fats: '', category: 'breakfast' });
  };

  const handleFoodSelect = (selectedFood) => {
    setFood({
      ...food,
      name: selectedFood.name,
      protein: selectedFood.protein,
      carbs: selectedFood.carbs,
      fats: selectedFood.fats
    });
  };

  return (
    <div className="food-entry-container">
      <FoodSearch onSelectFood={handleFoodSelect} />
      
      <form onSubmit={handleSubmit} className="food-entry">
        <input
          type="text"
          placeholder="Food name"
          value={food.name}
          onChange={(e) => setFood({ ...food, name: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Protein (g)"
          value={food.protein}
          onChange={(e) => setFood({ ...food, protein: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Carbs (g)"
          value={food.carbs}
          onChange={(e) => setFood({ ...food, carbs: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Fats (g)"
          value={food.fats}
          onChange={(e) => setFood({ ...food, fats: e.target.value })}
          required
        />
        <button type="submit">Add Food</button>
      </form>
    </div>
  );
}

export default FoodEntry; 