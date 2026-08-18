import { jsPDF } from 'jspdf';

/**
 * Generates a clean, professional multi-section PDF report for Site Assessment.
 * 
 * Required Sections:
 * 1. Project Details (Project Name, Code, Region)
 * 2. Candidate Site Details (Site Name, Energy Type, Location, Coordinates, Elevation)
 * 3. Analysis Report & Meteorological Data (Irradiance, Wind Speed, Annual Energy MWh, CO2 Offset)
 * 4. Suitability & Site Assessment Executive Message
 */
export function generateSiteAssessmentPDF(report, projectData = {}) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const {
    site_name = 'Candidate Site',
    project_code = 'PRJ-2026',
    region = 'Not Specified',
    coordinates = { latitude: 0, longitude: 0 },
    land_parameters = { elevation_m: 0, land_area_ha: 0 },
    environmental_metrics: env = {},
    prediction_analytics: pred = {}
  } = report;

  const score = pred?.suitability_score || 0;
  const energyType = report?.energy_type || 'solar';
  const country = report?.country || '';
  const state = report?.state || '';
  const city = report?.city || '';

  // Palette
  const navyDark = [15, 23, 42];       // #0f172a
  const tealAccent = [45, 212, 191];    // #2dd4bf
  const blueAccent = [74, 144, 217];    // #4a90d9
  const textDark = [30, 41, 59];        // #1e293b
  const textGray = [100, 116, 139];    // #64748b
  const bgLight = [248, 250, 252];      // #f8fafc
  const cardBg = [241, 245, 249];       // #f1f5f9
  
  let scoreColor = [34, 197, 94]; // Green
  if (score < 50) scoreColor = [239, 68, 68]; // Red
  else if (score < 75) scoreColor = [234, 179, 8]; // Yellow

  const pageWidth = 210;
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;
  let y = 0;

  // ═════════════════════════════════════════════════════════
  // TOP HEADER BANNER
  // ═════════════════════════════════════════════════════════
  doc.setFillColor(...navyDark);
  doc.rect(0, 0, pageWidth, 28, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  doc.text('SWIND', margin, 14);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...tealAccent);
  doc.text('RENEWABLE ENERGY SITE ASSESSMENT REPORT', margin + 34, 14);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(148, 163, 184);
  const timestamp = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  doc.text(`Generated: ${timestamp}`, pageWidth - margin, 14, { align: 'right' });

  doc.setDrawColor(...tealAccent);
  doc.setLineWidth(0.8);
  doc.line(margin, 22, pageWidth - margin, 22);

  y = 35;

  // Section Header helper
  function drawSectionHeader(title) {
    doc.setFillColor(...navyDark);
    doc.rect(margin, y, 3, 7, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(...navyDark);
    doc.text(title, margin + 6, y + 5.5);

    y += 10;
  }

  // ═════════════════════════════════════════════════════════
  // SECTION 1: PROJECT DETAILS
  // ═════════════════════════════════════════════════════════
  drawSectionHeader('1. PROJECT DETAILS');

  doc.setFillColor(...cardBg);
  doc.roundedRect(margin, y, contentWidth, 20, 3, 3, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, y, contentWidth, 20, 3, 3, 'D');

  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...textGray);
  doc.text('PROJECT NAME', margin + 6, y + 6);
  doc.text('PROJECT CODE', margin + 75, y + 6);
  doc.text('REGION / JURISDICTION', margin + 130, y + 6);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(...textDark);
  const projName = report.project_name || projectData?.name || 'Renewable Expansion Plan';
  doc.text(projName.length > 32 ? projName.substring(0, 30) + '...' : projName, margin + 6, y + 13);
  
  doc.setTextColor(...blueAccent);
  doc.text(project_code, margin + 75, y + 13);

  doc.setTextColor(...textDark);
  doc.text(region || 'Global', margin + 130, y + 13);

  y += 26;

  // ═════════════════════════════════════════════════════════
  // SECTION 2: CANDIDATE SITE DETAILS
  // ═════════════════════════════════════════════════════════
  drawSectionHeader('2. CANDIDATE SITE DETAILS');

  doc.setFillColor(...cardBg);
  doc.roundedRect(margin, y, contentWidth, 32, 3, 3, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, y, contentWidth, 32, 3, 3, 'D');

  // Row 1
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...textGray);
  doc.text('SITE NAME', margin + 6, y + 6);
  doc.text('ENERGY TYPE', margin + 75, y + 6);
  doc.text('LOCATION (COUNTRY / STATE / CITY)', margin + 130, y + 6);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...textDark);
  doc.text(site_name, margin + 6, y + 12);

  const energyLabel = energyType.toUpperCase() === 'WIND' ? 'Wind Turbine Farm' : 'Solar PV Array';
  doc.text(energyLabel, margin + 75, y + 12);

  const locText = [city, state, country].filter(Boolean).join(', ') || region;
  doc.text(locText.length > 28 ? locText.substring(0, 26) + '...' : locText, margin + 130, y + 12);

  // Row 2
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...textGray);
  doc.text('COORDINATES (LAT, LNG)', margin + 6, y + 20);
  doc.text('GROUND ELEVATION', margin + 75, y + 20);
  doc.text('ASSESSMENT DATE', margin + 130, y + 20);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  const latStr = coordinates?.latitude !== undefined ? coordinates.latitude.toFixed(6) : '0';
  const lngStr = coordinates?.longitude !== undefined ? coordinates.longitude.toFixed(6) : '0';
  doc.text(`${latStr}°N, ${lngStr}°E`, margin + 6, y + 26);

  const elevVal = land_parameters?.elevation_m !== undefined ? land_parameters.elevation_m : (report?.elevation || 0);
  doc.text(`${elevVal} meters ASL`, margin + 75, y + 26);

  doc.text(new Date().toLocaleDateString(), margin + 130, y + 26);

  y += 38;

  // ═════════════════════════════════════════════════════════
  // SECTION 3: ANALYSIS REPORT & METEOROLOGICAL DATA
  // ═════════════════════════════════════════════════════════
  drawSectionHeader('3. ANALYSIS REPORT & PREDICTIVE ANALYTICS');

  // Suitability Score Banner Card
  doc.setFillColor(...scoreColor);
  doc.roundedRect(margin, y, 42, 22, 3, 3, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text(`${score}%`, margin + 21, y + 13, { align: 'center' });
  doc.setFontSize(7.5);
  doc.text('SUITABILITY', margin + 21, y + 19, { align: 'center' });

  // Right summary block next to score
  doc.setFillColor(...cardBg);
  doc.roundedRect(margin + 46, y, contentWidth - 46, 22, 3, 3, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin + 46, y, contentWidth - 46, 22, 3, 3, 'D');

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...textDark);
  doc.text(pred?.recommendation || 'Site Evaluated', margin + 50, y + 8);

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...textGray);
  const co2Val = pred?.co2_offset_tons_year ? pred.co2_offset_tons_year.toLocaleString() : 'N/A';
  doc.text(`Estimated CO2 Offset: ${co2Val} Tons / year`, margin + 50, y + 15);

  y += 28;

  // Dual Energy Potential Grid
  const halfW = (contentWidth - 6) / 2;

  // Solar Card
  doc.setFillColor(254, 243, 199);
  doc.roundedRect(margin, y, halfW, 24, 3, 3, 'F');
  doc.setDrawColor(245, 158, 11);
  doc.roundedRect(margin, y, halfW, 24, 3, 3, 'D');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(180, 83, 9);
  doc.text('SOLAR ENERGY POTENTIAL', margin + 5, y + 6);

  doc.setFontSize(11.5);
  doc.setTextColor(...textDark);
  const solarAnnual = pred?.solar_annual_mwh ? pred.solar_annual_mwh.toLocaleString() : '0';
  doc.text(`${solarAnnual} MWh/year`, margin + 5, y + 14);

  doc.setFontSize(7.5);
  doc.setTextColor(...textGray);
  doc.text(`Capacity Factor: ${pred?.solar_capacity_factor_pct || 0}%  |  Capacity: ${pred?.installed_solar_mw || 10} MW`, margin + 5, y + 20);

  // Wind Card
  doc.setFillColor(224, 242, 254);
  doc.roundedRect(margin + halfW + 6, y, halfW, 24, 3, 3, 'F');
  doc.setDrawColor(14, 165, 233);
  doc.roundedRect(margin + halfW + 6, y, halfW, 24, 3, 3, 'D');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(3, 105, 161);
  doc.text('WIND ENERGY POTENTIAL', margin + halfW + 11, y + 6);

  doc.setFontSize(11.5);
  doc.setTextColor(...textDark);
  const windAnnual = pred?.wind_annual_mwh ? pred.wind_annual_mwh.toLocaleString() : '0';
  doc.text(`${windAnnual} MWh/year`, margin + halfW + 11, y + 14);

  doc.setFontSize(7.5);
  doc.setTextColor(...textGray);
  doc.text(`Capacity Factor: ${pred?.wind_capacity_factor_pct || 0}%  |  Capacity: ${pred?.installed_wind_mw || 10} MW`, margin + halfW + 11, y + 20);

  y += 30;

  // Meteorological Table
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(...textDark);
  doc.text('Meteorological & Environmental Metrics (Open-Meteo API Data)', margin, y);
  y += 4;

  const metData = [
    ['Daily GHI (Solar)', `${env?.daily_ghi_kwh_m2_day || 'N/A'} kWh/m²/day`, 'Peak Sun Hours', `${env?.peak_sun_hours || 'N/A'} hrs/day`],
    ['Avg Temperature', `${env?.avg_temp_c || 'N/A'} °C`, 'Avg Wind Speed (100m)', `${env?.avg_wind_speed_100m_ms || 'N/A'} m/s`],
    ['Max Wind Speed', `${env?.max_wind_speed_100m_ms || 'N/A'} m/s`, 'Primary Data Source', env?.source || 'Open-Meteo Global API']
  ];

  doc.setFillColor(...bgLight);
  doc.roundedRect(margin, y, contentWidth, 24, 2, 2, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, y, contentWidth, 24, 2, 2, 'D');

  let tableY = y + 5;
  metData.forEach(row => {
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...textGray);
    doc.text(row[0] + ':', margin + 4, tableY);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...textDark);
    doc.text(row[1], margin + 42, tableY);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...textGray);
    doc.text(row[2] + ':', margin + 95, tableY);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...textDark);
    doc.text(row[3], margin + 140, tableY);

    tableY += 6.5;
  });

  y += 30;

  // ═════════════════════════════════════════════════════════
  // SECTION 4: SUITABILITY & EXECUTIVE SITE RECOMMENDATION
  // ═════════════════════════════════════════════════════════
  drawSectionHeader('4. SUITABILITY & SITE ASSESSMENT MESSAGE');

  let suitStatus = 'HIGHLY VIABLE SITE FOR CLEAN ENERGY DEPLOYMENT';
  let suitBg = [240, 253, 244];
  let suitBorder = [34, 197, 94];
  let suitText = [21, 128, 61];

  if (score < 50) {
    suitStatus = 'ZERO SUITABILITY / UNECONOMIC SITE';
    suitBg = [254, 242, 242];
    suitBorder = [239, 68, 68];
    suitText = [185, 28, 28];
  } else if (score < 75) {
    suitStatus = 'MODERATELY SUITABLE SITE (FURTHER STUDY RECOMMENDED)';
    suitBg = [254, 252, 232];
    suitBorder = [234, 179, 8];
    suitText = [161, 98, 7];
  }

  doc.setFillColor(...suitBg);
  doc.roundedRect(margin, y, contentWidth, 30, 3, 3, 'F');
  doc.setDrawColor(...suitBorder);
  doc.setLineWidth(0.5);
  doc.roundedRect(margin, y, contentWidth, 30, 3, 3, 'D');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...suitText);
  doc.text(`STATUS: ${suitStatus}`, margin + 6, y + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...textDark);

  let messageText = `Site "${site_name}" has been evaluated by the Swind AI spatial intelligence engine. Based on local solar irradiance (${env?.daily_ghi_kwh_m2_day || 'N/A'} kWh/m²/day), 100m hub wind speeds (${env?.avg_wind_speed_100m_ms || 'N/A'} m/s), and elevation profile (${elevVal}m), this location exhibits high suitability for commercial clean energy development with an estimated carbon offset of ${co2Val} tons of CO2 per year.`;

  if (score < 50) {
    messageText = `No Solar/Wind Energy Can Be Implemented As There Is Zero Suitability And It Is Not Economic. The site location exhibits severe spatial, environmental, or topographical constraints that make utility-scale clean energy installation non-viable.`;
  }

  const splitLines = doc.splitTextToSize(messageText, contentWidth - 12);
  doc.text(splitLines, margin + 6, y + 14);

  // FOOTER DISCLAIMER
  doc.setFontSize(7);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(...textGray);
  doc.text('Report generated by Swind GIS & AI Site Selection Platform. Confidential & Proprietary.', margin, 287);
  doc.text('Page 1 of 1', pageWidth - margin, 287, { align: 'right' });

  // Save PDF
  const filename = `${site_name.replace(/[^a-zA-Z0-9]/g, '_')}_Site_Report.pdf`;
  doc.save(filename);
}
