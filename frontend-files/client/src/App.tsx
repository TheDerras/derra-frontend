import React from "react";
import { Route, Switch } from "wouter";

// Import your page components here
import HomePage from "./pages/home";
import NotFound from "./pages/not-found";

function App() {
  return (
    <div className="app">
      <Switch>
        <Route path="/" component={HomePage} />
        <Route component={NotFound} />
      </Switch>
    </div>
  );
}

export default App;