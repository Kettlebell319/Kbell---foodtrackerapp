import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDumbbell, faPersonRunning, faWeightScale } from '@fortawesome/free-solid-svg-icons';

function MacroCalculator({ onSetGoals }) {
  const [stats, setStats] = useState({
    age: '',
    gender: 'male',
    heightFeet: '',
    heightInches: '',
    weightLbs: '',
    activityLevel: 'moderate',
    goal: 'maintenance',
    system: 'imperial' // default to imperial
  });

  const activityMultipliers = {
    sedentary: 1.2, // Little or no exercise
    light: 1.375, // Light exercise 1-3 days/week
    moderate: 1.55, // Moderate exercise 3-5 days/week
    active: 1.725, // Heavy exercise 6-7 days/week
    veryActive: 1.9 // Very heavy exercise, physical job
  };

  const goalMultipliers = {
    cut: 0.8, // 20% deficit
    maintenance: 1,
    bulk: 1.1 // 10% surplus
  };

  const convertToMetric = () => {
    // Convert height to cm
    const totalInches = (Number(stats.heightFeet) * 12) + Number(stats.heightInches);
    const heightCm = totalInches * 2.54;
    
    // Convert weight to kg
    const weightKg = Number(stats.weightLbs) * 0.453592;

    return {
      height: heightCm,
      weight: weightKg
    };
  };

  const calculateBMR = () => {
    const { height, weight } = convertToMetric();
    
    // Mifflin-St Jeor Equation
    if (stats.gender === 'male') {
      return (10 * weight) + (6.25 * height) - (5 * stats.age) + 5;
    } else {
      return (10 * weight) + (6.25 * height) - (5 * stats.age) - 161;
    }
  };

  const calculateTDEE = () => {
    const bmr = calculateBMR();
    return Math.round(bmr * activityMultipliers[stats.activityLevel]);
  };

  const calculateMacros = () => {
    const tdee = calculateTDEE();
    const targetCalories = Math.round(tdee * goalMultipliers[stats.goal]);
    
    let protein, carbs, fats;
    
    switch(stats.goal) {
      case 'cut':
        protein = Math.round((targetCalories * 0.40) / 4); // 40% protein
        fats = Math.round((targetCalories * 0.35) / 9); // 35% fats
        carbs = Math.round((targetCalories * 0.25) / 4); // 25% carbs
        break;
      case 'bulk':
        protein = Math.round((targetCalories * 0.30) / 4); // 30% protein
        fats = Math.round((targetCalories * 0.25) / 9); // 25% fats
        carbs = Math.round((targetCalories * 0.45) / 4); // 45% carbs
        break;
      default: // maintenance
        protein = Math.round((targetCalories * 0.30) / 4); // 30% protein
        fats = Math.round((targetCalories * 0.30) / 9); // 30% fats
        carbs = Math.round((targetCalories * 0.40) / 4); // 40% carbs
    }

    return { protein, carbs, fats, calories: targetCalories };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const macros = calculateMacros();
    onSetGoals(macros);
  };

  return (
    <div className="macro-calculator">
      <h2>Calculate Your Macro Goals</h2>
      <form onSubmit={handleSubmit}>
        <div className="calculator-row">
          <label>Age</label>
          <input
            type="number"
            value={stats.age}
            onChange={(e) => setStats({...stats, age: Number(e.target.value)})}
            placeholder="ages 18 - 80"
            required
          />
        </div>

        <div className="calculator-row">
          <label>Gender</label>
          <div className="radio-group">
            <label className={`radio-label ${stats.gender === 'male' ? 'selected' : ''}`}>
              <input
                type="radio"
                value="male"
                checked={stats.gender === 'male'}
                onChange={(e) => setStats({...stats, gender: e.target.value})}
              />
              male
            </label>
            <label className={`radio-label ${stats.gender === 'female' ? 'selected' : ''}`}>
              <input
                type="radio"
                value="female"
                checked={stats.gender === 'female'}
                onChange={(e) => setStats({...stats, gender: e.target.value})}
              />
              female
            </label>
          </div>
        </div>

        <div className="calculator-row">
          <label>Height</label>
          <div className="height-inputs">
            <input
              type="number"
              value={stats.heightFeet}
              onChange={(e) => setStats({...stats, heightFeet: e.target.value})}
              placeholder="feet"
              required
            />
            <span className="unit">feet</span>
            <input
              type="number"
              value={stats.heightInches}
              onChange={(e) => setStats({...stats, heightInches: e.target.value})}
              placeholder="inches"
              required
            />
            <span className="unit">inches</span>
          </div>
        </div>

        <div className="calculator-row">
          <label>Weight</label>
          <div className="weight-input">
            <input
              type="number"
              value={stats.weightLbs}
              onChange={(e) => setStats({...stats, weightLbs: e.target.value})}
              required
            />
            <span className="unit">pounds</span>
          </div>
        </div>

        <div className="calculator-row">
          <label>Activity</label>
          <select
            value={stats.activityLevel}
            onChange={(e) => setStats({...stats, activityLevel: e.target.value})}
          >
            <option value="sedentary">Sedentary: little or no exercise</option>
            <option value="light">Light: exercise 1-3 times/week</option>
            <option value="moderate">Moderate: exercise 4-5 times/week</option>
            <option value="active">Active: daily exercise</option>
            <option value="veryActive">Very Active: intense daily exercise</option>
          </select>
        </div>

        <div className="calculator-row">
          <label>Goals</label>
          <div className="goal-options">
            <div 
              className={`goal-card ${stats.goal === 'cut' ? 'selected' : ''}`}
              onClick={() => setStats({...stats, goal: 'cut'})}
            >
              <FontAwesomeIcon icon={faPersonRunning} className="goal-icon" />
              <span>Lose Weight</span>
            </div>
            <div 
              className={`goal-card ${stats.goal === 'maintenance' ? 'selected' : ''}`}
              onClick={() => setStats({...stats, goal: 'maintenance'})}
            >
              <FontAwesomeIcon icon={faWeightScale} className="goal-icon" />
              <span>Maintain Weight</span>
            </div>
            <div 
              className={`goal-card ${stats.goal === 'bulk' ? 'selected' : ''}`}
              onClick={() => setStats({...stats, goal: 'bulk'})}
            >
              <FontAwesomeIcon icon={faDumbbell} className="goal-icon" />
              <span>Gain Weight</span>
            </div>
          </div>
        </div>

        <div className="calculator-actions">
          <button type="submit" className="calculate-button">
            Calculate
          </button>
          <button type="button" className="clear-button" onClick={() => setStats({
            age: '',
            gender: 'male',
            heightFeet: '',
            heightInches: '',
            weightLbs: '',
            activityLevel: 'moderate',
            goal: 'maintenance',
            system: 'imperial'
          })}>
            Clear
          </button>
        </div>
      </form>

      {calculateBMR() > 0 && (
        <div className="calculator-results">
          <h3>Your Numbers:</h3>
          <p>BMR: {Math.round(calculateBMR())} calories</p>
          <p>TDEE: {calculateTDEE()} calories</p>
          <div className="macro-goals">
            <p>Recommended Daily Calories: {calculateMacros().calories}</p>
            <p>Protein: {calculateMacros().protein}g</p>
            <p>Carbs: {calculateMacros().carbs}g</p>
            <p>Fats: {calculateMacros().fats}g</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default MacroCalculator; 