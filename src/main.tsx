import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import AppInitializer from './components/AppInitializer/AppInitializer';


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppInitializer>
      <RouterProvider router={router} />
    </AppInitializer>
  </StrictMode>,
)
