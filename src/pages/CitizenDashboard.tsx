import { useState, useEffect } from 'react';
import { 
  Brain, 
  LayoutDashboard, 
  PlusCircle, 
  ClipboardList, 
  Map, 
  Activity, 
  Award, 
  Settings as SettingsIcon, 
  Bell, 
  LogOut, 
  Search, 
  User, 
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import ReportForm from '../components/report/ReportForm';
import AIAnalysisPanel from '../components/ai/AIAnalysisPanel';
import CityPulsePanel from '../components/dashboard/CityPulsePanel';
import AchievementsPanel from '../components/dashboard/AchievementsPanel';
import NearbyIssuesPanel from '../components/dashboard/NearbyIssuesPanel';
import { type Report, subscribeToMyReports, updateReportStatus } from '../services/reportService';
import { subscribeToNotifications, sendNotification, markNotificationsAsRead, type Notification } from '../services/notificationService';
import { type UserProfile } from '../services/authService';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/firebase';

type Tab = 'dashboard' | 'report' | 'my-reports' | 'nearby' | 'city-pulse' | 'achievements' | 'settings';

// Safe image renderer with neutral placeholder
const ImageWithPlaceholder = ({ src, alt, className }: { src?: string; alt: string; className: string }) => {
  const [hasError, setHasError] = useState(false);
  
  if (!src || hasError) {
    return (
      <div className={`${className} bg-zinc-900 border border-zinc-850 flex flex-col items-center justify-center text-zinc-500 gap-1.5`}>
        <span className="text-[8px] font-extrabold uppercase tracking-widest text-zinc-650">No Image</span>
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

export default function CitizenDashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  
  // Real-time states
  const [myReportsList, setMyReportsList] = useState<Report[]>([]);
  const [loadingReports, setLoadingReports] = useState(false);
  const [selectedReportForDetails, setSelectedReportForDetails] = useState<Report | null>(null);
  
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [notificationsList, setNotificationsList] = useState<Notification[]>([]);
  const [isNotifDropdownOpen, setIsNotifDropdownOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // States for active filing transaction
  const [activeReportTransaction, setActiveReportTransaction] = useState<{
    reportId: string;
    category: string;
    description: string;
  } | null>(null);

  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Monitor network online/offline state
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Subscribe to real-time User Profile updates (Score, Badges, etc.)
  useEffect(() => {
    if (!user?.uid) return;
    const docRef = doc(db, 'users', user.uid);
    const unsubscribe = onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          setUserProfile(docSnap.data() as UserProfile);
        }
      },
      (error) => {
        console.error('User profile subscription failed:', error);
      }
    );
    return () => unsubscribe();
  }, [user?.uid]);

  // Subscribe to real-time user-specific Reports updates
  useEffect(() => {
    if (!user?.uid) return;
    setLoadingReports(true);
    const unsubscribe = subscribeToMyReports(user.uid, (data) => {
      setMyReportsList(data);
      setLoadingReports(false);
    });
    return () => unsubscribe();
  }, [user?.uid]);

  // Subscribe to real-time Notifications updates
  useEffect(() => {
    if (!user?.uid) return;
    const unsubscribe = subscribeToNotifications(user.uid, (data) => {
      setNotificationsList(data);
    });
    return () => unsubscribe();
  }, [user?.uid]);

  const handleReportSuccess = (reportId: string, category: string, description: string) => {
    setActiveReportTransaction({ reportId, category, description });

    if (!user) return;

    // Send initial submission alert notification
    sendNotification({
      userId: user.uid,
      title: 'Incident Report Filed',
      message: `Your report for "${category}" has been filed successfully. AI Dispatch is routing it.`,
      type: 'submitted',
    });

    // Simulate dispatcher assignments in Firestore
    setTimeout(async () => {
      try {
        await updateReportStatus(reportId, { status: 'assigned', priority: 'high' });
        await sendNotification({
          userId: user.uid,
          title: 'Report Dispatched',
          message: `Incident ticket ${reportId.slice(0, 8)} has been routed to the Public Works department.`,
          type: 'assigned',
        });
      } catch (err) {
        console.error('Simulated report dispatch failed:', err);
      }
    }, 12000); // 12s delay

    // Simulate verification requests in Firestore
    setTimeout(async () => {
      try {
        await sendNotification({
          userId: user.uid,
          title: 'Verification Request',
          message: `Nearby citizens are verifying coordinates for incident: ${reportId.slice(0, 8)}.`,
          type: 'verification',
        });
      } catch (err) {
        console.error('Simulated verification request failed:', err);
      }
    }, 24000); // 24s delay

    // Simulate resolution updates in Firestore
    setTimeout(async () => {
      try {
        await updateReportStatus(reportId, { status: 'resolved' });
        await sendNotification({
          userId: user.uid,
          title: 'Incident Resolved',
          message: `Incident ticket ${reportId.slice(0, 8)} has been resolved by municipal workers.`,
          type: 'resolved',
        });
      } catch (err) {
        console.error('Simulated report resolution failed:', err);
      }
    }, 36000); // 36s delay
  };

  const handleFinishAIAnalysis = () => {
    setActiveReportTransaction(null);
    setActiveTab('my-reports');
    setSuccessToast('Incident report filed successfully! AI Dispatch Triage routed to department.');
    setTimeout(() => setSuccessToast(null), 5000);
  };

  const sidebarLinks = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'report', label: 'Report Issue', icon: PlusCircle },
    { id: 'my-reports', label: 'My Reports', icon: ClipboardList },
    { id: 'nearby', label: 'Nearby Issues', icon: Map },
    { id: 'city-pulse', label: 'City Pulse', icon: Activity },
    { id: 'achievements', label: 'Achievements', icon: Award },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ];

  return (
    <div className="min-h-screen bg-[#09090B] text-zinc-150 flex flex-col md:flex-row relative">
      <div className="absolute inset-0 grid-bg opacity-15 pointer-events-none" />

      {/* LEFT SIDEBAR NAVIGATION */}
      <aside className="w-full md:w-64 bg-zinc-950/80 border-r border-zinc-900 backdrop-blur-md flex flex-col justify-between py-6 px-4 z-20">
        <div className="space-y-8">
          {/* Logo brand */}
          <div className="flex items-center gap-2.5 px-2">
            <div className="w-8.5 h-8.5 rounded-lg bg-primary/20 flex items-center justify-center text-primary border border-primary/20">
              <Brain className="w-4.5 h-4.5" />
            </div>
            <span className="text-md font-bold text-white tracking-tight">
              CivicMind <span className="text-primary font-black">AI</span>
            </span>
          </div>

          {/* Links list */}
          <nav className="space-y-1.5">
            {sidebarLinks.map((link) => {
              const Icon = link.icon;
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => setActiveTab(link.id as Tab)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all relative group cursor-pointer ${
                    isActive
                      ? 'bg-primary/10 text-primary border border-primary/10'
                      : 'text-zinc-500 hover:text-zinc-300 border border-transparent'
                  }`}
                >
                  <Icon className="w-4.5 h-4.5" />
                  <span>{link.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* User profile details and Signout */}
        <div className="border-t border-zinc-900/60 pt-4 mt-6">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-rose-500/80 hover:text-rose-500 hover:bg-rose-500/5 transition-all cursor-pointer"
          >
            <LogOut className="w-4.5 h-4.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* RIGHT CONTENT FRAME */}
      <div className="flex-grow flex flex-col h-screen overflow-y-auto">
        {/* Connection Offline Status Bar */}
        {!isOnline && (
          <div className="w-full bg-amber-500/10 border-b border-amber-500/20 py-2.5 text-center text-[10px] font-extrabold text-amber-500 uppercase tracking-widest flex items-center justify-center gap-1.5 z-30">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
            <span>Connection offline. Telemetry will sync automatically when back online.</span>
          </div>
        )}

        {/* Sticky top-nav */}
        <header className="sticky top-0 bg-zinc-950/40 backdrop-blur-md px-8 py-4 border-b border-zinc-900/60 flex items-center justify-between z-10">
          {/* Mock Search box */}
          <div className="relative w-64">
            <Search className="w-4 h-4 text-zinc-550 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              readOnly
              placeholder="Search reports or areas..."
              className="w-full bg-zinc-900/40 border border-zinc-850 rounded-xl pl-9 pr-4 py-2 text-xs text-zinc-450 focus:outline-none pointer-events-none"
            />
          </div>

          <div className="flex items-center gap-4.5">
            {/* Notification bell and tray dropdown */}
            <div className="relative">
              <button 
                onClick={() => setIsNotifDropdownOpen(!isNotifDropdownOpen)}
                className="p-2 rounded-xl bg-zinc-900/60 border border-zinc-850 text-zinc-500 hover:text-zinc-350 relative transition-all cursor-pointer"
              >
                {notificationsList.filter(n => !n.read).length > 0 && (
                  <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                )}
                <Bell className="w-4.5 h-4.5" />
              </button>

              {/* Real-time notification dropdown */}
              {isNotifDropdownOpen && (
                <div className="absolute right-0 mt-3.5 w-80 rounded-2xl border border-zinc-850 bg-zinc-950/95 backdrop-blur-md p-4 shadow-2xl z-30 space-y-3 animate-fade-in text-left">
                  <div className="flex justify-between items-center border-b border-zinc-900 pb-2">
                    <span className="text-xs font-extrabold text-white">Notifications</span>
                    {notificationsList.filter(n => !n.read).length > 0 && (
                      <button
                        onClick={async () => {
                          await markNotificationsAsRead(notificationsList);
                          setIsNotifDropdownOpen(false);
                        }}
                        className="text-[9px] font-bold text-primary hover:text-white uppercase tracking-wider cursor-pointer"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>

                  <div className="max-h-60 overflow-y-auto space-y-2.5">
                    {notificationsList.length === 0 ? (
                      <div className="py-6 text-center text-[10px] text-zinc-500 uppercase tracking-widest font-mono">
                        No notifications
                      </div>
                    ) : (
                      notificationsList.slice(0, 8).map((notif) => (
                        <div
                          key={notif.notificationId}
                          className={`p-3 rounded-xl border transition-all text-xs font-semibold ${
                            notif.read
                              ? 'bg-zinc-900/10 border-zinc-900 text-zinc-500'
                              : 'bg-primary/5 border-primary/10 text-zinc-200'
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <span className={`font-bold ${notif.read ? 'text-zinc-400' : 'text-white'}`}>{notif.title}</span>
                            {!notif.read && <span className="w-1.5 h-1.5 rounded-full bg-primary" />}
                          </div>
                          <p className="text-[10px] text-zinc-500 leading-normal mt-0.5">{notif.message}</p>
                          <span className="text-[8px] text-zinc-650 block mt-2 font-mono">
                            {notif.createdAt?.seconds
                              ? new Date(notif.createdAt.seconds * 1000).toLocaleTimeString()
                              : new Date().toLocaleTimeString()}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Avatar */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full border border-zinc-850 bg-zinc-900 overflow-hidden shadow-sm">
                {user?.photoURL ? (
                  <img src={user.photoURL} alt={user.displayName || 'Profile'} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-400">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Inner Workspace */}
        <main className="p-8 flex-grow">
          {/* Renders AI checking pipeline if report transaction is active */}
          {activeReportTransaction ? (
            <AIAnalysisPanel
              reportId={activeReportTransaction.reportId}
              category={activeReportTransaction.category}
              onFinish={handleFinishAIAnalysis}
            />
          ) : (
            (() => {
              switch (activeTab) {
                case 'report':
                  return <ReportForm onSubmitSuccess={handleReportSuccess} />;
                case 'my-reports':
                  return (
                    <div className="space-y-8 text-left">
                      <div>
                        <h2 className="text-2xl font-bold text-white tracking-tight">My Incident Reports</h2>
                        <p className="text-xs text-zinc-500 mt-1">Monitor the live dispatch lifecycle of reports you filed.</p>
                      </div>

                      {/* Reports Datatable */}
                      <div className="glass-card rounded-[24px] border border-zinc-900 bg-zinc-950/30 overflow-hidden shadow-lg">
                        {loadingReports ? (
                          <div className="py-20 text-center text-xs text-zinc-500 animate-pulse font-mono uppercase tracking-wider">
                            Retrieving Reports Registry...
                          </div>
                        ) : myReportsList.length === 0 ? (
                          <div className="py-20 text-center flex flex-col items-center justify-center gap-3">
                            <div className="w-12 h-12 rounded-full border border-zinc-850 bg-zinc-900/50 flex items-center justify-center text-zinc-550">
                              <ClipboardList className="w-5 h-5" />
                            </div>
                            <div>
                              <span className="text-xs font-bold text-white block">No reports submitted yet</span>
                              <span className="text-[10px] text-zinc-500 block mt-1">Submit your first civic incident ticket.</span>
                            </div>
                          </div>
                        ) : (
                          <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs font-semibold text-zinc-400">
                              <thead>
                                <tr className="border-b border-zinc-900 pb-2 text-zinc-500 text-[10px] uppercase font-bold bg-zinc-950/60">
                                  <th className="py-4 px-6">Incident Category</th>
                                  <th className="py-4 px-6">Dispatch Area</th>
                                  <th className="py-4 px-6">Triage Status</th>
                                  <th className="py-4 px-6">Filed Date</th>
                                  <th className="py-4 px-6">Actions</th>
                                </tr>
                              </thead>
                              <tbody>
                                {myReportsList.map((rep) => (
                                  <tr 
                                    key={rep.reportId}
                                    className="border-b border-zinc-900/60 hover:bg-zinc-900/20 transition-colors"
                                  >
                                    <td className="py-4 px-6 flex items-center gap-3">
                                      <div className="w-10 h-10 rounded-lg overflow-hidden border border-zinc-850">
                                        <ImageWithPlaceholder src={rep.imageUrl} alt="Incident" className="w-full h-full object-cover" />
                                      </div>
                                      <span className="text-white font-bold">{rep.category}</span>
                                    </td>
                                    <td className="py-4 px-6 max-w-[200px] truncate">
                                      {rep.address || rep.location.address}
                                    </td>
                                    <td className="py-4 px-6">
                                      <span className={`px-2 py-0.5 rounded text-[8px] font-extrabold uppercase border ${
                                        rep.status.toLowerCase() === 'resolved'
                                          ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                                          : rep.status.toLowerCase() === 'assigned'
                                          ? 'bg-primary/10 text-primary border-primary/20'
                                          : 'bg-zinc-500/10 text-zinc-500 border-zinc-500/20'
                                      }`}>
                                        {rep.status}
                                      </span>
                                    </td>
                                    <td className="py-4 px-6 text-zinc-550 font-mono text-[10px]">
                                      {rep.createdAt?.seconds 
                                        ? new Date(rep.createdAt.seconds * 1000).toLocaleDateString()
                                        : new Date().toLocaleDateString()
                                      }
                                    </td>
                                    <td className="py-4 px-6">
                                      <button 
                                        onClick={() => setSelectedReportForDetails(rep)}
                                        className="text-[9px] font-extrabold text-primary hover:text-white uppercase tracking-wider flex items-center gap-0.5 cursor-pointer"
                                      >
                                        Inspect <ExternalLink className="w-3 h-3" />
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>

                      {/* Details Modal overlay */}
                      {selectedReportForDetails && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
                          <div className="w-full max-w-xl glass-card rounded-[28px] border border-zinc-800 bg-[#0c0c10] p-6 relative">
                            <button
                              onClick={() => setSelectedReportForDetails(null)}
                              className="absolute top-4 right-4 p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white cursor-pointer"
                            >
                              <ChevronRight className="w-4 h-4 rotate-90" />
                            </button>

                            <div className="text-left space-y-4">
                              <h3 className="text-base font-bold text-white mb-2">Report Registry Details</h3>
                              <div className="w-full h-44 rounded-xl overflow-hidden bg-zinc-900 border border-zinc-850">
                                <ImageWithPlaceholder src={selectedReportForDetails.imageUrl} alt="Evidence" className="w-full h-full object-cover" />
                              </div>

                              <div className="space-y-3.5 text-xs text-zinc-450 font-semibold pt-2">
                                <div className="flex justify-between">
                                  <span>Category</span>
                                  <span className="text-white font-bold">{selectedReportForDetails.category}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Address</span>
                                  <span className="text-white font-bold">{selectedReportForDetails.address || selectedReportForDetails.location.address}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Filing Status</span>
                                  <span className="text-white uppercase font-mono">{selectedReportForDetails.status}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Description</span>
                                  <p className="text-zinc-500 font-normal max-w-xs text-right leading-relaxed">{selectedReportForDetails.description}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                case 'nearby':
                  return <NearbyIssuesPanel />;
                case 'city-pulse':
                  return <CityPulsePanel />;
                case 'achievements':
                  return <AchievementsPanel />;
                case 'settings':
                  return (
                    <div className="space-y-8 text-left">
                      <div>
                        <h2 className="text-2xl font-bold text-white tracking-tight">Citizen Settings</h2>
                        <p className="text-xs text-zinc-500 mt-1">Configure profile handles and alert notification zones.</p>
                      </div>

                      <div className="glass-card rounded-[24px] border border-zinc-900 bg-zinc-950/40 p-8 max-w-xl space-y-5">
                        <div className="space-y-2">
                          <label className="text-[10px] font-extrabold uppercase text-zinc-550 block">Notification Range Radius</label>
                          <select className="w-full bg-zinc-900 border border-zinc-850 rounded-xl px-4 py-3 text-xs text-white">
                            <option>Within 1 mile</option>
                            <option>Within 5 miles</option>
                            <option>Within 10 miles</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-extrabold uppercase text-zinc-550 block">Profile Visibility</label>
                          <div className="flex items-center gap-3">
                            <input type="checkbox" defaultChecked className="rounded bg-zinc-900 border-zinc-888 text-primary" />
                            <span className="text-xs text-zinc-400 font-semibold">Share impact achievements on public leaderboard boards</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                default:
                  // DEFAULT Tab: Welcome Dashboard
                  return (
                    <div className="space-y-8 text-left">
                      {/* Welcome Banner */}
                      <div className="p-8 rounded-[28px] border border-zinc-800 bg-zinc-950/30 backdrop-blur-md relative overflow-hidden flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                        <div className="absolute right-[-10%] top-[-10%] w-48 h-48 bg-primary/10 rounded-full blur-[80px] pointer-events-none" />
                        <div>
                          <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                            Welcome back, {user?.displayName?.split(' ')[0] || 'Citizen'}!
                          </h1>
                          <p className="text-zinc-400 text-xs mt-1.5 max-w-lg leading-relaxed">
                            Report active neighborhood infrastructure failures, review nearby notifications, and track your local community scores.
                          </p>
                        </div>
                      </div>

                      {/* Live Stats Row */}
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="p-5 rounded-2xl border border-zinc-900 bg-zinc-950/40 text-left">
                          <span className="text-[10px] font-extrabold uppercase text-zinc-500 tracking-wider block mb-2">Reports Submitted</span>
                          <span className="text-2xl font-black text-white">{myReportsList.length}</span>
                        </div>
                        <div className="p-5 rounded-2xl border border-zinc-900 bg-zinc-950/40 text-left">
                          <span className="text-[10px] font-extrabold uppercase text-amber-500/80 tracking-wider block mb-2">Pending Reports</span>
                          <span className="text-2xl font-black text-amber-500">{myReportsList.filter(r => r.status.toLowerCase() !== 'resolved').length}</span>
                        </div>
                        <div className="p-5 rounded-2xl border border-zinc-900 bg-zinc-950/40 text-left">
                          <span className="text-[10px] font-extrabold uppercase text-emerald-500/80 tracking-wider block mb-2">Resolved Reports</span>
                          <span className="text-2xl font-black text-emerald-500">{myReportsList.filter(r => r.status.toLowerCase() === 'resolved').length}</span>
                        </div>
                        <div className="p-5 rounded-2xl border border-zinc-900 bg-zinc-950/40 text-left">
                          <span className="text-[10px] font-extrabold uppercase text-primary/80 tracking-wider block mb-2">Community Score</span>
                          <span className="text-2xl font-black text-primary">{userProfile ? userProfile.communityScore : 0} <span className="text-xs font-bold text-zinc-550">pts</span></span>
                        </div>
                      </div>

                      {/* Primary CTA: File Report card */}
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                        
                        {/* LEFT: File Report CTA (Lg: col-span-8) */}
                        <div className="lg:col-span-8 p-8 rounded-[28px] border border-primary/20 bg-gradient-to-br from-primary/10 via-zinc-950/40 to-[#0c0c10] flex flex-col justify-between items-start gap-8 relative overflow-hidden group">
                          <div className="absolute right-0 bottom-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl pointer-events-none group-hover:bg-primary/10 transition-colors" />
                          <div className="space-y-3">
                            <span className="text-[10px] font-extrabold uppercase text-primary tracking-widest block">Primary Action</span>
                            <h2 className="text-2xl font-black text-white tracking-tight">Report Infrastructure Failure</h2>
                            <p className="text-xs text-zinc-400 max-w-md leading-relaxed font-semibold">
                              File potholes, faulty streetlights, broken sanitary bins, or pipeline leakages. CivicMind AI automatically maps coordinates and dispatches optimal repair teams.
                            </p>
                          </div>
                          
                          <button
                            onClick={() => setActiveTab('report')}
                            className="px-6 py-3 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-extrabold flex items-center gap-1.5 shadow-[0_4px_20px_rgba(37,99,235,0.2)] transition-all hover:scale-102 cursor-pointer"
                          >
                            Launch Report Intake <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>

                        {/* RIGHT: Reputation Metrics (Lg: col-span-4) */}
                        <div className="lg:col-span-4 p-6 rounded-[28px] border border-zinc-900 bg-zinc-950/40 flex flex-col justify-between">
                          <span className="text-[10px] font-extrabold uppercase text-zinc-550 tracking-widest block">My Impact Hub</span>
                          
                          <div className="space-y-4 my-6 text-xs font-semibold text-zinc-400">
                            <div className="flex justify-between border-b border-zinc-900 pb-2.5">
                              <span>Reputation points</span>
                              <span className="text-white font-bold">{userProfile ? userProfile.communityScore : 0} pts</span>
                            </div>
                            <div className="flex justify-between border-b border-zinc-900 pb-2.5">
                              <span>Active reports</span>
                              <span className="text-white font-bold">{myReportsList.length} filed</span>
                            </div>
                          </div>

                          <button 
                            onClick={() => setActiveTab('achievements')}
                            className="w-full py-2.5 rounded-xl border border-zinc-800 hover:border-zinc-700 bg-zinc-900/60 text-[10px] font-extrabold text-zinc-350 hover:text-white uppercase tracking-wider transition-colors cursor-pointer"
                          >
                            View Achievements
                          </button>
                        </div>

                      </div>

                    </div>
                  );
              }
            })()
          )}
        </main>
      </div>

      {/* Success Toast Notification Overlay */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-xl border border-emerald-500/20 bg-emerald-950/90 backdrop-blur-md text-emerald-400 text-xs font-bold flex items-center gap-2 shadow-2xl animate-fade-in">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span>{successToast}</span>
        </div>
      )}
    </div>
  );
}
