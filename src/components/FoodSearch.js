import React, { useState } from 'react';

const API_KEY = process.env.REACT_APP_USDA_API_KEY;
const API_ENDPOINT = 'https://api.nal.usda.gov/fdc/v1/foods/search';

function FoodSearch({ onSelectFood }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchFood = async (term) => {
    if (!term) return;
    setLoading(true);
    try {
      const response = await fetch(`${API_ENDPOINT}?api_key=${API_KEY}&query=${term}`);
      const data = await response.json();
      
      const formattedResults = data.foods.map(food => ({
        id: food.fdcId,
        name: food.description,
        protein: food.foodNutrients.find(n => n.nutrientName === 'Protein')?.value || 0,
        carbs: food.foodNutrients.find(n => n.nutrientName === 'Carbohydrate')?.value || 0,
        fats: food.foodNutrients.find(n => n.nutrientName === 'Total lipid (fat)')?.value || 0
      }));

      setSearchResults(formattedResults);
    } catch (error) {
      console.error('Error searching foods:', error);
    }
    setLoading(false);
  };

  return (
    <div className="food-search">
      <div className="search-input">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search for a food..."
        />
        <button onClick={() => searchFood(searchTerm)}>Search</button>
      </div>
      
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="search-results">
          {searchResults.map(food => (
            <div 
              key={food.id} 
              className="food-result"
              onClick={() => onSelectFood(food)}
            >
              <span>{food.name}</span>
              <div className="food-macros">
                <span>P: {food.protein}g</span>
                <span>C: {food.carbs}g</span>
                <span>F: {food.fats}g</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default FoodSearch; 