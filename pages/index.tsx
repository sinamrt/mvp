// #import styles from '../styles/Home.module.css';
import styles from './pages/index.module.css';

const HomePage = () => {
  return (
    <div id="page-home" className="page">
      {/* Live Updates Section */}
      <div className="card" style={{ position: 'relative' }}>
        <div className="card-header">
          <div>
            <div className="card-title">📢 Live Updates</div>
            <div className="card-subtitle">Your latest notifications and recommendations</div>
          </div>
          <button className="btn btn-ghost btn-sm" id="view-all-updates">View All</button>
        </div>
        <div id="live-updates-list"></div>
      </div>

      {/* Stats Overview */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">1,247</div>
          <div className="stat-label">Total Calories</div>
        </div>
        <div className="stat-card" style={{ borderLeftColor: 'var(--brand-30)' }}>
          <div className="stat-value">52g</div>
          <div className="stat-label">Protein Today</div>
        </div>
        <div className="stat-card" style={{ borderLeftColor: '#10b981' }}>
          <div className="stat-value">7</div>
          <div className="stat-label">Day Streak</div>
        </div>
        <div className="stat-card" style={{ borderLeftColor: '#f59e0b' }}>
          <div className="stat-value">85%</div>
          <div className="stat-label">Goal Progress</div>
        </div>
      </div>

      {/* Daily Tip Widget */}
      <div 
        className="card" 
        style={{ 
          background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', 
          position: 'relative' 
        }}
      >
        <div className="card-header" style={{ borderBottom: 'none' }}>
          <div className="card-title">💡 Daily Nutrition Tip</div>
          <button className="btn btn-ghost btn-sm" id="refresh-tip-btn">🔄 New Tip</button>
        </div>
        <p 
          id="daily-tip-text" 
          style={{ 
            fontSize: '15px', 
            color: 'var(--brand-10)', 
            fontWeight: 500 
          }}
        >
          "Eat the rainbow – your mood thrives on colorful meals!"
        </p>
      </div>

      {/* Today's Meal Plan */}
      <div className="card" style={{ position: 'relative' }}>
        <div className="card-header">
          <div>
            <div className="card-title">🍽️ Today's Meal Plan</div>
            <div className="card-subtitle">Your personalized daily nutrition schedule</div>
          </div>
          <button className="btn btn-outline btn-sm" id="customize-plan-btn">Customize</button>
        </div>
        <div id="today-meals-list"></div>
        <div className="form-group" style={{ marginTop: '16px' }}>
          <label className="form-label">Select Date</label>
          <input type="date" className="form-input" id="plan-date-picker" />
        </div>
      </div>

      {/* Next-Up Meal Prep */}
      <div className="card" style={{ position: 'relative' }}>
        <div className="card-header">
          <div className="card-title">👨‍🍳 Next-Up Meal Prep</div>
        </div>
        <div id="next-meal-prep"></div>
      </div>

      {/* Explore Meals */}
      <div className="card" style={{ position: 'relative' }}>
        <div className="card-header">
          <div className="card-title">🌟 Explore Meals</div>
        </div>
        <div className="explore-grid" id="explore-meals-grid"></div>
      </div>
    </div>
  );
};

export default HomePage;
