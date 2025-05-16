
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
// Import leaflet CSS directly from node_modules
import 'leaflet/dist/leaflet.css'
import './components/map/map.css'

createRoot(document.getElementById("root")!).render(<App />);
