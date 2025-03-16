import React, { useState, useEffect } from 'react';

// Nutritionix API credentials
const APP_ID = process.env.REACT_APP_NUTRITIONIX_APP_ID;
const APP_KEY = process.env.REACT_APP_NUTRITIONIX_APP_KEY;
const API_ENDPOINT = 'https://trackapi.nutritionix.com/v2/search/instant';

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
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-app-id': APP_ID,
          'x-app-key': APP_KEY,
        },
        body: JSON.stringify({
          query: term,
          detailed: true
        })
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      console.log('Raw API response:', data);

      const formattedResults = data.common.map(food => ({
        id: food.food_name,
        name: food.food_name,
        brandOwner: 'Generic',
        nutrients: {
          protein: food.full_nutrients.find(n => n.attr_id === 203)?.value || 0,
          carbs: food.full_nutrients.find(n => n.attr_id === 205)?.value || 0,
          fats: food.full_nutrients.find(n => n.attr_id === 204)?.value || 0
        }
      }));

      setSearchResults(formattedResults);
    } catch (error) {
      console.error('Error searching foods:', error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
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
          <div className="no-results">
            No foods found. Try a different search term.
          </div>
        )}
        {searchResults.map(food => (
          <div 
            key={food.id} 
            className={`food-result ${selectedFood?.id === food.id ? 'selected' : ''}`}
            onClick={() => handleFoodClick(food)}
          >
            <div className="food-info">
              <span className="food-name">{food.name}</span>
              <span className="food-brand">{food.brandOwner}</span>
            </div>
            <div className="food-macros">
              <span>Protein: {Math.round(food.nutrients.protein)}g</span>
              <span>Carbs: {Math.round(food.nutrients.carbs)}g</span>
              <span>Fat: {Math.round(food.nutrients.fats)}g</span>
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