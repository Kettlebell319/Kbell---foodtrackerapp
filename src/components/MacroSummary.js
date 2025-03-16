import React from 'react';

function MacroSummary({ meals, goals }) {
  const calculateDailyMacros = () => {
    return {
      protein: meals.reduce((sum, meal) => sum + meal.protein, 0),
      carbs: meals.reduce((sum, meal) => sum + meal.carbs, 0),
      fats: meals.reduce((sum, meal) => sum + meal.fats, 0),
    };
  };

  const dailyMacros = calculateDailyMacros();

  const calculatePercentage = (current, goal) => {
    return Math.min(Math.round((current / goal) * 100), 100);
  };

  return (
    <div className="macro-summary">
      <div className="daily-summary">
        <h2>Today's Macros</h2>
        
        <div className="macro-progress">
          <label>Protein: {dailyMacros.protein}g / {goals.protein}g</label>
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${calculatePercentage(dailyMacros.protein, goals.protein)}%` }}
            />
          </div>
        </div>

        <div className="macro-progress">
          <label>Carbs: {dailyMacros.carbs}g / {goals.carbs}g</label>
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${calculatePercentage(dailyMacros.carbs, goals.carbs)}%` }}
            />
          </div>
        </div>

        <div className="macro-progress">
          <label>Fats: {dailyMacros.fats}g / {goals.fats}g</label>
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${calculatePercentage(dailyMacros.fats, goals.fats)}%` }}
            />
          </div>
        </div>

        <p>Total Calories: {(dailyMacros.protein * 4) + (dailyMacros.carbs * 4) + (dailyMacros.fats * 9)}</p>
      </div>
    </div>
  );
}

export default MacroSummary; 