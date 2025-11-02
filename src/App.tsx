import React from "react";
import AppHeader from "./components/AppHeader";
import "./styles/variables.css"; // Import global theme

function App() {
  const handleSearch = (query: string) => {
    console.log("Searching for:", query);
    // Implement your search logic here
  };

  const handleNewChallenge = () => {
    console.log("Creating new challenge");
    // Implement your challenge creation logic
  };

  const handleNotifications = () => {
    console.log("Opening notifications");
    // Implement your notifications logic
  };

  return (
    <div className="app">
      <AppHeader
        userName="Maziar"
        notificationsCount={3}
        onSearch={handleSearch}
        onNewChallenge={handleNewChallenge}
        onNotificationClick={handleNotifications}
      />
      
      {/* Rest of your app */}
      <main>
        <h1>Welcome to Meals4V</h1>
      </main>
    </div>
  );
}

export default App;
