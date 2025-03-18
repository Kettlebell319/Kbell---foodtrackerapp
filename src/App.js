import React, { useState, useEffect } from 'react';
import FoodEntry from './components/FoodEntry';
import MacroSummary from './components/MacroSummary';
import './App.css';

function App() {
  const [meals, setMeals] = useState(() => {
    const savedMeals = localStorage.getItem('meals');
    return savedMeals ? JSON.parse(savedMeals) : [];
  });
  
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [macroGoals, setMacroGoals] = useState({
    protein: 180,
    carbs: 250,
    fats: 70
  });

  useEffect(() => {
    localStorage.setItem('meals', JSON.stringify(meals));
  }, [meals]);

  const addMeal = (meal) => {
    setMeals([...meals, { 
      ...meal, 
      id: Date.now(),
      date: selectedDate,
      time: new Date().toLocaleTimeString() // Add timestamp
    }]);
  };

  const deleteMeal = (id) => {
    setMeals(meals.filter(meal => meal.id !== id));
  };

  const getTodaysMeals = () => {
    return meals.filter(meal => meal.date === selectedDate);
  };

  const calculateWeeklyStats = () => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const weekMeals = meals.filter(meal => {
      const mealDate = new Date(meal.date);
      return mealDate >= oneWeekAgo;
    });

    const dailyStats = {};
    weekMeals.forEach(meal => {
      if (!dailyStats[meal.date]) {
        dailyStats[meal.date] = {
          protein: 0,
          carbs: 0,
          fats: 0,
          calories: 0,
          mealCount: 0
        };
      }
      dailyStats[meal.date].protein += meal.protein;
      dailyStats[meal.date].carbs += meal.carbs;
      dailyStats[meal.date].fats += meal.fats;
      dailyStats[meal.date].calories += (meal.protein * 4) + (meal.carbs * 4) + (meal.fats * 9);
      dailyStats[meal.date].mealCount += 1;
    });

    const daysWithMeals = Object.keys(dailyStats).length;
    const totalStats = Object.values(dailyStats).reduce((acc, day) => ({
      protein: acc.protein + day.protein,
      carbs: acc.carbs + day.carbs,
      fats: acc.fats + day.fats,
      calories: acc.calories + day.calories
    }), { protein: 0, carbs: 0, fats: 0, calories: 0 });

    return {
      total: totalStats,
      daily: {
        protein: totalStats.protein / daysWithMeals,
        carbs: totalStats.carbs / daysWithMeals,
        fats: totalStats.fats / daysWithMeals,
        calories: totalStats.calories / daysWithMeals
      }
    };
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
        {getTodaysMeals()
          .sort((a, b) => new Date('1970/01/01 ' + a.time) - new Date('1970/01/01 ' + b.time))
          .map(meal => (
            <div key={meal.id} className="meal-item">
              <div className="meal-time">{meal.time}</div>
              <div className="meal-info">
                <span className="meal-name">{meal.name}</span>
              </div>
              <div className="macro-values">
                <span>P: {meal.protein}g</span>
                <span>C: {meal.carbs}g</span>
                <span>F: {meal.fats}g</span>
              </div>
              <i className="fas fa-trash delete-icon" onClick={() => deleteMeal(meal.id)}></i>
            </div>
          ))}
      </div>

      <MacroSummary 
        meals={getTodaysMeals()} 
        goals={macroGoals}
      />

      <div className="weekly-summary">
        <h2>Weekly Overview</h2>
        {(() => {
          const stats = calculateWeeklyStats();
          return (
            <>
              <div className="weekly-totals">
                <h3>Weekly Totals</h3>
                <p>Total Calories: {Math.round(stats.total.calories)}</p>
                <p>Total Protein: {Math.round(stats.total.protein)}g</p>
                <p>Total Carbs: {Math.round(stats.total.carbs)}g</p>
                <p>Total Fats: {Math.round(stats.total.fats)}g</p>
              </div>
              <div className="daily-averages">
                <h3>Daily Averages</h3>
                <p>Average Calories: {Math.round(stats.daily.calories)}</p>
                <p>Average Protein: {Math.round(stats.daily.protein)}g</p>
                <p>Average Carbs: {Math.round(stats.daily.carbs)}g</p>
                <p>Average Fats: {Math.round(stats.daily.fats)}g</p>
              </div>
            </>
          );
        })()}
      </div>
    </div>
  );
}

export default App; 