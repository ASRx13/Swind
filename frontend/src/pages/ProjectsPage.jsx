import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiRequest } from '../api/client';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';
import CreateProjectModal from '../components/CreateProjectModal';

export default function ProjectsPage() {
  const { isAuthenticated, user } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);
  const [expandedCards, setExpandedCards] = useState({});

  // Dropdown menu state
  const [openMenu, setOpenMenu] = useState(null); // 'project-{id}' or 'site-{projectId}-{siteId}'
  const menuRef = useRef(null);

  // Rename modal state
  const [renameTarget, setRenameTarget] = useState(null); // { type: 'project'|'site', projectId, siteId?, currentName }
  const [renameValue, setRenameValue] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchProjects();
  }, [isAuthenticated, navigate]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const data = await apiRequest('/api/projects', 'GET');
      setProjects(data || []);
    } catch (err) {
      console.error('Failed to fetch projects', err);
    } finally {
      setLoading(false);
    }
  };

  const handleProjectCreated = (newProject) => {
    setProjects([newProject, ...projects]);
  };

  const toggleCardExpand = (projectId) => {
    setExpandedCards(prev => ({
      ...prev,
      [projectId]: !prev[projectId]
    }));
  };

  // ── Rename handlers ──
  const openRenameModal = (type, projectId, siteId, currentName) => {
    setOpenMenu(null);
    setRenameTarget({ type, projectId, siteId, currentName });
    setRenameValue(currentName);
  };

  const handleRenameSubmit = async () => {
    if (!renameTarget || renameValue.trim().length < 2) return;
    try {
      if (renameTarget.type === 'project') {
        await apiRequest(`/api/projects/${renameTarget.projectId}`, 'PATCH', { name: renameValue.trim() });
        showToast('Project renamed successfully', 'success');
      } else {
        await apiRequest(`/api/projects/${renameTarget.projectId}/sites/${renameTarget.siteId}`, 'PATCH', { name: renameValue.trim() });
        showToast('Site renamed successfully', 'success');
      }
      fetchProjects();
    } catch (err) {
      showToast(err.message || 'Rename failed', 'error');
    }
    setRenameTarget(null);
    setRenameValue('');
  };

  // ── Delete handlers ──
  const handleDeleteProject = async (projectId) => {
    setOpenMenu(null);
    if (!window.confirm('Delete this entire project and all its sites? This cannot be undone.')) return;
    try {
      await apiRequest(`/api/projects/${projectId}`, 'DELETE');
      setProjects(prev => prev.filter(p => p.id !== projectId));
      showToast('Project deleted', 'success');
    } catch (err) {
      showToast(err.message || 'Delete failed', 'error');
    }
  };

  const handleDeleteSite = async (projectId, siteId) => {
    setOpenMenu(null);
    if (!window.confirm('Delete this site? This cannot be undone.')) return;
    try {
      await apiRequest(`/api/projects/${projectId}/sites/${siteId}`, 'DELETE');
      fetchProjects();
      showToast('Site deleted', 'success');
    } catch (err) {
      showToast(err.message || 'Delete failed', 'error');
    }
  };

  if (!isAuthenticated) return null;

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
    accentBlue: '#4a90d9',
    dangerRed: '#ef4444',
    menuBg: darkMode ? '#1e293b' : '#ffffff',
    menuHover: darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
  };

  // Shared dropdown menu component
  const DropdownMenu = ({ menuKey, items }) => {
    if (openMenu !== menuKey) return null;
    return (
      <div
        ref={menuRef}
        style={{
          position: 'absolute',
          top: '36px',
          right: '0',
          background: C.menuBg,
          border: `1px solid ${C.border}`,
          borderRadius: '10px',
          boxShadow: darkMode ? '0 8px 32px rgba(0,0,0,0.5)' : '0 8px 32px rgba(0,0,0,0.12)',
          zIndex: 100,
          minWidth: '160px',
          padding: '6px 0',
          overflow: 'hidden'
        }}
      >
        {items.map((item, i) => (
          <button
            key={i}
            onClick={(e) => { e.stopPropagation(); item.onClick(); }}
            style={{
              width: '100%',
              padding: '10px 16px',
              background: 'none',
              border: 'none',
              color: item.danger ? C.dangerRed : C.textPrimary,
              fontSize: '0.85rem',
              fontWeight: 500,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              textAlign: 'left',
              transition: 'background 0.1s ease',
              fontFamily: "'Inter', sans-serif"
            }}
            onMouseOver={e => e.currentTarget.style.background = item.danger ? 'rgba(239, 68, 68, 0.1)' : C.menuHover}
            onMouseOut={e => e.currentTarget.style.background = 'none'}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </div>
    );
  };

  // 3-dot menu button
  const MenuButton = ({ menuKey }) => (
    <button
      onClick={(e) => { e.stopPropagation(); setOpenMenu(openMenu === menuKey ? null : menuKey); }}
      style={{
        background: 'none',
        border: 'none',
        color: C.textMuted,
        cursor: 'pointer',
        padding: '4px',
        borderRadius: '6px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.15s ease'
      }}
      onMouseOver={e => { e.currentTarget.style.background = C.menuHover; e.currentTarget.style.color = C.textPrimary; }}
      onMouseOut={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = C.textMuted; }}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none">
        <circle cx="12" cy="5" r="2"/>
        <circle cx="12" cy="12" r="2"/>
        <circle cx="12" cy="19" r="2"/>
      </svg>
    </button>
  );

  // Rename SVG icon
  const RenameIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
  );

  // Delete SVG icon
  const DeleteIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6"/>
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
    </svg>
  );

  return (
    <div style={{
      minHeight: '100vh',
      background: C.bgPage,
      color: C.textPrimary,
      fontFamily: "'Inter', sans-serif",
      padding: '12px 16px',
      display: 'flex',
      flexDirection: 'column',
      gap: '24px',
      boxSizing: 'border-box'
    }}>
      {/* HEADER */}
      <header style={{
        height: '60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 8px'
      }}>
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <img
            src={darkMode ? "/logo.png" : "/logo-light.png"}
            alt="SWIND"
            style={{ height: '72px', width: 'auto', objectFit: 'contain' }}
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextSibling.style.display = 'block';
            }}
          />
          <span style={{ display: 'none', background: C.gradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontSize: '1.4rem', fontWeight: 800 }}>
            SWIND
          </span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={toggleTheme}
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
          
          <button
            onClick={() => navigate('/dashboard')}
            style={{
              padding: '0.6rem 1.2rem',
              background: C.gradient,
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '0.9rem',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(74, 144, 217, 0.25)',
              transition: 'transform 0.15s ease'
            }}
            onMouseOver={e => e.currentTarget.style.transform = 'translateY(-1px)'}
            onMouseOut={e => e.currentTarget.style.transform = 'none'}
          >
            View Dashboard
          </button>
        </div>
      </header>

      {/* GRID */}
      <div style={{
        padding: '0 8px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '20px'
      }}>
        
        {/* Create Project Card */}
        <div 
          onClick={() => setIsCreateProjectOpen(true)}
          style={{
            background: C.boxBg,
            border: `1px dashed ${C.border}`,
            borderRadius: '12px',
            minHeight: '200px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            color: C.accentBlue
          }}
          onMouseOver={e => {
            e.currentTarget.style.borderColor = C.accentBlue;
            e.currentTarget.style.transform = 'scale(1.02)';
          }}
          onMouseOut={e => {
            e.currentTarget.style.borderColor = C.border;
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <div style={{ fontSize: '3rem', fontWeight: 300, marginBottom: '8px' }}>+</div>
          <div style={{ fontWeight: 600, fontSize: '1rem', color: C.textPrimary }}>Create New Project</div>
        </div>

        {/* Project Cards */}
        {projects.map(project => {
          const isExpanded = !!expandedCards[project.id];
          const sites = project.sites || [];
          const projMenuKey = `project-${project.id}`;
          
          return (
            <div 
              key={project.id}
              onClick={() => toggleCardExpand(project.id)}
              style={{
                background: C.cardBg,
                border: `1px solid ${C.border}`,
                borderRadius: '12px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                position: 'relative',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
              }}
              onMouseOver={e => {
                e.currentTarget.style.borderColor = C.accentBlue;
                e.currentTarget.style.boxShadow = `0 4px 12px ${darkMode ? 'rgba(74, 144, 217, 0.15)' : 'rgba(74, 144, 217, 0.1)'}`;
              }}
              onMouseOut={e => {
                e.currentTarget.style.borderColor = C.border;
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)';
              }}
            >
              {/* 3-dot menu for Project */}
              <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
                <MenuButton menuKey={projMenuKey} />
                <DropdownMenu
                  menuKey={projMenuKey}
                  items={[
                    {
                      icon: <RenameIcon />,
                      label: 'Rename',
                      onClick: () => openRenameModal('project', project.id, null, project.name)
                    },
                    {
                      icon: <DeleteIcon />,
                      label: 'Delete',
                      danger: true,
                      onClick: () => handleDeleteProject(project.id)
                    }
                  ]}
                />
              </div>

              <div style={{
                fontWeight: 700,
                fontSize: '1.1rem',
                color: C.textPrimary,
                marginBottom: '4px',
                paddingRight: '32px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {project.name}
              </div>
              
              <div style={{ fontSize: '0.8rem', color: C.accentTeal, fontFamily: 'monospace', marginBottom: '12px' }}>
                {project.project_code} | {project.region}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '12px', borderTop: `1px solid ${C.border}` }}>
                <div style={{ fontSize: '0.75rem', color: C.textMuted }}>
                  {new Date(project.created_at || Date.now()).toLocaleDateString()}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: C.textSecondary }}>
                    {sites.length} {sites.length === 1 ? 'site' : 'sites'}
                  </span>
                  <svg
                    width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.textMuted} strokeWidth="2"
                    style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }}
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>
              </div>

              {/* Expanded Sites Section */}
              {isExpanded && (
                <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {sites.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '12px', color: C.textMuted, fontSize: '0.82rem' }}>
                      No sites registered yet.
                    </div>
                  ) : (
                    sites.map(site => {
                      const siteMenuKey = `site-${project.id}-${site.id}`;
                      return (
                        <div key={site.id} style={{
                          background: C.boxBgSecondary,
                          borderRadius: '8px',
                          padding: '10px 12px',
                          border: `1px solid ${C.border}`,
                          position: 'relative'
                        }}>
                          {/* 3-dot menu for Site */}
                          <div style={{ position: 'absolute', top: '8px', right: '8px' }}>
                            <MenuButton menuKey={siteMenuKey} />
                            <DropdownMenu
                              menuKey={siteMenuKey}
                              items={[
                                {
                                  icon: <RenameIcon />,
                                  label: 'Rename',
                                  onClick: () => openRenameModal('site', project.id, site.id, site.name)
                                },
                                {
                                  icon: <DeleteIcon />,
                                  label: 'Delete',
                                  danger: true,
                                  onClick: () => handleDeleteSite(project.id, site.id)
                                }
                              ]}
                            />
                          </div>

                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', paddingRight: '28px' }}>
                            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: C.textPrimary }}>{site.name}</span>
                            <span style={{ fontSize: '0.75rem', color: C.textMuted }}>{site.land_area} ha</span>
                          </div>
                          <div style={{ fontSize: '0.75rem', color: C.textMuted, fontFamily: 'monospace' }}>
                            {site.latitude.toFixed(4)}, {site.longitude.toFixed(4)}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Rename Modal Overlay */}
      {renameTarget && (
        <div
          onClick={() => { setRenameTarget(null); setRenameValue(''); }}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: C.boxBg,
              border: `1px solid ${C.border}`,
              borderRadius: '16px',
              padding: '28px',
              width: '400px',
              maxWidth: '90vw',
              boxShadow: '0 16px 64px rgba(0,0,0,0.3)'
            }}
          >
            <h3 style={{ margin: '0 0 16px 0', fontSize: '1.1rem', fontWeight: 700, color: C.textPrimary }}>
              Rename {renameTarget.type === 'project' ? 'Project' : 'Site'}
            </h3>
            <input
              type="text"
              value={renameValue}
              onChange={e => setRenameValue(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleRenameSubmit(); }}
              autoFocus
              style={{
                width: '100%',
                padding: '12px 14px',
                background: C.boxBgSecondary,
                border: `1px solid ${C.border}`,
                borderRadius: '8px',
                color: C.textPrimary,
                fontSize: '0.95rem',
                fontFamily: "'Inter', sans-serif",
                outline: 'none',
                boxSizing: 'border-box',
                marginBottom: '20px'
              }}
              onFocus={e => e.currentTarget.style.borderColor = C.accentBlue}
              onBlur={e => e.currentTarget.style.borderColor = C.border}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                onClick={() => { setRenameTarget(null); setRenameValue(''); }}
                style={{
                  padding: '8px 18px',
                  background: 'none',
                  border: `1px solid ${C.border}`,
                  borderRadius: '8px',
                  color: C.textSecondary,
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: "'Inter', sans-serif"
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleRenameSubmit}
                disabled={renameValue.trim().length < 2}
                style={{
                  padding: '8px 18px',
                  background: renameValue.trim().length < 2 ? C.textMuted : C.gradient,
                  border: 'none',
                  borderRadius: '8px',
                  color: '#ffffff',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: renameValue.trim().length < 2 ? 'not-allowed' : 'pointer',
                  boxShadow: renameValue.trim().length < 2 ? 'none' : '0 2px 8px rgba(74, 144, 217, 0.3)',
                  fontFamily: "'Inter', sans-serif"
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      <CreateProjectModal
        isOpen={isCreateProjectOpen}
        onClose={() => setIsCreateProjectOpen(false)}
        onProjectCreated={handleProjectCreated}
      />
    </div>
  );
}
