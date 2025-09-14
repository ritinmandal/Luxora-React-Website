import React from 'react';
import './App.css';
import Routing from './Routing/Routing';
import '@fontsource/playfair-display';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <div className="App">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            fontFamily: "'Playfair Display', serif",
          },
        }}
      />
      <Routing />
    </div>
  );
}

export default App;
