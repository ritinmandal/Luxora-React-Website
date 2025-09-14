import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import '@fontsource/great-vibes';
import {store} from '../src/Redux/Store/Store.js'
import { Provider } from 'react-redux';
import { CartProvider } from './Components/CartContext.jsx'


createRoot(document.getElementById('root')).render(
  <Provider store={store}>  
  <BrowserRouter>
  <CartProvider>
  <StrictMode>
    <App />
  </StrictMode>,
  </CartProvider>
  </BrowserRouter>

  </Provider>
)
