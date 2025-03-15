import React, { useState } from 'react';
import FoodEntry from './components/FoodEntry';
import MacroSummary from './components/MacroSummary';
import './App.css';

function App() {
  const [meals, setMeals] = useState([]);

  const addMeal = (meal) => {
    setMeals([...meals, { ...meal, id: Date.now() }]);
  };

  return (
    <div className="App">
      <h1>Macro Tracker</h1>
      <FoodEntry onAddMeal={addMeal} />
      <MacroSummary meals={meals} />
    </div>
  );
}

export default App; 