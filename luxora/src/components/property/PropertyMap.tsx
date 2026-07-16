import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Bed, Bath, ShieldCheck, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import type { Property } from '../../types';
import { ROUTES } from '../../constants/routes';

interface PropertyMapProps {
  properties: Property[];
  className?: string;
}

// Helper to auto-fit map bounds to markers
function MapBounds({ properties }: { properties: Property[] }) {
  const map = useMap();

  useEffect(() => {
    if (!properties || properties.length === 0) return;

    const bounds = L.latLngBounds(
      properties
        .filter(p => p.coordinates)
        .map(p => [p.coordinates!.lat, p.coordinates!.lng])
    );
    
    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    }
  }, [map, properties]);

  return null;
}

// Generate custom Luxora markers based on property data
const createCustomMarker = (property: Property) => {
  let bgColor = 'bg-navy-900';
  let borderColor = 'border-white/20';
  let textColor = 'text-cream';

  if (property.featuredLevel === 'Exclusive' || property.featuredLevel === 'Premium') {
    bgColor = 'bg-gold-400';
    borderColor = 'border-gold-500';
    textColor = 'text-navy-950';
  } else if (property.tag === 'Verified' || property.verified?.length) {
    bgColor = 'bg-emerald-400';
    borderColor = 'border-emerald-500';
    textColor = 'text-navy-950';
  } else if (property.status === 'Sold' || property.status === 'Rented') {
    bgColor = 'bg-ink/50';
    borderColor = 'border-ink/80';
    textColor = 'text-white/80';
  }

  const html = `
    <div class="relative flex items-center justify-center">
      <div class="absolute -bottom-2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-${bgColor.replace('bg-', '')}"></div>
      <div class="flex items-center justify-center rounded-full border-2 ${borderColor} ${bgColor} ${textColor} px-2 py-1 shadow-xl backdrop-blur-md">
        <span class="text-xs font-bold whitespace-nowrap">₦${(property.priceValue / 1000000).toFixed(0)}M</span>
      </div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-leaflet-marker',
    iconSize: [60, 30],
    iconAnchor: [30, 30],
    popupAnchor: [0, -35]
  });
};

export function PropertyMap({ properties, className = 'h-full w-full' }: PropertyMapProps) {
  const navigate = useNavigate();
  
  // Default to Lagos center if no properties have coordinates
  const defaultCenter: [number, number] = [6.4531, 3.4346];
  
  const propertiesWithCoords = properties.filter(p => p.coordinates);

  return (
    <div className={`relative ${className} z-0`}>
      <MapContainer 
        center={defaultCenter} 
        zoom={12} 
        scrollWheelZoom={true} 
        className="h-full w-full rounded-2xl border border-white/10"
        style={{ background: '#0B1120' }} // navy-950
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          // We use cartocdn for a cleaner, modern look suitable for a luxury theme
        />
        
        <MapBounds properties={propertiesWithCoords} />

        {propertiesWithCoords.map((property) => (
          <Marker 
            key={property.id} 
            position={[property.coordinates!.lat, property.coordinates!.lng]}
            icon={createCustomMarker(property)}
          >
            <Popup className="luxora-map-popup">
              <div className="flex flex-col w-64 p-0 overflow-hidden rounded-xl bg-navy-900 border border-white/10 shadow-2xl">
                <div className="relative h-32 w-full">
                  <img src={property.image} alt={property.title} className="object-cover w-full h-full" />
                  {property.featuredLevel && (
                    <div className="absolute top-2 left-2 rounded-full bg-gold-400 px-2 py-0.5 text-[10px] font-bold uppercase text-navy-950">
                      {property.featuredLevel}
                    </div>
                  )}
                  {property.verified?.length && property.verified.length > 0 && (
                    <div className="absolute top-2 right-2 flex items-center justify-center rounded-full bg-navy-900/80 p-1 backdrop-blur-md">
                      <ShieldCheck className="h-3 w-3 text-emerald-400" />
                    </div>
                  )}
                </div>
                
                <div className="p-3">
                  <div className="font-heading text-lg font-bold text-gold-400 mb-1">{property.price}</div>
                  <h4 className="font-heading text-sm font-semibold text-cream truncate">{property.title}</h4>
                  <div className="text-xs text-ink/60 truncate flex items-center gap-1 mt-1 mb-3">
                    <MapPin className="h-3 w-3" /> {property.location}
                  </div>
                  
                  <div className="flex items-center gap-3 border-t border-white/10 pt-3">
                    <div className="flex items-center gap-1 text-xs text-ink/70">
                      <Bed className="h-3 w-3" /> {property.beds}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-ink/70">
                      <Bath className="h-3 w-3" /> {property.baths}
                    </div>
                    <div className="flex-1"></div>
                    <button 
                      onClick={() => navigate(ROUTES.PROPERTY_DETAILS.replace(':id', property.id))}
                      className="text-xs font-semibold text-gold-400 hover:text-gold-300 transition-colors"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Global CSS overrides for Leaflet Popups to match dark theme */}
      <style>{`
        .luxora-map-popup .leaflet-popup-content-wrapper {
          padding: 0;
          background: transparent;
          border-radius: 0.75rem;
          box-shadow: none;
        }
        .luxora-map-popup .leaflet-popup-content {
          margin: 0;
          width: 100% !important;
        }
        .luxora-map-popup .leaflet-popup-tip-container {
          display: none;
        }
        .custom-leaflet-marker {
          background: transparent;
          border: none;
        }
      `}</style>
    </div>
  );
}
