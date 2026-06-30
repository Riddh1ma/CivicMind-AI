import { useState, useEffect, useRef, type DragEvent, type ChangeEvent } from 'react';
import { UploadCloud, Trash2, MapPin, Sparkles, AlertCircle, Cpu } from 'lucide-react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { submitReport } from '../../services/reportService';
import { useAuth } from '../../hooks/useAuth';
import { MAP_DARK_STYLES } from '../dashboard/MapStyles';
import { uploadImageToStorage, analyzeImageWithGemini } from '../../services/aiService';
import { incrementUserReportsCount } from '../../services/authService';

interface ReportFormProps {
  onSubmitSuccess: (reportId: string, category: string, description: string) => void;
}

const CATEGORIES = [
  'Road Damage',
  'Water Leakage',
  'Streetlight',
  'Garbage',
  'Traffic',
  'Drainage',
  'Graffiti',
  'Other'
];

const mapContainerStyle = {
  width: '100%',
  height: '220px',
  borderRadius: '16px',
  border: '1px solid #27272a',
};

const mapOptions = {
  styles: MAP_DARK_STYLES,
  disableDefaultUI: true,
  zoomControl: true,
};

export default function ReportForm({ onSubmitSuccess }: ReportFormProps) {
  const { user } = useAuth();
  
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [address, setAddress] = useState('');
  
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  const [mapCenter, setMapCenter] = useState({ lat: 37.7749, lng: -122.4194 }); // default San Francisco
  const [mapInstance, setMapInstance] = useState<any>(null);

  // Gemini AI Assisted Triage States
  const [uploadedImageUrl, setUploadedImageUrl] = useState('');
  const [aiSummary, setAiSummary] = useState('');
  const [severity, setSeverity] = useState<'low' | 'medium' | 'high' | 'critical' | 'pending'>('pending');
  const [department, setDepartment] = useState('');
  const [confidence, setConfidence] = useState(0);
  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

  // Sync state coordinates to mapCenter & log state/map values
  useEffect(() => {
    console.log("State Coordinates (Fields):", { latitude, longitude });
    console.log("Map Center Coordinates:", mapCenter);

    if (latitude && longitude) {
      const latNum = parseFloat(latitude);
      const lngNum = parseFloat(longitude);
      if (!isNaN(latNum) && !isNaN(lngNum)) {
        const coords = { lat: latNum, lng: lngNum };
        if (mapCenter.lat !== coords.lat || mapCenter.lng !== coords.lng) {
          console.log("Map center updated in ReportForm sync effect (triggered by fields change):", coords);
          setMapCenter(coords);
        }
      }
    }
  }, [latitude, longitude, mapCenter]);
  // Direct panTo call to force map centering updates on the raw instance
  useEffect(() => {
    if (mapInstance && mapCenter) {
      mapInstance.panTo(mapCenter);
      console.log("Map recentered successfully to:", mapCenter);
    }
  }, [mapInstance, mapCenter]);
  // Get user location on component mount
  useEffect(() => {
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
          console.log("Coordinates set on mount by navigator.geolocation in ReportForm:", coords);
          setLatitude(coords.lat.toFixed(6));
          setLongitude(coords.lng.toFixed(6));
        },
        (error) => {
          console.error('Error getting browser position on load:', error);
        }
      );
    }
  }, []);

  // Drag and drop events
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles && droppedFiles.length > 0) {
      processFile(droppedFiles[0]);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      processFile(selectedFiles[0]);
    }
  };

  const processFile = async (selectedFile: File) => {
    if (!selectedFile.type.match('image.*')) {
      setErrorMsg('Please select a valid image file (PNG, JPG, JPEG).');
      return;
    }
    
    setErrorMsg(null);
    setIsUploading(true);
    setUploadProgress(0);
    setUploadedImageUrl('');
    setConfidence(0);

    try {
      // 1. Upload to Firebase Storage
      setUploadProgress(15);
      const downloadUrl = await uploadImageToStorage(selectedFile);
      setUploadProgress(50);
      setUploadedImageUrl(downloadUrl);
      setImagePreview(downloadUrl);

      // 2. Call Gemini Vision API
      setIsAiAnalyzing(true);
      setUploadProgress(75);
      const aiResult = await analyzeImageWithGemini(selectedFile);
      setUploadProgress(100);

      // Auto-fill fields
      setCategory(aiResult.category);
      setDescription(aiResult.aiSummary);
      setAiSummary(aiResult.aiSummary);
      setSeverity(aiResult.severity);
      setDepartment(aiResult.department);
      setConfidence(aiResult.confidence);
    } catch (err: any) {
      console.error('File upload/analysis pipeline failed:', err);
      setErrorMsg('AI analysis failed. You can still fill the form details manually.');
      setImagePreview(URL.createObjectURL(selectedFile));
    } finally {
      setIsUploading(false);
      setIsAiAnalyzing(false);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setUploadedImageUrl('');
    setUploadProgress(0);
    setConfidence(0);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Auto-locate converting coordinates to readable address using Google Geocoding API
  const handleGeolocate = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          console.log("Browser Coordinates:", { lat: position.coords.latitude, lng: position.coords.longitude });
          console.log("Browser Latitude:", position.coords.latitude);
          console.log("Browser Longitude:", position.coords.longitude);
          console.log("Accuracy:", position.coords.accuracy);
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          console.log("Coordinates set by handleGeolocate (Auto-locate click) in ReportForm:", { lat, lng });
          setLatitude(lat.toFixed(6));
          setLongitude(lng.toFixed(6));
          // Reverse geocode via Google API
          try {
            const res = await fetch(
              `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${googleMapsApiKey}`
            );
            const data = await res.json();
            if (data.status === 'OK' && data.results.length > 0) {
              setAddress(data.results[0].formatted_address);
            } else {
              setAddress(`Coordinates: ${lat.toFixed(4)}, ${lng.toFixed(4)}`);
            }
          } catch (err) {
            console.error('Google reverse geocoding request failed:', err);
            setAddress(`Coordinates: ${lat.toFixed(4)}, ${lng.toFixed(4)}`);
          }
        },
        (error) => {
          console.error('Browser geolocation failed:', error);
          setErrorMsg('Unable to retrieve coordinates. Please enter manually.');
        }
      );
    } else {
      setErrorMsg('Geolocation is not supported by your browser.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    if (!category) {
      setErrorMsg('Please select an issue category.');
      return;
    }
    if (!description.trim()) {
      setErrorMsg('Please enter a brief description.');
      return;
    }
    if (!latitude || !longitude) {
      setErrorMsg('Please provide coordinate values.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const finalImgUrl = uploadedImageUrl || '';
      
      const reportId = await submitReport({
        reportedBy: user.uid,
        userId: user.uid,
        title: `${category} reported at ${address || 'Local Coordinates'}`,
        description,
        category,
        location: {
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
          address: address || 'Metroville Sector 5',
        },
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        address: address || 'Metroville Sector 5',
        imageUrl: finalImgUrl,
        aiSummary: aiSummary || description,
        confidence: confidence || 0.85,
        priority: severity !== 'pending' ? severity : 'medium',
        severity: severity !== 'pending' ? severity : 'medium',
        department: department || 'Public Works',
      });

      // Atomically increment reportsSubmitted counter in Firestore user profile
      await incrementUserReportsCount(user.uid);

      onSubmitSuccess(reportId, category, description);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to submit report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Debugging console logs
  console.log("Current coordinates:", { latitude, longitude });
  console.log("Map center:", mapCenter);
  console.log("Marker position:", mapCenter);
  console.log("Map loaded status:", !!mapInstance);

  // Add temporary logs for debugging coordinate flow
  useEffect(() => {
    console.log("Map center after render:", mapCenter);
  });
  console.log("Map center before render:", mapCenter);

  return (
    <div className="glass-card rounded-[28px] border border-zinc-800 bg-zinc-950/30 p-8 shadow-[0_12px_40px_rgba(0,0,0,0.5)]">
      <div className="flex items-center gap-2 mb-6 text-left">
        <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
          <Sparkles className="w-4 h-4 animate-pulse" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Report New Issue</h2>
          <p className="text-[11px] text-zinc-550">Provide details for autonomous AI dispatch classification.</p>
        </div>
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 rounded-xl border border-rose-500/20 bg-rose-500/5 text-rose-500 text-xs font-semibold flex items-center gap-2 text-left">
          <AlertCircle className="w-4.5 h-4.5 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 text-left">
        {/* Upload Area */}
        <div className="space-y-2">
          <label className="text-[10px] font-extrabold uppercase tracking-widest text-zinc-550 block">Upload Evidence</label>
          
          {imagePreview ? (
            <div className="relative rounded-2xl overflow-hidden border border-zinc-888 bg-zinc-900/50 aspect-video flex items-center justify-center group">
              <img src={imagePreview} alt="Evidence preview" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="p-3 rounded-full bg-rose-600 hover:bg-rose-500 text-white shadow-lg transition-transform hover:scale-110"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ) : (
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-zinc-800 hover:border-zinc-700 rounded-2xl p-8 flex flex-col items-center justify-center gap-3 bg-zinc-900/20 cursor-pointer transition-colors"
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/png, image/jpeg, image/jpg"
                className="hidden"
              />
              
              {isUploading ? (
                <div className="w-full max-w-xs space-y-3 text-center">
                  <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full bg-primary transition-all duration-150 animate-pulse" style={{ width: `${uploadProgress}%` }} />
                  </div>
                  <span className="text-[10px] font-mono text-zinc-450 uppercase tracking-widest block">
                    {isAiAnalyzing ? 'AI CO-PILOT ANALYZING INCIDENT...' : `UPLOADING FILES TO CLOUD STORAGE (${uploadProgress}%)`}
                  </span>
                </div>
              ) : (
                <>
                  <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-850 flex items-center justify-center text-zinc-550">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <div className="text-center">
                    <span className="text-xs font-bold text-white block">Drag & drop photo here</span>
                    <span className="text-[10px] text-zinc-550 block mt-1">or click to browse local folders (jpg, jpeg, png)</span>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Category & Location Rows */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-extrabold uppercase tracking-widest text-zinc-550 block">Issue Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              className="w-full rounded-xl bg-zinc-900 border border-zinc-850 px-4 py-3 text-xs text-white focus:outline-none focus:border-primary/50 transition-colors"
            >
              <option value="" disabled>Select category</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-extrabold uppercase tracking-widest text-zinc-550">Incident Coordinates</label>
              <button
                type="button"
                onClick={handleGeolocate}
                className="text-[9px] font-extrabold text-primary uppercase tracking-wide flex items-center gap-0.5 hover:text-white transition-colors cursor-pointer"
              >
                <MapPin className="w-3 h-3" /> Auto-locate
              </button>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                required
                placeholder="Latitude"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                className="w-1/2 rounded-xl bg-zinc-900 border border-zinc-850 px-4 py-3 text-xs text-white focus:outline-none"
              />
              <input
                type="text"
                required
                placeholder="Longitude"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                className="w-1/2 rounded-xl bg-zinc-900 border border-zinc-850 px-4 py-3 text-xs text-white focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Address Input */}
        <div className="space-y-2">
          <label className="text-[10px] font-extrabold uppercase tracking-widest text-zinc-550 block">Address Location</label>
          <input
            type="text"
            required
            placeholder="Street address details..."
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full rounded-xl bg-zinc-900 border border-zinc-850 px-4 py-3 text-xs text-white focus:outline-none focus:border-primary/50 transition-colors"
          />
        </div>

        {/* Inline Map Widget */}
        <div className="space-y-2">
          <label className="text-[10px] font-extrabold uppercase tracking-widest text-zinc-550 block">Live Geolocation map</label>
          <div className="relative overflow-hidden rounded-2xl bg-zinc-900 border border-zinc-850">
            {googleMapsApiKey ? (
              <LoadScript googleMapsApiKey={googleMapsApiKey}>
                <GoogleMap
                  mapContainerStyle={mapContainerStyle}
                  center={mapCenter}
                  zoom={14}
                  options={mapOptions}
                  onLoad={(map) => {
                    setMapInstance(map);
                    console.log("Map loaded");
                  }}
                  onUnmount={() => {
                    setMapInstance(null);
                  }}
                >
                  <Marker
                    position={mapCenter}
                    icon="https://maps.google.com/mapfiles/ms/icons/blue-dot.png"
                  />
                </GoogleMap>
              </LoadScript>
            ) : (
              <div className="h-[220px] flex items-center justify-center text-xs text-zinc-500 font-mono">
                [VITE_GOOGLE_MAPS_API_KEY Missing]
              </div>
            )}
          </div>
        </div>

        {/* Description Input */}
        <div className="space-y-2">
          <label className="text-[10px] font-extrabold uppercase tracking-widest text-zinc-550 block">Incident Description</label>
          <textarea
            required
            rows={3}
            placeholder="Provide a detailed description of the incident for AI dispatch triage routing..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-xl bg-zinc-900 border border-zinc-850 px-4 py-3 text-xs text-white focus:outline-none focus:border-primary/50 transition-colors resize-none"
          />
        </div>

        {/* AI Assisted Triage Overlay */}
        {confidence > 0 && (
          <div className="p-6 rounded-2xl border border-primary/20 bg-primary/5 space-y-4 animate-fade-in">
            <div className="flex items-center gap-2 text-primary">
              <Cpu className="w-4 h-4 animate-pulse" />
              <span className="text-[10px] font-extrabold uppercase tracking-wider">AI Copilot Analysis (Confidence: {(confidence * 100).toFixed(0)}%)</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-extrabold uppercase tracking-widest text-zinc-550 block">AI Severity Estimation</label>
                <select
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value as any)}
                  className="w-full rounded-xl bg-zinc-900 border border-zinc-850 px-4 py-3 text-xs text-white focus:outline-none focus:border-primary/30"
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                  <option value="critical">Critical Priority</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-extrabold uppercase tracking-widest text-zinc-550 block">AI Recommended Department</label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full rounded-xl bg-zinc-900 border border-zinc-850 px-4 py-3 text-xs text-white focus:outline-none focus:border-primary/30"
                />
              </div>
            </div>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting || isUploading}
          className={`w-full py-4 rounded-xl font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all shadow-[0_4px_20px_rgba(37,99,235,0.15)] ${
            isSubmitting || isUploading
              ? 'bg-zinc-900 border border-zinc-850 text-zinc-500 cursor-not-allowed'
              : 'bg-primary hover:bg-primary-hover text-white hover:scale-101 cursor-pointer'
          }`}
        >
          {isSubmitting ? 'Filing Incident Ticket...' : 'File Incident Report'}
        </button>
      </form>
    </div>
  );
}
