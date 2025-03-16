import React, { useState } from 'react';

function FoodSearch({ onSelectFood }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchFood = async (term) => {
    if (!term) return;
    setLoading(true);
    try {
      // Replace with your actual API endpoint
      const response = await fetch(`YOUR_FOOD_API_ENDPOINT?query=${term}`);
      const data = await response.json();
      setSearchResults(data);
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