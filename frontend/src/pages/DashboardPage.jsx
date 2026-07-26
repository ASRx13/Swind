import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiRequest } from '../api/client';
import { useToast } from '../context/ToastContext';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import CreateProjectModal from '../components/CreateProjectModal';
import RegisterSiteModal from '../components/RegisterSiteModal';
import AssessmentReportModal from '../components/AssessmentReportModal';

export default function DashboardPage() {
  const { isAuthenticated, user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);
  const [selectedProjectForSite, setSelectedProjectForSite] = useState(null);
  const [activeProject, setActiveProject] = useState(null);

  const [assessmentReport, setAssessmentReport] = useState(null);
  const [assessingSiteId, setAssessingSiteId] = useState(null);

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
      if (data && data.length > 0) {
        setActiveProject(prev => prev ? data.find(p => p.id === prev.id) || data[0] : data[0]);
      }
    } catch (err) {
      console.error('Failed to fetch projects', err);
    } finally {
      setLoading(false);
    }
  };

  const handleProjectCreated = (newProject) => {
    setProjects([newProject, ...projects]);
    setActiveProject(newProject);
  };

  const handleSiteRegistered = (newSite) => {
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

  if (!isAuthenticated) return null;

  const cardStyle = {
    background: '#1e2a4a',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '14px',
    padding: '1.5rem',
    color: '#e8eaf0',
    transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
    cursor: 'pointer',
    position: 'relative'
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#16213e', fontFamily: "'Inter', sans-serif" }}>
      <Sidebar onOpenCreateProject={() => setIsCreateProjectOpen(true)} />
      
      <div style={{ flex: 1, marginLeft: '260px', display: 'flex', flexDirection: 'column' }}>
        <Topbar />
        
        <main style={{ padding: '2rem 2.5rem', flex: 1 }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <div>
              <h1 style={{ color: '#e8eaf0', fontSize: '1.75rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '0.2rem' }}>
                Projects & Candidate Sites
              </h1>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
                Manage deployment sites and run AI solar/wind resource prediction models.
              </p>
            </div>

            <button 
              onClick={() => setIsCreateProjectOpen(true)}
              style={{
                background: 'linear-gradient(135deg, #4a90d9 0%, #2dd4bf 100%)',
                color: '#ffffff',
                border: 'none',
                padding: '0.75rem 1.4rem',
                borderRadius: '10px',
                fontWeight: 600,
                fontSize: '0.9rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 20px rgba(74, 144, 217, 0.35)',
                transition: 'transform 0.2s'
              }}
              onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              New Project
            </button>
          </div>

          {loading ? (
            <div style={{ color: '#94a3b8', textAlign: 'center', padding: '4rem 0' }}>Loading projects...</div>
          ) : projects.length === 0 ? (
            /* Empty State */
            <div style={{ 
              background: '#1e2a4a', 
              border: '1px solid rgba(255, 255, 255, 0.06)', 
              borderRadius: '16px', 
              padding: '4.5rem 2rem', 
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)'
            }}>
              <div style={{ 
                width: '72px', height: '72px', 
                background: 'rgba(74, 144, 217, 0.12)', 
                border: '1px solid rgba(74, 144, 217, 0.2)',
                borderRadius: '20px', 
                display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' 
              }}>
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#4a90d9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                  <line x1="12" y1="11" x2="12" y2="17"></line>
                  <line x1="9" y1="14" x2="15" y2="14"></line>
                </svg>
              </div>

              <h3 style={{ color: '#e8eaf0', fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                No projects created yet
              </h3>
              <p style={{ color: '#b0b8c9', marginBottom: '1.75rem', maxWidth: '420px', fontSize: '0.95rem', lineHeight: 1.6 }}>
                Create your first renewable project to auto-generate a unique Project ID and drop pins on interactive map sites.
              </p>

              <button 
                onClick={() => setIsCreateProjectOpen(true)}
                style={{
                  background: 'linear-gradient(135deg, #4a90d9 0%, #2dd4bf 100%)',
                  color: '#ffffff',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '10px',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: '8px',
                  boxShadow: '0 4px 20px rgba(74, 144, 217, 0.35)'
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                Create First Project
              </button>
            </div>
          ) : (
            /* Projects Grid & Site Management */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {/* Project Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
                {projects.map(proj => {
                  const isSelected = activeProject?.id === proj.id;
                  return (
                    <div 
                      key={proj.id} 
                      style={{
                        ...cardStyle,
                        borderColor: isSelected ? '#4a90d9' : 'rgba(255, 255, 255, 0.08)',
                        background: isSelected ? 'rgba(74, 144, 217, 0.08)' : '#1e2a4a',
                        boxShadow: isSelected ? '0 0 20px rgba(74, 144, 217, 0.2)' : 'none'
                      }}
                      onClick={() => setActiveProject(proj)}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                        <span style={{
                          background: 'rgba(74, 144, 217, 0.15)',
                          color: '#2dd4bf',
                          padding: '0.2rem 0.6rem',
                          borderRadius: '6px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          letterSpacing: '0.05em',
                          fontFamily: 'monospace',
                          border: '1px solid rgba(45, 212, 191, 0.2)'
                        }}>
                          {proj.project_code}
                        </span>
                        <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                          {proj.sites?.length || 0} Site(s)
                        </span>
                      </div>

                      <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.3rem' }}>
                        {proj.name}
                      </h3>
                      <p style={{ color: '#b0b8c9', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
                        📍 {proj.region}
                      </p>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '0.75rem' }}>
                        <span style={{ fontSize: '0.78rem', color: '#6b7a99' }}>
                          Created {new Date(proj.created_at).toLocaleDateString()}
                        </span>
                        <button 
                          onClick={(e) => { e.stopPropagation(); setSelectedProjectForSite(proj); }}
                          style={{
                            background: 'rgba(45, 212, 191, 0.12)',
                            color: '#2dd4bf',
                            border: '1px solid rgba(45, 212, 191, 0.3)',
                            padding: '0.35rem 0.75rem',
                            borderRadius: '6px',
                            fontSize: '0.78rem',
                            fontWeight: 600,
                            cursor: 'pointer'
                          }}
                        >
                          + Register Site
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Selected Project Detailed Sites View */}
              {activeProject && (
                <div style={{
                  background: '#1a1a2e',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '16px',
                  padding: '2rem',
                  marginTop: '1rem'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#ffffff' }}>
                          {activeProject.name} — Registered Sites
                        </h2>
                        <span style={{
                          background: 'rgba(74, 144, 217, 0.15)',
                          color: '#4a90d9',
                          padding: '0.2rem 0.6rem',
                          borderRadius: '6px',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          fontFamily: 'monospace'
                        }}>
                          {activeProject.project_code}
                        </span>
                      </div>
                      <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                        Region: {activeProject.region} • Total Sites: {activeProject.sites?.length || 0}
                      </p>
                    </div>

                    <button 
                      onClick={() => setSelectedProjectForSite(activeProject)}
                      style={{
                        background: 'linear-gradient(135deg, #4a90d9 0%, #2dd4bf 100%)',
                        color: '#ffffff',
                        border: 'none',
                        padding: '0.6rem 1.1rem',
                        borderRadius: '8px',
                        fontWeight: 600,
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: '6px',
                        boxShadow: '0 4px 15px rgba(74, 144, 217, 0.3)'
                      }}
                    >
                      📍 Drop Pin & Register Site
                    </button>
                  </div>

                  {!activeProject.sites || activeProject.sites.length === 0 ? (
                    <div style={{
                      textAlign: 'center',
                      padding: '3rem 1.5rem',
                      background: 'rgba(255,255,255,0.02)',
                      borderRadius: '12px',
                      border: '1px dashed rgba(255,255,255,0.08)'
                    }}>
                      <p style={{ color: '#b0b8c9', marginBottom: '1rem', fontSize: '0.9rem' }}>
                        No candidate sites registered under this project yet.
                      </p>
                      <button 
                        onClick={() => setSelectedProjectForSite(activeProject)}
                        style={{
                          background: 'rgba(74, 144, 217, 0.15)',
                          color: '#4a90d9',
                          border: '1px solid rgba(74, 144, 217, 0.3)',
                          padding: '0.5rem 1rem',
                          borderRadius: '8px',
                          fontSize: '0.85rem',
                          fontWeight: 600,
                          cursor: 'pointer'
                        }}
                      >
                        + Register First Site with Interactive Map
                      </button>
                    </div>
                  ) : (
                    /* Table of Registered Sites */
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                        <thead>
                          <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', color: '#6b7a99' }}>
                            <th style={{ padding: '0.75rem 1rem' }}>Site Name</th>
                            <th style={{ padding: '0.75rem 1rem' }}>Coordinates</th>
                            <th style={{ padding: '0.75rem 1rem' }}>Land Area</th>
                            <th style={{ padding: '0.75rem 1rem' }}>Elevation</th>
                            <th style={{ padding: '0.75rem 1rem' }}>Ownership</th>
                            <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>AI Prediction</th>
                          </tr>
                        </thead>
                        <tbody>
                          {activeProject.sites.map(site => (
                            <tr key={site.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', color: '#e8eaf0' }}>
                              <td style={{ padding: '1rem', fontWeight: 600, color: '#ffffff' }}>
                                {site.name}
                              </td>
                              <td style={{ padding: '1rem', fontFamily: 'monospace', color: '#2dd4bf' }}>
                                📍 {site.latitude.toFixed(4)}, {site.longitude.toFixed(4)}
                              </td>
                              <td style={{ padding: '1rem' }}>
                                {site.land_area} ha
                              </td>
                              <td style={{ padding: '1rem' }}>
                                {site.elevation ? `${site.elevation} m` : 'N/A'}
                              </td>
                              <td style={{ padding: '1rem' }}>
                                <span style={{
                                  background: 'rgba(255,255,255,0.05)',
                                  padding: '0.2rem 0.5rem',
                                  borderRadius: '4px',
                                  fontSize: '0.78rem',
                                  border: '1px solid rgba(255,255,255,0.1)'
                                }}>
                                  {site.land_ownership}
                                </span>
                              </td>
                              <td style={{ padding: '1rem', textAlign: 'right' }}>
                                <button 
                                  onClick={() => handleRunAssessment(activeProject.id, site.id)}
                                  disabled={assessingSiteId === site.id}
                                  style={{
                                    background: 'linear-gradient(135deg, #4a90d9 0%, #2dd4bf 100%)',
                                    color: '#ffffff',
                                    border: 'none',
                                    padding: '0.4rem 0.85rem',
                                    borderRadius: '6px',
                                    fontSize: '0.8rem',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    boxShadow: '0 2px 10px rgba(74, 144, 217, 0.3)',
                                    opacity: assessingSiteId === site.id ? 0.6 : 1
                                  }}
                                >
                                  {assessingSiteId === site.id ? '⚡ Assessing...' : '⚡ Run AI Prediction'}
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Modals */}
      <CreateProjectModal 
        isOpen={isCreateProjectOpen} 
        onClose={() => setIsCreateProjectOpen(false)} 
        onProjectCreated={handleProjectCreated}
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
    </div>
  );
}

