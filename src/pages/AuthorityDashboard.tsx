import { useState, useEffect, useMemo, useRef } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { 
  Brain, 
  LogOut, 
  Map as MapIcon, 
  Sparkles, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  User, 
  XCircle, 
  Send,
  Loader,
  Search
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { type Report, subscribeToReports, updateReportStatus } from '../services/reportService';
import { sendNotification } from '../services/notificationService';
import { MAP_DARK_STYLES } from '../components/dashboard/MapStyles';
import { analyzeCopilotWithGemini, type AiCopilotResult } from '../services/aiService';
import CityPulseAnalytics from './CityPulseAnalytics';

const mapContainerStyle = {
  width: '100%',
  height: '100%',
  minHeight: '260px',
};

const drawerMapContainerStyle = {
  width: '100%',
  height: '160px',
};

const mapOptions = {
  styles: MAP_DARK_STYLES,
  disableDefaultUI: true,
  zoomControl: true,
};

type QueueFilter = 'all' | 'new' | 'assigned' | 'in-progress' | 'resolved';

// Safe image renderer with neutral placeholder
const ImageWithPlaceholder = ({ src, alt, className }: { src?: string; alt: string; className: string }) => {
  const [hasError, setHasError] = useState(false);
  
  if (!src || hasError) {
    return (
      <div className={`${className} bg-zinc-900 border border-zinc-850 flex flex-col items-center justify-center text-zinc-550 gap-1.5`}>
        <span className="text-[9px] font-extrabold uppercase tracking-widest text-zinc-600">No Image Available</span>
      </div>
    );
  }
  
  return (
    <img 
      src={src} 
      alt={alt} 
      className={className} 
      onError={() => setHasError(true)}
    />
  );
};

export default function AuthorityDashboard() {
  const { user, logout } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  
  // Filters & Search
  const [activeQueue, setActiveQueue] = useState<QueueFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Map Instance references
  const [mapInstance, setMapInstance] = useState<any>(null);
  const [drawerMapInstance, setDrawerMapInstance] = useState<any>(null);
  
  // Input for crew assignment
  const [assignedCrewInput, setAssignedCrewInput] = useState('Public Works Dispatch Alpha');
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // AI Copilot caching & results states using useRef to avoid infinite update loops
  const aiCacheRef = useRef<Record<string, AiCopilotResult>>({});
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [currentAiResult, setCurrentAiResult] = useState<AiCopilotResult | null>(null);

  // Header Switcher Tab State
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState<'console' | 'analytics'>('console');

  const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

  // Subscribe to real-time reports feed on mount
  useEffect(() => {
    const unsubscribe = subscribeToReports((data) => {
      setReports(data);
    });
    return () => unsubscribe();
  }, []);

  // Sync selected report if it receives changes in the reports feed to prevent loops
  useEffect(() => {
    if (selectedReport) {
      const updated = reports.find(r => r.reportId === selectedReport.reportId);
      if (updated) {
        const hasChanged = 
          updated.status !== selectedReport.status ||
          updated.priority !== selectedReport.priority ||
          (updated as any).assignedCrew !== (selectedReport as any).assignedCrew ||
          updated.imageUrl !== selectedReport.imageUrl ||
          updated.category !== selectedReport.category ||
          updated.description !== selectedReport.description;
        if (hasChanged) {
          setSelectedReport(updated);
        }
      }
    }
  }, [reports, selectedReport]);

  // Handle map center panning on main map load
  const handleMapLoad = (map: google.maps.Map) => {
    setMapInstance(map);
    if (reports.length > 0) {
      const first = reports[0];
      const lat = first.latitude || first.location?.latitude;
      const lng = first.longitude || first.location?.longitude;
      if (lat && lng) {
        map.panTo({ lat, lng });
      }
    }
  };

  // Sync main map center to selected report coordinates
  useEffect(() => {
    if (mapInstance && selectedReport) {
      const lat = selectedReport.latitude || selectedReport.location?.latitude;
      const lng = selectedReport.longitude || selectedReport.location?.longitude;
      if (lat && lng) {
        mapInstance.panTo({ lat, lng });
        console.log("Main Map recentered to selected report:", { lat, lng });
      }
    }
  }, [mapInstance, selectedReport]);

  // Sync drawer map viewport whenever the selected report changes
  useEffect(() => {
    if (drawerMapInstance && selectedReport) {
      const lat = selectedReport.latitude || selectedReport.location?.latitude;
      const lng = selectedReport.longitude || selectedReport.location?.longitude;
      if (lat && lng) {
        drawerMapInstance.panTo({ lat, lng });
        console.log("Drawer mini map panned to selected report:", { lat, lng });
      }
    }
  }, [drawerMapInstance, selectedReport]);

  // Helper to compute duplicate probability based on proximity
  const duplicateStats = useMemo(() => {
    if (!selectedReport) return { probability: 5, similarCount: 0 };
    
    const lat = selectedReport.latitude || selectedReport.location?.latitude;
    const lng = selectedReport.longitude || selectedReport.location?.longitude;
    if (!lat || !lng) return { probability: 5, similarCount: 0 };

    const similar = reports.filter(r => 
      r.reportId !== selectedReport.reportId &&
      r.category === selectedReport.category &&
      Math.abs((r.latitude || r.location?.latitude) - lat) < 0.015 &&
      Math.abs((r.longitude || r.location?.longitude) - lng) < 0.015
    );

    return {
      probability: similar.length > 0 ? 85 : 5,
      similarCount: similar.length
    };
  }, [selectedReport, reports]);

  // Hook to fetch and cache dynamic AI recommendations from Gemini
  useEffect(() => {
    if (!selectedReport) {
      setCurrentAiResult(null);
      return;
    }

    const cacheKey = `${selectedReport.reportId}_${selectedReport.status}_${selectedReport.priority}`;
    if (aiCacheRef.current[cacheKey]) {
      setCurrentAiResult(aiCacheRef.current[cacheKey]);
      return;
    }

    let isSubscribed = true;
    const fetchAiResult = async () => {
      setIsAiLoading(true);
      try {
        const result = await analyzeCopilotWithGemini(selectedReport, duplicateStats.similarCount);
        if (isSubscribed) {
          aiCacheRef.current[cacheKey] = result;
          setCurrentAiResult(result);
        }
      } catch (err) {
        console.error('AI Copilot analysis fetch failed:', err);
      } finally {
        if (isSubscribed) {
          setIsAiLoading(false);
        }
      }
    };

    fetchAiResult();
    return () => {
      isSubscribed = false;
    };
  }, [selectedReport, duplicateStats.similarCount]);

  // Statistics Calculations
  const stats = useMemo(() => {
    const total = reports.length;
    const pending = reports.filter(r => r.status.toLowerCase() === 'pending').length;
    const assigned = reports.filter(r => r.status.toLowerCase() === 'assigned').length;
    const inProgress = reports.filter(r => r.status.toLowerCase() === 'in-progress').length;
    const resolved = reports.filter(r => r.status.toLowerCase() === 'resolved').length;
    const critical = reports.filter(r => r.priority.toLowerCase() === 'critical').length;
    
    return { total, pending, assigned, inProgress, resolved, critical };
  }, [reports]);

  // Filtered reports computed list
  const filteredReports = useMemo(() => {
    return reports.filter(rep => {
      // 1. Queue filter
      const statusLower = rep.status.toLowerCase();
      if (activeQueue === 'new' && statusLower !== 'pending') return false;
      if (activeQueue === 'assigned' && statusLower !== 'assigned') return false;
      if (activeQueue === 'in-progress' && statusLower !== 'in-progress') return false;
      if (activeQueue === 'resolved' && statusLower !== 'resolved') return false;

      // 2. Search query filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const categoryMatch = rep.category.toLowerCase().includes(query);
        const addressMatch = (rep.address || rep.location?.address || '').toLowerCase().includes(query);
        const summaryMatch = (rep.aiSummary || '').toLowerCase().includes(query);
        const idMatch = rep.reportId.toLowerCase().includes(query);
        const deptMatch = (rep.department || '').toLowerCase().includes(query);
        const citizenMatch = (rep.reportedBy || '').toLowerCase().includes(query);
        return categoryMatch || addressMatch || summaryMatch || idMatch || deptMatch || citizenMatch;
      }

      return true;
    });
  }, [reports, activeQueue, searchQuery]);

  // Pagination (Limits list to 100 items per specs)
  const paginatedReports = useMemo(() => {
    return filteredReports.slice(0, 100);
  }, [filteredReports]);

  // Dispatch Queue count badges helper
  const countBadges = useMemo<Record<QueueFilter, number>>(() => {
    return {
      all: reports.length,
      new: reports.filter(r => r.status.toLowerCase() === 'pending').length,
      assigned: reports.filter(r => r.status.toLowerCase() === 'assigned').length,
      'in-progress': reports.filter(r => r.status.toLowerCase() === 'in-progress').length,
      resolved: reports.filter(r => r.status.toLowerCase() === 'resolved').length,
    };
  }, [reports]);

  // Map Marker Color resolver
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

  // Dispatch Actions
  const handleAssignCrew = async () => {
    if (!selectedReport) return;
    setIsActionLoading(true);
    setErrorMsg(null);
    try {
      const now = new Date();
      const updates = {
        status: 'assigned' as any,
        assignedCrew: assignedCrewInput,
        assignedAt: { seconds: Math.floor(now.getTime() / 1000) } as any
      };
      await updateReportStatus(selectedReport.reportId, updates);
      
      // Notify citizen
      await sendNotification({
        userId: selectedReport.userId,
        title: 'Dispatch Crew Assigned',
        message: `Municipal officers assigned "${assignedCrewInput}" to your report: ${selectedReport.category}.`,
        type: 'assigned'
      });
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to assign crew.');
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleMarkInProgress = async () => {
    if (!selectedReport) return;
    setIsActionLoading(true);
    setErrorMsg(null);
    try {
      const now = new Date();
      const updates = {
        status: 'in-progress' as any,
        inProgressAt: { seconds: Math.floor(now.getTime() / 1000) } as any
      };
      await updateReportStatus(selectedReport.reportId, updates);
      
      // Notify citizen
      await sendNotification({
        userId: selectedReport.userId,
        title: 'Repair In Progress',
        message: `Operations crew arrived at site. Maintenance work started for: ${selectedReport.category}.`,
        type: 'assigned'
      });
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to set in progress state.');
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleResolveReport = async () => {
    if (!selectedReport) return;
    setIsActionLoading(true);
    setErrorMsg(null);
    try {
      const now = new Date();
      const updates = {
        status: 'resolved' as any,
        resolvedAt: { seconds: Math.floor(now.getTime() / 1000) } as any
      };
      await updateReportStatus(selectedReport.reportId, updates);
      
      // Notify citizen
      await sendNotification({
        userId: selectedReport.userId,
        title: 'Incident Resolved',
        message: `Maintenance completed successfully. Incident ticket resolved: ${selectedReport.reportId.slice(0, 8)}.`,
        type: 'resolved'
      });
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to resolve report.');
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleRejectDuplicate = async () => {
    if (!selectedReport) return;
    setIsActionLoading(true);
    setErrorMsg(null);
    try {
      const updates = {
        status: 'rejected' as any,
        resolvedAt: null as any
      };
      await updateReportStatus(selectedReport.reportId, updates);
      
      // Notify citizen
      await sendNotification({
        userId: selectedReport.userId,
        title: 'Duplicate Incident Flagged',
        message: `Your report has been flagged as a duplicate of an existing active ticket.`,
        type: 'verification'
      });
      setSelectedReport(null);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to reject duplicate.');
    } finally {
      setIsActionLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090B] text-zinc-150 flex flex-col relative">
      <div className="absolute inset-0 grid-bg opacity-15 pointer-events-none" />

      {/* HEADER CONTROL BAR */}
      <header className="px-8 py-4 border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-md flex items-center justify-between z-10 sticky top-0">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8.5 h-8.5 rounded-lg bg-secondary/20 flex items-center justify-center text-secondary border border-secondary/20">
              <Brain className="w-4.5 h-4.5" />
            </div>
            <span className="text-md font-bold text-white tracking-tight">
              CivicMind <span className="text-secondary font-black">Command Center</span>
            </span>
          </div>

          <div className="flex gap-2 border-l border-zinc-900 pl-4 ml-2">
            <button 
              onClick={() => setActiveWorkspaceTab('console')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
                activeWorkspaceTab === 'console' 
                  ? 'bg-secondary/10 border-secondary/20 text-secondary' 
                  : 'border-transparent text-zinc-500 hover:text-zinc-350'
              }`}
            >
              Dispatch Console
            </button>
            <button 
              onClick={() => setActiveWorkspaceTab('analytics')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
                activeWorkspaceTab === 'analytics' 
                  ? 'bg-secondary/10 border-secondary/20 text-secondary' 
                  : 'border-transparent text-zinc-500 hover:text-zinc-350'
              }`}
            >
              City Pulse Analytics
            </button>
          </div>
        </div>

        {/* Global Search */}
        <div className="relative w-72 hidden md:block">
          <Search className="w-4 h-4 text-zinc-550 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search active dispatches..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-900/40 border border-zinc-850 rounded-xl pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-secondary/40 transition-colors"
          />
        </div>

        <div className="flex items-center gap-4.5">
          <span className="text-xs font-bold text-zinc-400 hidden sm:block">
            Authority Account: <strong className="text-white font-black">{user?.displayName || user?.email}</strong>
          </span>
          <button
            onClick={logout}
            className="px-4 py-2 rounded-xl border border-zinc-850 bg-zinc-900 hover:bg-zinc-850 text-xs font-bold text-rose-500 hover:text-rose-400 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" /> Sign Out
          </button>
        </div>
      </header>

      {activeWorkspaceTab === 'console' ? (
        <>
          {/* STATS TELEMETRY GRID */}
          <section className="px-8 pt-8 max-w-7xl w-full mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5 z-10">
            <div className="p-4 rounded-2xl border border-zinc-900 bg-zinc-950/40 text-left">
              <span className="text-[10px] font-extrabold uppercase text-zinc-555 tracking-wider block mb-1">Total Reports</span>
              <span className="text-2xl font-black text-white">{stats.total}</span>
            </div>
            <div className="p-4 rounded-2xl border border-zinc-900 bg-zinc-950/40 text-left">
              <span className="text-[10px] font-extrabold uppercase text-zinc-555 tracking-wider block mb-1">Pending</span>
              <span className="text-2xl font-black text-secondary">{stats.pending}</span>
            </div>
            <div className="p-4 rounded-2xl border border-zinc-900 bg-zinc-950/40 text-left">
              <span className="text-[10px] font-extrabold uppercase text-amber-500/80 tracking-wider block mb-1">Assigned</span>
              <span className="text-2xl font-black text-amber-500">{stats.assigned}</span>
            </div>
            <div className="p-4 rounded-2xl border border-zinc-900 bg-zinc-950/40 text-left">
              <span className="text-[10px] font-extrabold uppercase text-emerald-500/80 tracking-wider block mb-1">In Progress</span>
              <span className="text-2xl font-black text-emerald-500">{stats.inProgress}</span>
            </div>
            <div className="p-4 rounded-2xl border border-rose-900/40 bg-zinc-950/40 text-left">
              <span className="text-[10px] font-extrabold uppercase text-rose-500/80 tracking-wider block mb-1">Resolved</span>
              <span className="text-2xl font-black text-rose-500">{stats.resolved}</span>
            </div>
            <div className="p-4 rounded-2xl border border-zinc-900 bg-zinc-950/40 text-left">
              <span className="text-[10px] font-extrabold uppercase text-zinc-555 tracking-wider block mb-1">Critical</span>
              <span className="text-2xl font-black text-rose-500">{stats.critical}</span>
            </div>
          </section>

          {/* CORE WORKSPACE SECTION */}
          <main className="flex-grow max-w-7xl w-full mx-auto px-8 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 z-10 text-left overflow-hidden">
            
            {/* LEFT COLUMN: Map & Queue List (col-span-8) */}
            <div className="lg:col-span-8 flex flex-col gap-8 h-full">
              {/* Real-time Google Map */}
              <div className="h-[280px] w-full rounded-[28px] overflow-hidden border border-zinc-900 bg-zinc-950/40 relative flex items-center justify-center">
                {googleMapsApiKey ? (
                  <LoadScript googleMapsApiKey={googleMapsApiKey}>
                    <GoogleMap
                      mapContainerStyle={mapContainerStyle}
                      center={{ lat: 26.2137, lng: 91.7289 }} // default center Guwahati
                      zoom={11}
                      options={mapOptions}
                      onLoad={handleMapLoad}
                    >
                      {reports.map((rep) => {
                        const lat = rep.latitude || rep.location?.latitude;
                        const lng = rep.longitude || rep.location?.longitude;
                        if (!lat || !lng) return null;
                        return (
                          <Marker
                            key={rep.reportId}
                            position={{ lat, lng }}
                            icon={getMarkerIcon(rep.priority, rep.status)}
                            onClick={() => setSelectedReport(rep)}
                          />
                        );
                      })}
                    </GoogleMap>
                  </LoadScript>
                ) : (
                  <div className="text-xs text-zinc-500 font-mono">[VITE_GOOGLE_MAPS_API_KEY Missing]</div>
                )}
                <div className="absolute top-4 left-4 p-3 rounded-xl bg-zinc-900/90 border border-zinc-850 backdrop-blur-md flex items-center gap-1.5 text-xs text-white font-bold">
                  <MapIcon className="w-4 h-4 text-secondary" /> Live GIS Dispatch Mapping Network
                </div>
              </div>

              {/* Queue Filter Tabs Selector */}
              <div className="space-y-4 flex-grow flex flex-col">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-900 pb-3">
                  <div className="flex flex-wrap gap-1.5">
                    {(['all', 'new', 'assigned', 'in-progress', 'resolved'] as QueueFilter[]).map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveQueue(tab)}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer border ${
                          activeQueue === tab
                            ? 'bg-secondary/10 border-secondary/20 text-secondary'
                            : 'border-transparent text-zinc-500 hover:text-zinc-350'
                        }`}
                      >
                        <span>{tab}</span>
                        <span className={`px-1.5 py-0.2 rounded-md text-[8px] font-bold ${
                          activeQueue === tab ? 'bg-secondary/20 text-secondary' : 'bg-zinc-900 text-zinc-550'
                        }`}>
                          {countBadges[tab]}
                        </span>
                      </button>
                    ))}
                  </div>
                  <span className="text-[10px] font-bold text-zinc-555 uppercase tracking-widest">Reports Dispatch Feed</span>
                </div>

                {/* List of active card reports */}
                <div className="space-y-4 max-h-[460px] overflow-y-auto pr-2 flex-grow">
                  {paginatedReports.length === 0 ? (
                    <div className="py-20 text-center text-xs text-zinc-550 uppercase font-mono tracking-widest">
                      No active incidents in this dispatch tier
                    </div>
                  ) : (
                    paginatedReports.map((rep) => (
                      <div
                        key={rep.reportId}
                        onClick={() => setSelectedReport(rep)}
                        className={`p-5 rounded-2xl border transition-all cursor-pointer text-left relative overflow-hidden flex flex-col sm:flex-row gap-5 hover:bg-zinc-900/10 ${
                          selectedReport?.reportId === rep.reportId
                            ? 'border-secondary bg-secondary/5'
                            : 'border-zinc-900 bg-zinc-950/20'
                        }`}
                      >
                        {/* Left Thumbnail image preview (fixes broken images) */}
                        <div className="w-full sm:w-32 h-24 rounded-xl overflow-hidden bg-zinc-900 border border-zinc-850 flex-shrink-0">
                          <ImageWithPlaceholder src={rep.imageUrl} alt="Incident" className="w-full h-full object-cover" />
                        </div>

                        {/* Right summary metadata details */}
                        <div className="flex-grow space-y-2">
                          <div className="flex justify-between items-start flex-wrap gap-2">
                            <div>
                              <h4 className="text-sm font-bold text-white leading-tight">{rep.category}</h4>
                              <span className="text-[10px] text-zinc-555 block mt-0.5 font-semibold">Address: {rep.address || rep.location?.address}</span>
                            </div>
                            <div className="flex gap-1.5 items-center">
                              <span className={`px-2 py-0.5 rounded text-[8px] font-extrabold uppercase border ${
                                rep.priority === 'critical'
                                  ? 'bg-rose-500/10 text-rose-500 border-rose-500/20'
                                  : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                              }`}>
                                {rep.priority}
                              </span>
                              <span className={`px-2 py-0.5 rounded text-[8px] font-extrabold uppercase border ${
                                rep.status.toLowerCase() === 'resolved'
                                  ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                                  : rep.status.toLowerCase() === 'assigned'
                                  ? 'bg-primary/10 text-primary border-primary/20'
                                  : 'bg-zinc-500/10 text-zinc-500 border-zinc-500/20'
                              }`}>
                                {rep.status}
                              </span>
                            </div>
                          </div>

                          <p className="text-xs text-zinc-400 font-semibold leading-relaxed line-clamp-2">
                            <strong>AI Summary:</strong> {rep.aiSummary}
                          </p>

                          <div className="flex items-center gap-3.5 flex-wrap pt-1 text-[9px] font-extrabold uppercase text-zinc-555 tracking-wider">
                            <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" /> Filed By: {rep.reportedBy}</span>
                            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {rep.createdAt?.seconds ? new Date(rep.createdAt.seconds * 1000).toLocaleTimeString() : 'Recent'}</span>
                            <span>Dept: <strong className="text-zinc-400">{rep.department}</strong></span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Interactive side panel details drawer (col-span-4) */}
            <div className="lg:col-span-4 h-full flex flex-col gap-6">
              
              {/* Dynamic AI Copilot Dispatch Triage Helper Box */}
              <div className="p-6 rounded-[28px] border border-zinc-900 bg-zinc-950/40 space-y-4">
                <span className="text-[10px] font-extrabold uppercase text-secondary tracking-widest block border-b border-zinc-900 pb-2">AI Copilot Dispatcher</span>
                {selectedReport ? (
                  isAiLoading ? (
                    <div className="text-center py-10 flex flex-col items-center justify-center text-zinc-550">
                      <Loader className="w-5 h-5 text-secondary animate-spin mb-2" />
                      <span className="text-[10px] font-extrabold uppercase tracking-wider block">Analyzing with Gemini...</span>
                    </div>
                  ) : currentAiResult ? (
                    <div className="space-y-3 text-xs text-zinc-400 font-semibold text-left">
                      {/* 1. Incident Summary */}
                      <div className="p-3 rounded-xl bg-zinc-900/40 border border-zinc-900/60 text-zinc-350 leading-relaxed font-medium">
                        <strong>AI Analysis Summary:</strong> {currentAiResult.summary}
                      </div>
                      
                      {/* 2. Recommended Action */}
                      <div className="p-3.5 rounded-xl bg-secondary/5 border border-secondary/15 flex items-start gap-2.5">
                        <Sparkles className="w-4.5 h-4.5 text-secondary flex-shrink-0 mt-0.5" />
                        <div className="text-[11px] leading-relaxed">
                          <strong>Recommended Dispatch Action:</strong> {currentAiResult.recommendedAction}.
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-x-4 gap-y-3.5 pt-2">
                        <div className="border-b border-zinc-900/60 pb-2">
                          <span className="text-[9px] font-extrabold uppercase tracking-widest text-zinc-550 block">Suggested Department</span>
                          <span className="text-white mt-0.5 block">{currentAiResult.suggestedDepartment}</span>
                        </div>
                        <div className="border-b border-zinc-900/60 pb-2">
                          <span className="text-[9px] font-extrabold uppercase tracking-widest text-zinc-550 block">Suggested Crew</span>
                          <span className="text-white mt-0.5 block">{currentAiResult.suggestedCrew}</span>
                        </div>
                        <div className="border-b border-zinc-900/60 pb-2">
                          <span className="text-[9px] font-extrabold uppercase tracking-widest text-zinc-550 block">Resolution SLA</span>
                          <span className="text-white mt-0.5 block font-mono">{currentAiResult.estimatedResolutionTime}</span>
                        </div>
                        <div className="border-b border-zinc-900/60 pb-2">
                          <span className="text-[9px] font-extrabold uppercase tracking-widest text-zinc-550 block">Priority Score</span>
                          <span className="text-secondary mt-0.5 block font-mono font-bold">{currentAiResult.priorityScore}/100</span>
                        </div>
                        <div className="border-b border-zinc-900/60 pb-2">
                          <span className="text-[9px] font-extrabold uppercase tracking-widest text-zinc-550 block">Duplicate Probability</span>
                          <span className={`mt-0.5 block font-mono font-bold ${currentAiResult.duplicateProbability > 50 ? 'text-rose-500' : 'text-emerald-500'}`}>
                            {currentAiResult.duplicateProbability}%
                          </span>
                        </div>
                        <div className="border-b border-zinc-900/60 pb-2">
                          <span className="text-[9px] font-extrabold uppercase tracking-widest text-zinc-550 block">Citizen Impact</span>
                          <span className={`mt-0.5 block font-bold ${currentAiResult.citizenImpact === 'High' ? 'text-rose-400' : currentAiResult.citizenImpact === 'Medium' ? 'text-amber-400' : 'text-emerald-400'}`}>
                            {currentAiResult.citizenImpact}
                          </span>
                        </div>
                      </div>

                      <div className="flex justify-between border-b border-zinc-900/60 pb-2 text-[11px]">
                        <span>Merge Recommendation</span>
                        <span className="text-zinc-350">{currentAiResult.mergeRecommendation}</span>
                      </div>

                      <div className="flex justify-between border-b border-zinc-900/60 pb-2 text-[11px]">
                        <span>Nearby Similar Reports</span>
                        <span className="text-zinc-350">{duplicateStats.similarCount} reports</span>
                      </div>

                      {/* AI Explanation / Reasoning */}
                      <div className="pt-2 space-y-1 text-left">
                        <span className="text-[9px] font-extrabold uppercase tracking-widest text-zinc-550 block">AI Reasoning Explanation</span>
                        <p className="text-[10px] text-zinc-500 font-semibold leading-relaxed">
                          {currentAiResult.reasoning}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-10 flex flex-col items-center justify-center text-zinc-650">
                      <Brain className="w-6 h-6 mb-2 text-zinc-700 animate-pulse" />
                      <span className="text-[10px] font-extrabold uppercase tracking-wider block">Failed loading copilot</span>
                    </div>
                  )
                ) : (
                  <div className="text-center py-10 flex flex-col items-center justify-center text-zinc-650">
                    <Brain className="w-6 h-6 mb-2 text-zinc-700 animate-pulse" />
                    <span className="text-[10px] font-extrabold uppercase tracking-wider block">No report selected</span>
                    <p className="text-[9px] text-zinc-555 mt-1 max-w-[160px] leading-relaxed">
                      Select any incident ticket from the feed queue or map to load the real-time AI triage indicators.
                    </p>
                  </div>
                )}
              </div>

              {/* Interactive Details Drawer */}
              <div className="p-6 rounded-[28px] border border-zinc-900 bg-zinc-950/40 flex-grow flex flex-col justify-between overflow-y-auto">
                {selectedReport ? (
                  <div className="space-y-6 flex-grow">
                    {/* Details Header */}
                    <div className="flex justify-between items-start border-b border-zinc-900 pb-3">
                      <div>
                        <h4 className="text-sm font-extrabold text-white leading-tight">{selectedReport.category}</h4>
                        <span className="text-[10px] text-zinc-555 block mt-0.5 font-semibold">Incident Ticket: {selectedReport.reportId.slice(0, 8)}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[8px] font-extrabold uppercase border ${
                        selectedReport.priority === 'critical'
                          ? 'bg-rose-500/10 text-rose-500 border-rose-500/20'
                          : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                      }`}>
                        {selectedReport.priority}
                      </span>
                    </div>

                    {/* Thumbnail Preview */}
                    <div className="w-full h-32 rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-850">
                      <ImageWithPlaceholder src={selectedReport.imageUrl} alt="Incident Detail" className="w-full h-full object-cover" />
                    </div>

                    {/* Map recenter mini widget */}
                    <div className="h-40 rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-850 relative">
                      {googleMapsApiKey ? (
                        <GoogleMap
                          mapContainerStyle={drawerMapContainerStyle}
                          center={{ 
                            lat: selectedReport.latitude || selectedReport.location?.latitude || 26.2137, 
                            lng: selectedReport.longitude || selectedReport.location?.longitude || 91.7289 
                          }}
                          zoom={13}
                          options={mapOptions}
                          onLoad={(map) => setDrawerMapInstance(map)}
                        >
                          <Marker 
                            position={{ 
                              lat: selectedReport.latitude || selectedReport.location?.latitude || 26.2137, 
                              lng: selectedReport.longitude || selectedReport.location?.longitude || 91.7289 
                            }}
                            icon={getMarkerIcon(selectedReport.priority, selectedReport.status)}
                          />
                        </GoogleMap>
                      ) : (
                        <div className="h-full flex items-center justify-center text-[10px] text-zinc-500 font-mono">[VITE_GOOGLE_MAPS_API_KEY Missing]</div>
                      )}
                    </div>

                    {/* Incident Description */}
                    <div className="space-y-1">
                      <span className="text-[9px] font-extrabold uppercase tracking-wider text-zinc-555 block">Incident Description</span>
                      <p className="text-xs text-zinc-400 font-semibold leading-relaxed">
                        {selectedReport.description}
                      </p>
                    </div>

                    {/* Status timeline with timestamps */}
                    <div className="space-y-3.5">
                      <span className="text-[9px] font-extrabold uppercase tracking-wider text-zinc-555 block">Status Dispatch Timeline</span>
                      <div className="space-y-3 relative pl-4 border-l border-zinc-900 text-xs font-semibold text-zinc-500">
                        <div className="relative">
                          <div className={`absolute left-[-21px] top-0.5 w-3 h-3 rounded-full border bg-zinc-950 flex items-center justify-center ${
                            selectedReport.createdAt ? 'border-emerald-500 bg-emerald-500/20' : 'border-zinc-800'
                          }`} />
                          <div className="flex justify-between">
                            <span className={selectedReport.createdAt ? 'text-white font-bold' : ''}>Submitted</span>
                            <span className="text-[9px] font-mono">
                              {selectedReport.createdAt?.seconds 
                                ? new Date(selectedReport.createdAt.seconds * 1000).toLocaleTimeString() 
                                : 'Pending'}
                            </span>
                          </div>
                        </div>

                        <div className="relative">
                          <div className={`absolute left-[-21px] top-0.5 w-3 h-3 rounded-full border bg-zinc-950 flex items-center justify-center ${
                            selectedReport.status.toLowerCase() !== 'pending' ? 'border-emerald-500 bg-emerald-500/20' : 'border-zinc-800'
                          }`} />
                          <div className="flex justify-between">
                            <span className={selectedReport.status.toLowerCase() !== 'pending' ? 'text-white font-bold' : ''}>Assigned</span>
                            <span className="text-[9px] font-mono">
                              {(selectedReport as any).assignedAt?.seconds 
                                ? new Date((selectedReport as any).assignedAt.seconds * 1000).toLocaleTimeString() 
                                : 'Pending'}
                            </span>
                          </div>
                          {selectedReport.status.toLowerCase() !== 'pending' && (selectedReport as any).assignedCrew && (
                            <span className="text-[10px] text-zinc-450 block mt-0.5 font-bold">Crew: {(selectedReport as any).assignedCrew}</span>
                          )}
                        </div>

                        <div className="relative">
                          <div className={`absolute left-[-21px] top-0.5 w-3 h-3 rounded-full border bg-zinc-950 flex items-center justify-center ${
                            ['in-progress', 'resolved'].includes(selectedReport.status.toLowerCase()) ? 'border-emerald-500 bg-emerald-500/20' : 'border-zinc-800'
                          }`} />
                          <div className="flex justify-between">
                            <span className={['in-progress', 'resolved'].includes(selectedReport.status.toLowerCase()) ? 'text-white font-bold' : ''}>In Progress</span>
                            <span className="text-[9px] font-mono">
                              {(selectedReport as any).inProgressAt?.seconds 
                                ? new Date((selectedReport as any).inProgressAt.seconds * 1000).toLocaleTimeString() 
                                : 'Pending'}
                            </span>
                          </div>
                        </div>

                        <div className="relative">
                          <div className={`absolute left-[-21px] top-0.5 w-3 h-3 rounded-full border bg-zinc-950 flex items-center justify-center ${
                            selectedReport.status.toLowerCase() === 'resolved' ? 'border-emerald-500 bg-emerald-500/20' : 'border-zinc-800'
                          }`} />
                          <div className="flex justify-between">
                            <span className={selectedReport.status.toLowerCase() === 'resolved' ? 'text-white font-bold' : ''}>Resolved</span>
                            <span className="text-[9px] font-mono">
                              {(selectedReport as any).resolvedAt?.seconds 
                                ? new Date((selectedReport as any).resolvedAt.seconds * 1000).toLocaleTimeString() 
                                : 'Pending'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Dispatch actions section */}
                    <div className="pt-4 border-t border-zinc-900 space-y-4">
                      <span className="text-[9px] font-extrabold uppercase tracking-wider text-zinc-555 block">Command Operations Actions</span>
                      
                      {errorMsg && (
                        <div className="p-3 rounded-xl border border-rose-500/20 bg-rose-500/5 text-rose-500 text-[10px] font-bold flex items-center gap-1.5">
                          <AlertCircle className="w-4 h-4 flex-shrink-0" />
                          <span>{errorMsg}</span>
                        </div>
                      )}

                      {selectedReport.status.toLowerCase() === 'pending' && (
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-zinc-555">Specify Dispatch Maintenance Crew</label>
                          <input
                            type="text"
                            value={assignedCrewInput}
                            onChange={(e) => setAssignedCrewInput(e.target.value)}
                            className="w-full bg-zinc-900 border border-zinc-850 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                          />
                          <button
                            onClick={handleAssignCrew}
                            disabled={isActionLoading}
                            className="w-full py-3 rounded-xl bg-secondary hover:bg-secondary-hover text-white text-xs font-extrabold flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                          >
                            {isActionLoading ? <Loader className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                            Assign Crew & Dispatch Ticket
                          </button>
                        </div>
                      )}

                      {selectedReport.status.toLowerCase() === 'assigned' && (
                        <button
                          onClick={handleMarkInProgress}
                          disabled={isActionLoading}
                          className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-extrabold flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                        >
                          {isActionLoading ? <Loader className="w-4 h-4 animate-spin" /> : <Clock className="w-4 h-4" />}
                          Mark Crew Dispatched (In Progress)
                        </button>
                      )}

                      {selectedReport.status.toLowerCase() === 'in-progress' && (
                        <button
                          onClick={handleResolveReport}
                          disabled={isActionLoading}
                          className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                        >
                          {isActionLoading ? <Loader className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                          Mark Incident Ticket Resolved
                        </button>
                      )}

                      {selectedReport.status.toLowerCase() !== 'resolved' && selectedReport.status.toLowerCase() !== 'rejected' && (
                        <button
                          onClick={handleRejectDuplicate}
                          disabled={isActionLoading}
                          className="w-full py-2.5 rounded-xl border border-zinc-800 hover:border-zinc-700 bg-zinc-900/60 text-[10px] font-extrabold text-zinc-350 hover:text-white uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                        >
                          {isActionLoading ? <Loader className="w-3.5 h-3.5 animate-spin" /> : <XCircle className="w-3.5 h-3.5" />}
                          Reject / Flag Duplicate Ticket
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 text-center text-zinc-650 flex-grow">
                    <Sparkles className="w-7 h-7 animate-pulse mb-3" />
                    <span className="text-xs font-bold uppercase tracking-wider">Select Dispatch Incident</span>
                    <p className="text-[10px] text-zinc-555 mt-1 max-w-[200px] leading-relaxed">
                      Choose any incident card from the feed queue or map marker pin to review raw details and deploy maintenance crews.
                    </p>
                  </div>
                )}

                <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-900 text-[10px] text-zinc-555 leading-relaxed mt-6">
                  <strong>Secure Command Link:</strong> Audit log events and modifications are registered in Firestore.
                </div>
              </div>
            </div>

          </main>
        </>
      ) : (
        <section className="max-w-7xl w-full mx-auto px-8 pt-8 z-10 text-left">
          <CityPulseAnalytics />
        </section>
      )}
    </div>
  );
}
