import React, { useState, useEffect } from 'react';

const API_KEY = process.env.REACT_APP_USDA_API_KEY;
const API_ENDPOINT = 'https://api.nal.usda.gov/fdc/v1/foods/search';

function FoodSearch({ onSelectFood }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);
  const [servingSize, setServingSize] = useState(100); // default to 100g

  useEffect(() => {
    console.log('Current search results:', searchResults);
  }, [searchResults]);

  const searchFood = async (term) => {
    if (!term) return;
    setLoading(true);
    try {
      const response = await fetch(
        `${API_ENDPOINT}?api_key=${API_KEY}&query=${term}&pageSize=10&dataType=Survey (FNDDS)`
      );
      const data = await response.json();
      
      const formattedResults = data.foods.map(food => {
        const nutrients = food.foodNutrients.reduce((acc, nutrient) => {
          if (nutrient.nutrientName === 'Protein') acc.protein = nutrient.value;
          if (nutrient.nutrientName === 'Carbohydrate, by difference') acc.carbs = nutrient.value;
          if (nutrient.nutrientName === 'Total lipid (fat)') acc.fats = nutrient.value;
          return acc;
        }, { protein: 0, carbs: 0, fats: 0 });

        return {
          id: food.fdcId,
          name: food.description,
          nutrients
        };
      });

      console.log('Search results:', formattedResults); // Add this for debugging
      setSearchResults(formattedResults);
    } catch (error) {
      console.error('Error searching foods:', error);
    }
    setLoading(false);
  };

  const handleFoodClick = (food) => {
    setSelectedFood(food);
  };

  const handleServingSizeChange = (e) => {
    const newSize = Number(e.target.value);
    setServingSize(newSize);
  };

  const handleAddFood = () => {
    if (!selectedFood) return;
    
    const multiplier = servingSize / 100; // convert from base 100g
    onSelectFood({
      name: selectedFood.name,
      protein: Math.round(selectedFood.nutrients.protein * multiplier * 10) / 10,
      carbs: Math.round(selectedFood.nutrients.carbs * multiplier * 10) / 10,
      fats: Math.round(selectedFood.nutrients.fats * multiplier * 10) / 10,
      servingSize,
      servingUnit: 'g'
    });
    
    setSelectedFood(null);
    setServingSize(100);
    setSearchTerm('');
    setSearchResults([]);
  };

  // Debounce search to prevent too many API calls
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value.length >= 2) { // Search after 2 characters
      searchFood(value);
    } else {
      setSearchResults([]);
    }
  };

  return (
    <div className="food-search">
      <div className="search-input">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search for a food (type at least 2 characters)..."
        />
      </div>
      
      {loading && <div className="loading">Searching foods...</div>}
      
      <div className="search-results">
        {searchResults.length === 0 && searchTerm.length >= 2 && !loading && (
          <div className="no-results">No foods found</div>
        )}
        {searchResults.map(food => (
          <div 
            key={food.id} 
            className={`food-result ${selectedFood?.id === food.id ? 'selected' : ''}`}
            onClick={() => handleFoodClick(food)}
          >
            <span className="food-name">{food.name}</span>
            <div className="food-macros">
              <span>P: {Math.round(food.nutrients.protein)}g</span>
              <span>C: {Math.round(food.nutrients.carbs)}g</span>
              <span>F: {Math.round(food.nutrients.fats)}g</span>
            </div>
          </div>
        ))}
      </div>

      {selectedFood && (
        <div className="serving-size-selector">
          <h4>{selectedFood.name}</h4>
          <div className="serving-inputs">
            <input
              type="number"
              value={servingSize}
              onChange={handleServingSizeChange}
              min="0"
              step="10"
            />
            <span>grams</span>
            <button onClick={handleAddFood}>Add Food</button>
          </div>
          <div className="adjusted-macros">
            <p>Macros for {servingSize}g:</p>
            <span>Protein: {Math.round(selectedFood.nutrients.protein * servingSize / 100)}g</span>
            <span>Carbs: {Math.round(selectedFood.nutrients.carbs * servingSize / 100)}g</span>
            <span>Fats: {Math.round(selectedFood.nutrients.fats * servingSize / 100)}g</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default FoodSearch; 