import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiRequest } from '../api/client';
import { useToast } from '../context/ToastContext';
import { useTheme } from '../context/ThemeContext';
import CreateProjectModal from '../components/CreateProjectModal';
import RegisterSiteModal from '../components/RegisterSiteModal';
import AssessmentReportModal from '../components/AssessmentReportModal';
import ProfileModal from '../components/ProfileModal';
import SitesOverviewMap from '../components/SitesOverviewMap';

export default function DashboardPage() {
  const { isAuthenticated, user, logout } = useAuth();
  const { showToast } = useToast();
  const { darkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);
  const [selectedProjectForSite, setSelectedProjectForSite] = useState(null);
  const [activeProjectId, setActiveProjectId] = useState(null);
  const [expandedFolders, setExpandedFolders] = useState({});
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);

  const [assessmentReport, setAssessmentReport] = useState(null);
  const [assessingSiteId, setAssessingSiteId] = useState(null);
  const [selectedSiteId, setSelectedSiteId] = useState(null);

  const initials = user?.name ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'U';

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    fetchProjects();
  }, [isAuthenticated, navigate]);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const data = await apiRequest('/api/projects', 'GET');
      setProjects(data || []);

      // Auto-expand all project folders initially
      if (data && data.length > 0) {
        const initialExpanded = {};
        data.forEach(p => { initialExpanded[p.id] = true; });
        setExpandedFolders(initialExpanded);
        if (!activeProjectId) setActiveProjectId(data[0].id);
      }
    } catch (err) {
      console.error('Failed to fetch projects', err);
    } finally {
      setLoading(false);
    }
  };

  const handleProjectCreated = (newProject) => {
    setProjects([newProject, ...projects]);
    setActiveProjectId(newProject.id);
    setExpandedFolders(prev => ({ ...prev, [newProject.id]: true }));
  };

  const handleOpenSiteModalForProject = (project) => {
    setSelectedProjectForSite(project);
  };

  const handleSiteRegistered = () => {
    fetchProjects();
  };

  const handleRunAssessment = async (projId, siteId) => {
    setAssessingSiteId(siteId);
    try {
      const reportData = await apiRequest(`/api/projects/${projId}/sites/${siteId}/assess`, 'POST');
      setAssessmentReport(reportData);
      showToast('AI Assessment completed successfully!', 'success');
    } catch (err) {
      showToast(err.message || 'Assessment failed', 'error');
    } finally {
      setAssessingSiteId(null);
    }
  };

  const toggleFolder = (projectId) => {
    setExpandedFolders(prev => ({
      ...prev,
      [projectId]: !prev[projectId]
    }));
  };

  if (!isAuthenticated) return null;

  /* Theme-aware color palette */
  const C = {
    bgPage: darkMode ? '#0f172a' : '#f8fafc',
    boxBg: darkMode ? '#1a1a2e' : '#ffffff',
    boxBgSecondary: darkMode ? '#16213e' : '#f1f5f9',
    cardBg: darkMode ? '#1e2a4a' : '#ffffff',
    border: darkMode ? 'rgba(255, 255, 255, 0.08)' : '#e2e8f0',
    textPrimary: darkMode ? '#e8eaf0' : '#0f172a',
    textSecondary: darkMode ? '#94a3b8' : '#64748b',
    textMuted: darkMode ? '#6b7a99' : '#94a3b8',
    gradient: 'linear-gradient(135deg, #4a90d9 0%, #2dd4bf 100%)',
    accentTeal: '#2dd4bf',
    accentBlue: '#4a90d9'
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: C.bgPage,
      color: C.textPrimary,
      fontFamily: "'Inter', sans-serif",
      padding: '12px 16px',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      boxSizing: 'border-box'
    }}>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: ${darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'};
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: ${darkMode ? 'rgba(74, 144, 217, 0.5)' : 'rgba(74, 144, 217, 0.4)'};
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #4a90d9;
        }
      `}</style>

      {/* ── TOP NAVIGATION BAR ─────────────────────────────────────── */}
      <header style={{
        height: '60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 8px'
      }}>
        {/* Swind Logo */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
          {!logoError ? (
            <img
              src={darkMode ? "/logo.png" : "/logo-light.png"}
              alt="Swind"
              style={{ height: '72px', width: 'auto', objectFit: 'contain' }}
              onError={() => setLogoError(true)}
            />
          ) : (
            <span style={{ background: C.gradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontSize: '1.4rem', fontWeight: 800 }}>Swind</span>
          )}
        </Link>

        {/* Top Right Action Pills + User Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Theme Toggle Button (Exact same style as Home page) */}
          <button
            onClick={toggleTheme}
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: darkMode ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.06)',
              border: `1px solid ${C.border}`,
              color: darkMode ? '#eab308' : '#64748b',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              flexShrink: 0,
            }}
            onMouseOver={e => e.currentTarget.style.background = darkMode ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.1)'}
            onMouseOut={e => e.currentTarget.style.background = darkMode ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.06)'}
          >
            {darkMode ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5"/>
                <line x1="12" y1="1" x2="12" y2="3"/>
                <line x1="12" y1="21" x2="12" y2="23"/>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                <line x1="1" y1="12" x2="3" y2="12"/>
                <line x1="21" y1="12" x2="23" y2="12"/>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            )}
          </button>

          {/* User Profile Avatar */}
          <div
            onClick={() => setIsProfileOpen(true)}
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              background: C.gradient,
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '0.82rem',
              cursor: 'pointer',
              boxShadow: '0 2px 10px rgba(74, 144, 217, 0.3)',
              marginLeft: '4px'
            }}
            title="User Settings / Profile"
          >
            {initials}
          </div>
        </div>
      </header>

      {/* ── 3-PANEL DASHBOARD GRID ───────────────────────────────────── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '260px 1fr 340px',
        gridTemplateRows: '1fr',
        gap: '14px',
        height: 'calc(100vh - 100px)',
        boxSizing: 'border-box'
      }}>

        {/* ── PANEL 1: LEFT SIDEBAR (Tools & Settings) ────── */}
        <div style={{
          background: C.boxBg,
          border: `1px solid ${C.border}`,
          borderRadius: '16px',
          padding: '1rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          overflow: 'hidden'
        }}>
          <div>
            {/* New Project Button */}
            <button
              onClick={() => setIsCreateProjectOpen(true)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                background: C.gradient,
                color: '#ffffff',
                border: 'none',
                borderRadius: '10px',
                fontWeight: 600,
                fontSize: '0.88rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 18px rgba(74, 144, 217, 0.3)',
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
              New Project
            </button>

            {/* View All Projects Button */}
            <button
              onClick={() => navigate('/projects')}
              style={{
                width: '100%',
                padding: '0.7rem 1rem',
                background: darkMode ? 'rgba(45, 212, 191, 0.12)' : 'rgba(45, 212, 191, 0.08)',
                color: C.accentTeal,
                border: `1px solid ${darkMode ? 'rgba(45, 212, 191, 0.3)' : 'rgba(45, 212, 191, 0.2)'}`,
                borderRadius: '10px',
                fontWeight: 600,
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                marginTop: '10px',
                marginBottom: '1.25rem',
                transition: 'all 0.15s ease'
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
              View All Projects
            </button>

            {/* Section Header */}
            <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: C.textMuted, marginBottom: '0.85rem', paddingLeft: '4px' }}>
              TOOLS
            </div>
          </div>

          {/* Bottom Actions */}
          <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: '0.85rem', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <button
              onClick={() => setIsProfileOpen(true)}
              style={{
                background: 'none',
                border: 'none',
                color: C.textSecondary,
                padding: '0.5rem 0.75rem',
                borderRadius: '6px',
                fontSize: '0.82rem',
                fontWeight: 500,
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '8px', textAlign: 'left'
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>
              Settings
            </button>

            <button
              onClick={logout}
              style={{
                background: 'none',
                border: 'none',
                color: '#ef4444',
                padding: '0.5rem 0.75rem',
                borderRadius: '6px',
                fontSize: '0.82rem',
                fontWeight: 500,
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '8px', textAlign: 'left'
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
              Sign Out
            </button>
          </div>
        </div>

        {/* ── PANEL 2: CENTER BOX (Full Interactive GIS Map) ─────────── */}
        <div style={{
          background: C.boxBg,
          border: `1px solid ${C.border}`,
          borderRadius: '16px',
          overflow: 'hidden',
          position: 'relative'
        }}>
          <SitesOverviewMap
            projects={projects}
            onRunAssessment={handleRunAssessment}
            onRegisterSite={() => {
              const activeProj = projects.find(p => p.id === activeProjectId) || projects[0];
              if (activeProj) {
                setSelectedProjectForSite(activeProj);
              } else {
                setIsCreateProjectOpen(true);
              }
            }}
            selectedSiteId={selectedSiteId}
          />
        </div>

        {/* ── PANEL 3: RIGHT SIDEBAR (Project Folders & Listed Sites Tree) ── */}
        <div style={{
          background: C.boxBg,
          border: `1px solid ${C.border}`,
          borderRadius: '16px',
          padding: '1.1rem',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          minHeight: 0
        }}>
          {/* Right Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: `1px solid ${C.border}`, flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.1rem' }}>📁</span>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: C.textPrimary, margin: 0 }}>
                Project Folders
              </h3>
            </div>
            <span style={{
              background: 'rgba(74, 144, 217, 0.15)',
              color: C.accentBlue,
              padding: '2px 8px',
              borderRadius: '9999px',
              fontSize: '0.75rem',
              fontWeight: 700
            }}>
              {projects.length} Folders
            </span>
          </div>

          {/* Project Folders Tree with Pop-down Menus */}
          <div 
            className="custom-scrollbar"
            style={{ 
              flex: 1, 
              minHeight: 0, 
              overflowY: 'scroll', 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '10px', 
              paddingRight: '6px',
              paddingBottom: '1.5rem'
            }}
          >
            {projects.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem 1rem', color: C.textMuted, fontSize: '0.88rem' }}>
                <p>No project folders yet.</p>
                <button
                  onClick={() => setIsCreateProjectOpen(true)}
                  style={{
                    marginTop: '8px',
                    background: C.gradient,
                    color: '#fff',
                    border: 'none',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  + Create First Project
                </button>
              </div>
            ) : (
              projects.map(project => {
                const isExpanded = !!expandedFolders[project.id];
                const sites = project.sites || [];

                return (
                  <div
                    key={project.id}
                    style={{
                      background: C.boxBgSecondary,
                      border: `1px solid ${C.border}`,
                      borderRadius: '10px',
                      flexShrink: 0,
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {/* Project Folder Header Button */}
                    <div
                      onClick={() => toggleFolder(project.id)}
                      style={{
                        padding: '0.75rem 0.9rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        background: isExpanded ? (darkMode ? 'rgba(74, 144, 217, 0.1)' : 'rgba(74, 144, 217, 0.05)') : 'transparent'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '0.9rem' }}>{isExpanded ? '📂' : '📁'}</span>
                        <div>
                          <div style={{ fontSize: '0.88rem', fontWeight: 700, color: C.textPrimary }}>
                            {project.name}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: C.accentTeal, fontFamily: 'monospace' }}>
                            {project.project_code} • {project.region}
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{
                          background: darkMode ? 'rgba(255,255,255,0.06)' : '#e2e8f0',
                          color: C.textSecondary,
                          padding: '1px 6px',
                          borderRadius: '4px',
                          fontSize: '0.7rem',
                          fontWeight: 600
                        }}>
                          {sites.length}
                        </span>
                        <svg
                          width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                          style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease', color: C.textMuted }}
                        >
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </div>
                    </div>

                    {/* Pop-down Menu consisting of Listed Sites */}
                    {isExpanded && (
                      <div style={{ padding: '0.5rem 0.75rem 0.75rem', borderTop: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {sites.length === 0 ? (
                          <div style={{ display: 'flex', alignItems: 'center', justifyBetween: 'space-between', padding: '0.4rem 0.2rem' }}>
                            <span style={{ fontSize: '0.78rem', color: C.textMuted }}>No sites registered</span>
                            <button
                              onClick={(e) => { e.stopPropagation(); setSelectedProjectForSite(project); }}
                              style={{
                                background: 'rgba(45, 212, 191, 0.12)',
                                color: C.accentTeal,
                                border: '1px solid rgba(45, 212, 191, 0.3)',
                                padding: '2px 8px',
                                borderRadius: '4px',
                                fontSize: '0.72rem',
                                fontWeight: 600,
                                cursor: 'pointer'
                              }}
                            >
                              + Add Site
                            </button>
                          </div>
                        ) : (
                          sites.map(site => (
                            <div
                              key={site.id}
                              onClick={() => setSelectedSiteId(site.id)}
                              style={{
                                background: C.cardBg,
                                border: selectedSiteId === site.id ? `1px solid ${C.accentTeal}` : `1px solid ${C.border}`,
                                borderRadius: '8px',
                                padding: '0.65rem 0.75rem',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '4px',
                                transition: 'all 0.15s ease'
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <span style={{ fontSize: '0.82rem', fontWeight: 600, color: C.textPrimary }}>
                                  📍 {site.name}
                                </span>
                                <span style={{ fontSize: '0.72rem', color: C.textMuted }}>
                                  {site.land_area} ha
                                </span>
                              </div>

                              <div style={{ fontSize: '0.72rem', color: C.textMuted, fontFamily: 'monospace' }}>
                                {site.latitude.toFixed(4)}, {site.longitude.toFixed(4)}
                              </div>

                              {/* Analysis Button -> Redirects to Site Analysis / Opens AI Assessment Modal */}
                              <div style={{ marginTop: '4px', display: 'flex', justifyContent: 'flex-end' }}>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleRunAssessment(project.id, site.id);
                                  }}
                                  disabled={assessingSiteId === site.id}
                                  style={{
                                    background: 'linear-gradient(135deg, #4a90d9 0%, #2dd4bf 100%)',
                                    color: '#ffffff',
                                    border: 'none',
                                    padding: '4px 10px',
                                    borderRadius: '6px',
                                    fontSize: '0.75rem',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    boxShadow: '0 2px 8px rgba(74, 144, 217, 0.3)',
                                    opacity: assessingSiteId === site.id ? 0.6 : 1
                                  }}
                                >
                                  {assessingSiteId === site.id ? '⚡ Assessing...' : '⚡ Analysis'}
                                </button>
                              </div>
                            </div>
                          ))
                        )}

                        {/* Add Site Button under folder */}
                        {sites.length > 0 && (
                          <button
                            onClick={() => setSelectedProjectForSite(project)}
                            style={{
                              marginTop: '2px',
                              background: 'rgba(74, 144, 217, 0.1)',
                              color: C.accentBlue,
                              border: '1px dashed rgba(74, 144, 217, 0.3)',
                              padding: '4px 8px',
                              borderRadius: '6px',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              cursor: 'pointer',
                              width: '100%',
                              textAlign: 'center'
                            }}
                          >
                            + Add Site to {project.name}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>

      {/* ── MODALS ──────────────────────────────────────────────────── */}
      <CreateProjectModal
        isOpen={isCreateProjectOpen}
        onClose={() => setIsCreateProjectOpen(false)}
        onProjectCreated={handleProjectCreated}
        onOpenSiteModal={handleOpenSiteModalForProject}
      />

      <RegisterSiteModal
        isOpen={!!selectedProjectForSite}
        onClose={() => setSelectedProjectForSite(null)}
        project={selectedProjectForSite}
        onSiteRegistered={handleSiteRegistered}
      />

      <AssessmentReportModal
        isOpen={!!assessmentReport}
        onClose={() => setAssessmentReport(null)}
        report={assessmentReport}
      />

      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />
    </div>
  );
}
