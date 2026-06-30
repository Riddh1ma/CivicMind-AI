import { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { Sparkles, ShieldCheck, Map as MapIcon, Calendar } from 'lucide-react';
import { subscribeToReports, type Report } from '../../services/reportService';
import { MAP_DARK_STYLES } from './MapStyles';

const mapContainerStyle = {
  width: '100%',
  height: '100%',
  minHeight: '400px',
};

const mapOptions = {
  styles: MAP_DARK_STYLES,
  disableDefaultUI: true,
  zoomControl: true,
};

export default function NearbyIssuesPanel() {
  const [reportsList, setReportsList] = useState<Report[]>([]);
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [mapCenter, setMapCenter] = useState({ lat: 37.7749, lng: -122.4194 }); // default SF
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [activeReport, setActiveReport] = useState<Report | null>(null);
  const [mapInstance, setMapInstance] = useState<any>(null);

  const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

  // Log mapCenter and userLocation updates
  useEffect(() => {
    console.log("Map Center:", mapCenter);
    console.log("State Coordinates (User Location):", userLocation);
  }, [mapCenter, userLocation]);

  // Direct panTo call to force map centering updates on the raw instance
  useEffect(() => {
    if (mapInstance && mapCenter) {
      mapInstance.panTo(mapCenter);
      console.log("Nearby Map recentered successfully to:", mapCenter);
    }
  }, [mapInstance, mapCenter]);

  // Subscribe to real-time Firestore reports feed and load user coordinates
  useEffect(() => {
    const unsubscribe = subscribeToReports((data) => {
      setReportsList(data);
      console.log("Firestore Coordinates (all loaded report pins):", data.map(r => ({
        id: r.reportId,
        lat: r.latitude || r.location?.latitude,
        lng: r.longitude || r.location?.longitude
      })));
    });

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log("Browser Coordinates:", { lat: position.coords.latitude, lng: position.coords.longitude });
          console.log("Browser Latitude:", position.coords.latitude);
          console.log("Browser Longitude:", position.coords.longitude);
          console.log("Accuracy:", position.coords.accuracy);
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          console.log("Map center updated by navigator.geolocation in NearbyIssuesPanel:", coords);
          setMapCenter(coords);
          setUserLocation(coords);
        },
        (error) => {
          console.error('Error loading browser coords for Nearby map:', error);
        }
      );
    }

    return () => unsubscribe();
  }, []);

  const getMarkerIcon = (priority: string, status: string) => {
    if (status && status.toLowerCase() === 'resolved') {
      return 'https://maps.google.com/mapfiles/ms/icons/green-dot.png';
    }
    switch (priority.toLowerCase()) {
      case 'critical':
        return 'https://maps.google.com/mapfiles/ms/icons/red-dot.png';
      case 'high':
        return 'https://maps.google.com/mapfiles/ms/icons/orange-dot.png';
      case 'medium':
        return 'https://maps.google.com/mapfiles/ms/icons/yellow-dot.png';
      default:
        return 'https://maps.google.com/mapfiles/ms/icons/green-dot.png';
    }
  };

  const handleMarkerClick = (rep: Report) => {
    setSelectedReportId(rep.reportId);
    setActiveReport(rep);
  };

  // Add temporary logs for debugging coordinate flow
  useEffect(() => {
    console.log("Map center after render (Nearby):", mapCenter);
  });
  console.log("Map center before render (Nearby):", mapCenter);

  return (
    <div className="space-y-8 text-left">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Nearby Community Issues</h2>
        <p className="text-xs text-zinc-550 mt-1">Real-time geographical telemetry of reports submitted by citizens near you.</p>
      </div>

      {/* Map Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left Google Map Canvas (col-span-8) */}
        <div className="lg:col-span-8 relative rounded-3xl border border-zinc-900 bg-zinc-950/40 overflow-hidden min-h-[400px] flex items-center justify-center">
          {googleMapsApiKey ? (
            <LoadScript googleMapsApiKey={googleMapsApiKey}>
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={mapCenter}
                zoom={13}
                options={mapOptions}
                onLoad={(map) => {
                  setMapInstance(map);
                  console.log("Nearby Map loaded successfully");
                }}
                onUnmount={() => {
                  setMapInstance(null);
                }}
              >
                {/* User blue dot */}
                {userLocation && (
                  <Marker
                    position={userLocation}
                    icon="https://maps.google.com/mapfiles/ms/icons/blue-dot.png"
                    title="Your Location"
                  />
                )}

                {/* Firestore incident pins */}
                {reportsList.map((rep) => {
                  const lat = rep.latitude || rep.location?.latitude;
                  const lng = rep.longitude || rep.location?.longitude;
                  
                  if (!lat || !lng) return null;

                  return (
                    <Marker
                      key={rep.reportId}
                      position={{ lat, lng }}
                      icon={getMarkerIcon(rep.priority, rep.status)}
                      onClick={() => handleMarkerClick(rep)}
                    >
                      {selectedReportId === rep.reportId && (
                        <InfoWindow onCloseClick={() => setSelectedReportId(null)}>
                          <div className="text-zinc-950 p-2.5 text-xs font-semibold max-w-[220px]">
                            <h4 className="font-extrabold text-[13px] border-b pb-1 mb-1">{rep.category}</h4>
                            <p className="text-[10px] text-zinc-600 leading-normal mb-1">{rep.location.address || rep.address}</p>
                            <div className="flex gap-1.5 mt-2 text-[8px] font-extrabold uppercase">
                              <span className={`px-1.5 py-0.5 rounded border ${
                                rep.priority === 'critical' ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-zinc-100 text-zinc-700'
                              }`}>
                                {rep.priority}
                              </span>
                              <span className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                                {rep.status}
                              </span>
                            </div>
                          </div>
                        </InfoWindow>
                      )}
                    </Marker>
                  );
                })}
              </GoogleMap>
            </LoadScript>
          ) : (
            <div className="h-[400px] flex items-center justify-center text-xs text-zinc-550 font-mono">
              [VITE_GOOGLE_MAPS_API_KEY Missing]
            </div>
          )}

          <div className="absolute top-4 left-4 p-3 rounded-xl bg-zinc-900/90 border border-zinc-800 backdrop-blur-md flex items-center gap-1.5 text-xs text-white font-bold">
            <MapIcon className="w-4 h-4 text-primary" /> Live GIS Coordinate Map
          </div>
        </div>

        {/* Right Info Drawer (col-span-4) */}
        <div className="lg:col-span-4 flex flex-col justify-between">
          <div className="p-6 rounded-3xl border border-zinc-900 bg-zinc-950/40 flex-grow flex flex-col justify-between">
            {activeReport ? (
              <div className="space-y-5">
                <div className="flex justify-between items-start border-b border-zinc-900 pb-3">
                  <div>
                    <h4 className="text-sm font-bold text-white">{activeReport.category}</h4>
                    <span className="text-[10px] text-zinc-550 block mt-0.5">UID: {activeReport.reportId.slice(0, 8)}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[8px] font-extrabold uppercase border ${
                    activeReport.priority === 'critical' 
                      ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' 
                      : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                  }`}>
                    {activeReport.priority}
                  </span>
                </div>

                {activeReport.imageUrl && (
                  <div className="w-full h-28 rounded-xl overflow-hidden bg-zinc-900 border border-zinc-850">
                    <img src={activeReport.imageUrl} alt="Evidence" className="w-full h-full object-cover" />
                  </div>
                )}

                <p className="text-xs text-zinc-450 leading-relaxed font-semibold">
                  {activeReport.description}
                </p>

                <div className="space-y-3.5 text-xs text-zinc-555 font-semibold pt-2">
                  <div className="flex justify-between">
                    <span>Address</span>
                    <span className="text-white max-w-[150px] truncate">{activeReport.address || activeReport.location.address}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status</span>
                    <span className="text-white flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-primary" /> {activeReport.status}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Date Filed</span>
                    <span className="text-white flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {activeReport.createdAt?.seconds 
                        ? new Date(activeReport.createdAt.seconds * 1000).toLocaleDateString()
                        : new Date().toLocaleDateString()
                      }
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center text-zinc-600 flex-grow">
                <Sparkles className="w-6 h-6 animate-pulse mb-2.5" />
                <span className="text-xs font-bold uppercase tracking-wider">Select a Map Pin</span>
                <p className="text-[10px] text-zinc-500 mt-1 max-w-[180px]">
                  Click any marker pin on the Google Map to load the active dispatch detail log.
                </p>
              </div>
            )}

            <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-900 text-[10px] text-zinc-550 leading-relaxed mt-6">
              <strong>GIS Overlay Active:</strong> Local coordinates update automatically when reports are filed.
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
