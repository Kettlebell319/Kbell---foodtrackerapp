import React, { useState, useEffect } from 'react';
import FoodEntry from './components/FoodEntry';
import MacroSummary from './components/MacroSummary';
import './App.css';

function App() {
  const [meals, setMeals] = useState(() => {
    // Load saved meals from localStorage
    const savedMeals = localStorage.getItem('meals');
    return savedMeals ? JSON.parse(savedMeals) : [];
  });
  
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [macroGoals, setMacroGoals] = useState({
    protein: 180,
    carbs: 250,
    fats: 70
  });

  // Save meals to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('meals', JSON.stringify(meals));
  }, [meals]);

  const addMeal = (meal) => {
    setMeals([...meals, { 
      ...meal, 
      id: Date.now(),
      date: selectedDate,
      category: meal.category || 'other'
    }]);
  };

  const deleteMeal = (id) => {
    setMeals(meals.filter(meal => meal.id !== id));
  };

  const getTodaysMeals = () => {
    return meals.filter(meal => meal.date === selectedDate);
  };

  return (
    <div className="App">
      <h1>Macro Tracker</h1>
      
      <div className="date-selector">
        <input 
          type="date" 
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>

      <div className="macro-goals">
        <h2>Daily Goals</h2>
        <div className="goals-inputs">
          <input 
            type="number" 
            value={macroGoals.protein}
            onChange={(e) => setMacroGoals({...macroGoals, protein: Number(e.target.value)})}
            placeholder="Protein Goal (g)"
          />
          <input 
            type="number" 
            value={macroGoals.carbs}
            onChange={(e) => setMacroGoals({...macroGoals, carbs: Number(e.target.value)})}
            placeholder="Carbs Goal (g)"
          />
          <input 
            type="number" 
            value={macroGoals.fats}
            onChange={(e) => setMacroGoals({...macroGoals, fats: Number(e.target.value)})}
            placeholder="Fats Goal (g)"
          />
        </div>
      </div>

      <FoodEntry onAddMeal={addMeal} />
      
      <div className="meals-list">
        <h2>Today's Foods</h2>
        {getTodaysMeals().map(meal => (
          <div key={meal.id} className="meal-item">
            <span className="meal-name">{meal.name}</span>
            <div className="macro-values">
              <span>P: {meal.protein}g</span>
              <span>C: {meal.carbs}g</span>
              <span>F: {meal.fats}g</span>
            </div>
            <button onClick={() => deleteMeal(meal.id)}>Delete</button>
          </div>
        ))}
      </div>

      <MacroSummary 
        meals={getTodaysMeals()} 
        goals={macroGoals}
      />
    </div>
  );
}

export default App; 