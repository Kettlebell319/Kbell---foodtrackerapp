import React from 'react';

function MacroSummary({ meals }) {
  const calculateDailyMacros = () => {
    const today = new Date().toDateString();
    const todayMeals = meals.filter(
      (meal) => meal.date.toDateString() === today
    );

    return {
      protein: todayMeals.reduce((sum, meal) => sum + meal.protein, 0),
      carbs: todayMeals.reduce((sum, meal) => sum + meal.carbs, 0),
      fats: todayMeals.reduce((sum, meal) => sum + meal.fats, 0),
    };
  };

  const calculateWeeklyMacros = () => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const weekMeals = meals.filter(
      (meal) => meal.date > oneWeekAgo
    );

    return {
      protein: weekMeals.reduce((sum, meal) => sum + meal.protein, 0),
      carbs: weekMeals.reduce((sum, meal) => sum + meal.carbs, 0),
      fats: weekMeals.reduce((sum, meal) => sum + meal.fats, 0),
    };
  };

  const dailyMacros = calculateDailyMacros();
  const weeklyMacros = calculateWeeklyMacros();

  return (
    <div className="macro-summary">
      <div className="daily-summary">
        <h2>Today's Macros</h2>
        <p>Protein: {dailyMacros.protein}g</p>
        <p>Carbs: {dailyMacros.carbs}g</p>
        <p>Fats: {dailyMacros.fats}g</p>
        <p>Total Calories: {(dailyMacros.protein * 4) + (dailyMacros.carbs * 4) + (dailyMacros.fats * 9)}</p>
      </div>
      
      <div className="weekly-summary">
        <h2>This Week's Macros</h2>
        <p>Protein: {weeklyMacros.protein}g</p>
        <p>Carbs: {weeklyMacros.carbs}g</p>
        <p>Fats: {weeklyMacros.fats}g</p>
        <p>Average Daily Calories: {((weeklyMacros.protein * 4) + (weeklyMacros.carbs * 4) + (weeklyMacros.fats * 9)) / 7}</p>
      </div>
    </div>
  );
}

export default MacroSummary; 