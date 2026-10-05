export interface Project {
  id: string;
  name: string;
  subsidiary: string;
  coalfield: string;
  location: string;
  projectType: string;
  status: 'Active' | 'Pending Review' | 'Completed' | 'AI Draft' | 'Validated';
  lastUpdated: string;
  owner: string;
  targetReserves: string;
  drillingDensity: string;
  seamsIdentified: number;
  description: string;
}

export interface DocumentRecord {
  id: string;
  projectId: string;
  title: string;
  documentType: 'Geological Report' | 'Exploration Data' | 'Mine Plan' | 'Environmental Clearance' | 'Stratigraphic Correlation' | 'Reserve Estimation';
  organization: string;
  year: number;
  fileType: 'PDF' | 'XLSX' | 'DOCX';
  fileSize: string;
  pageCount: number;
  status: 'INDEXED' | 'PROCESSING' | 'UPLOADED' | 'NEEDS REVIEW' | 'FAILED';
  uploadedAt: string;
  verified: boolean;
  description: string;
  keyFindings: string[];
  majorTopics: string[];
}

export interface StratigraphicFormation {
  formation: string;
  lithology: string;
  depthRange: string;
  avgThickness: string;
  coalSeams: string;
  economicSignificance: string;
}

export interface BoreholeRecord {
  boreholeId: string;
  collarElevation: number;
  totalDepth: number;
  coalSeamIntersected: string;
  seamThickness: number;
  coreRecoveryPercent: number;
  ashContent: number;
  coalGrade: string;
  status: 'Verified' | 'Pending Core Log' | 'Anomaly Detected';
}

export interface GeologicalAnomaly {
  id: string;
  title: string;
  location: string;
  severity: 'High' | 'Moderate' | 'Low';
  detectedIn: string;
  evidence: string;
  reviewStatus: 'Pending Review' | 'Verified' | 'Resolved';
  actionRequired: string;
}

export interface HistoricalComparisonRecord {
  metric: string;
  historicalValue: string;
  historicalPeriod: string;
  currentValue: string;
  currentPeriod: string;
  observedDifference: string;
  status: 'Positive Trend' | 'Depletion' | 'Warning' | 'Improved';
  explanation: string;
  evidenceSource: string;
  evidencePage: number;
  confidence: number;
}

export interface ValidationCheck {
  id: string;
  name: string;
  category: 'Completeness' | 'Consistency' | 'Compliance' | 'Source Traceability' | 'Numerical Integrity';
  description: string;
  severity: 'Critical' | 'Warning' | 'Passed';
  status: 'Passed' | 'Action Required' | 'In Review';
  evidenceSource: string;
  actionRecommendation: string;
}

export interface AuditRecord {
  id: string;
  timestamp: string;
  user: string;
  role: string;
  action: string;
  projectId: string;
  targetObject: string;
  status: 'Approved' | 'Flagged' | 'System Automated' | 'Updated' | 'Pending';
  details?: string;
}

export type ReportStatus =
  | 'AI Draft'
  | 'Technical Review'
  | 'Validated'
  | 'Approved'
  | 'Published'
  | 'AI DRAFT'
  | 'UNDER REVIEW'
  | 'TECHNICAL REVIEW'
  | 'VALIDATED'
  | 'APPROVED'
  | 'PUBLISHED';

export interface ReportItem {
  id: string;
  title: string;
  reportType: string;
  projectId: string;
  subsidiary: string;
  period: string;
  status: ReportStatus;
  author: string;
  dateCreated: string;
  summary: {
    executiveSummary: string;
    keyFindings: string[];
    sourcesUsed: string[];
    confidenceScore: number;
  };
}

// ---------------- SINGLE SOURCE OF TRUTH DATA ----------------

export const DOMAIN_PROJECTS: Project[] = [
  {
    id: 'CMPDI-2026-014',
    name: 'Geological Investigation - Talcher Coalfield',
    subsidiary: 'MCL (Mahanadi Coalfields Limited)',
    coalfield: 'Talcher Basin',
    location: 'Angul District, Odisha',
    projectType: 'Detailed Exploration & Resource Modeling',
    status: 'Active',
    lastUpdated: '10 mins ago',
    owner: 'Dr. Sharma (Technical Officer)',
    targetReserves: '118.2 Mt',
    drillingDensity: '18 boreholes/km²',
    seamsIdentified: 8,
    description: 'Comprehensive stratigraphical assessment and coal seam thickness evaluation for Barakar formation Sector B.'
  },
  {
    id: 'CMPDI-2026-015',
    name: 'Jharia Deep Seam Exploration Block II',
    subsidiary: 'BCCL (Bharat Coking Coal Limited)',
    coalfield: 'Jharia Coalfield',
    location: 'Dhanbad District, Jharkhand',
    projectType: 'Prime Coking Coal Assessment',
    status: 'Pending Review',
    lastUpdated: '2 hours ago',
    owner: 'S. Kumar (Geologist)',
    targetReserves: '84.6 Mt',
    drillingDensity: '14 boreholes/km²',
    seamsIdentified: 6,
    description: 'Deep seam structural mapping and borehole logging for high-grade coking coal seams IX to XVI.'
  },
  {
    id: 'CMPDI-2026-016',
    name: 'Singrauli Northern Extension Environmental Baseline',
    subsidiary: 'NCL (Northern Coalfields Limited)',
    coalfield: 'Singrauli Basin',
    location: 'Singrauli, Madhya Pradesh',
    projectType: 'Environmental & Mine Plan Clearance',
    status: 'Validated',
    lastUpdated: '1 day ago',
    owner: 'A. Patel (Senior Reviewer)',
    targetReserves: '142.0 Mt',
    drillingDensity: '12 boreholes/km²',
    seamsIdentified: 5,
    description: 'Comprehensive environmental monitoring, aquifer impact assessment, and surface layout validation.'
  },
  {
    id: 'CMPDI-2026-017',
    name: 'Ib Valley Production & Stripping Analysis',
    subsidiary: 'MCL (Mahanadi Coalfields Limited)',
    coalfield: 'Ib Valley Coalfield',
    location: 'Jharsuguda, Odisha',
    projectType: 'Operational Mining Analytics',
    status: 'Active',
    lastUpdated: '3 days ago',
    owner: 'Dr. Sharma (Technical Officer)',
    targetReserves: '96.4 Mt',
    drillingDensity: '15 boreholes/km²',
    seamsIdentified: 4,
    description: 'Stripping ratio optimization, HEMM fleet telemetry review, and overburden excavation tracking.'
  },
  {
    id: 'CMPDI-2026-018',
    name: 'Raniganj CBM & Stratigraphic Correlation',
    subsidiary: 'ECL (Eastern Coalfields Limited)',
    coalfield: 'Raniganj Coalfield',
    location: 'Paschim Bardhaman, West Bengal',
    projectType: 'Coal Bed Methane & Deep Strata',
    status: 'AI Draft',
    lastUpdated: '5 days ago',
    owner: 'K. Sengupta (Geophysicist)',
    targetReserves: '62.8 Mt',
    drillingDensity: '10 boreholes/km²',
    seamsIdentified: 7,
    description: 'Gas desorption analysis, deep borehole core permeability, and fault barrier modeling.'
  }
];

export const DOMAIN_DOCUMENTS: DocumentRecord[] = [
  {
    id: 'DOC-TAL-001',
    projectId: 'CMPDI-2026-014',
    title: 'Talcher Coalfield - Geological Report (Sector B)',
    documentType: 'Geological Report',
    organization: 'CMPDI RI-VII (Bhubaneswar)',
    year: 2024,
    fileType: 'PDF',
    fileSize: '14.2 MB',
    pageCount: 142,
    status: 'INDEXED',
    uploadedAt: '2024-03-12T09:30:00Z',
    verified: true,
    description: 'Detailed geological exploration report outlining borehole data, stratigraphic correlation, and reserve estimates across Sector B of Talcher Coalfield.',
    keyFindings: [
      'Coal seam thickness in Sector B averages 4.8m, exceeding 2018 historical estimates by 14.3%.',
      'Barakar formation demonstrates strong lateral continuity with low structural disturbance.',
      'Proved recoverable coal reserves calculated at 118.2 million tonnes with 94% confidence.'
    ],
    majorTopics: ['Barakar Stratigraphy', 'Coal Seam Thickness', 'Reserve Estimation', 'Borehole Logs']
  },
  {
    id: 'DOC-TAL-002',
    projectId: 'CMPDI-2026-014',
    title: 'Exploration_Data_Q1_2024.xlsx',
    documentType: 'Exploration Data',
    organization: 'CMPDI RI-VII',
    year: 2024,
    fileType: 'XLSX',
    fileSize: '4.8 MB',
    pageCount: 18,
    status: 'INDEXED',
    uploadedAt: '2024-03-10T14:15:00Z',
    verified: true,
    description: 'Tabular borehole collar coordinates, coal seam intersection depths, lithological core logging, and proximation laboratory assay data.',
    keyFindings: [
      '18 boreholes drilled to depths between 280m and 520m.',
      'Average ash content determined at 34.1% (Grade G-11/G-12 thermal coal).',
      'Average core recovery rate across carbonaceous seams reached 92.4%.'
    ],
    majorTopics: ['Core Logging', 'Ash Analysis', 'Drilling Telemetry', 'Borehole Coordinates']
  },
  {
    id: 'DOC-JHA-003',
    projectId: 'CMPDI-2026-015',
    title: 'Jharia Block II Exploration Data & Deep Seam Log',
    documentType: 'Exploration Data',
    organization: 'BCCL (Dhanbad)',
    year: 2024,
    fileType: 'XLSX',
    fileSize: '8.1 MB',
    pageCount: 32,
    status: 'NEEDS REVIEW',
    uploadedAt: '2024-03-08T11:20:00Z',
    verified: false,
    description: 'Borehole intersection records for prime coking coal seams IX to XVI with volatile matter and crucible swelling index analysis.',
    keyFindings: [
      'Coking coal characteristics confirmed for Seam X and XI with CSN values 4 to 6.',
      'Two conflicting values detected in borehole density reporting between summary and Appendix B.'
    ],
    majorTopics: ['Prime Coking Coal', 'Crucible Swelling', 'Seam Depth', 'Conflict Flag']
  },
  {
    id: 'DOC-SIN-004',
    projectId: 'CMPDI-2026-016',
    title: 'Singrauli Environmental Clearance & Baseline Audit',
    documentType: 'Environmental Clearance',
    organization: 'NCL (Singrauli)',
    year: 2023,
    fileType: 'PDF',
    fileSize: '22.5 MB',
    pageCount: 96,
    status: 'INDEXED',
    uploadedAt: '2024-02-28T16:00:00Z',
    verified: true,
    description: 'Comprehensive environmental compliance report submitted to MoEFCC for northern extension opencast mine expansion.',
    keyFindings: [
      'Ambient PM10 and PM2.5 levels adhere strictly to MoEFCC/CPCB standards.',
      'Groundwater recharge structures established across periphery with no aquifer breach.'
    ],
    majorTopics: ['Air Quality Index', 'Aquifer Protection', 'MoEFCC Compliance', 'Green Belt']
  },
  {
    id: 'DOC-IBV-005',
    projectId: 'CMPDI-2026-017',
    title: 'Ib Valley Production Summary & Stripping Optimization',
    documentType: 'Mine Plan',
    organization: 'MCL (Jharsuguda)',
    year: 2024,
    fileType: 'DOCX',
    fileSize: '3.4 MB',
    pageCount: 54,
    status: 'INDEXED',
    uploadedAt: '2024-03-02T10:45:00Z',
    verified: true,
    description: 'Quarterly mine progress plan detailing dragline stripping performance, shovel-dumper matching ratios, and blast hole efficiency.',
    keyFindings: [
      'Stripping ratio increased from 2.1 to 2.41 due to thickening of upper sandstone overburden.',
      'Monthly coal excavation maintained at 104% of CIL MoU target.'
    ],
    majorTopics: ['Stripping Ratio', 'Dragline Performance', 'Fleet Telemetry', 'MoU Target']
  }
];

export const DOMAIN_STRATIGRAPHY: StratigraphicFormation[] = [
  {
    formation: 'Raniganj Formation',
    lithology: 'Fine-to-medium grained sandstone, grey shales, thin carbonaceous streaks',
    depthRange: '0m - 140m',
    avgThickness: '140m',
    coalSeams: 'Local thin seams (non-workable in Sector B)',
    economicSignificance: 'Overburden / Strata Support'
  },
  {
    formation: 'Barren Measures',
    lithology: 'Dark grey ironstone shales, laminated carbonaceous shales, sandstone lenses',
    depthRange: '140m - 280m',
    avgThickness: '140m',
    coalSeams: 'Devoid of mineable coal seams',
    economicSignificance: 'Impermeable geological cap'
  },
  {
    formation: 'Barakar Formation',
    lithology: 'Coarse felspathic sandstone, gritty sandstone, thick coal seams, shale bands',
    depthRange: '280m - 520m',
    avgThickness: '240m',
    coalSeams: 'Seams I, II, III, IV, V, VI, VII, VIII (Primary Resource)',
    economicSignificance: 'Primary Coal Resource (118.2 Mt)'
  },
  {
    formation: 'Karharbari Formation',
    lithology: 'Reworked gritty sandstones, conglomerate beds, thin basal seams',
    depthRange: '520m - 580m',
    avgThickness: '60m',
    coalSeams: 'Basal Seam 0 (Low volatile, High rank)',
    economicSignificance: 'Deep secondary target'
  }
];

export const DOMAIN_BOREHOLES: BoreholeRecord[] = [
  { boreholeId: 'BH-TAL-01', collarElevation: 182.4, totalDepth: 420.5, coalSeamIntersected: 'Seam II, III, IV', seamThickness: 4.9, coreRecoveryPercent: 94.2, ashContent: 33.8, coalGrade: 'G-11', status: 'Verified' },
  { boreholeId: 'BH-TAL-02', collarElevation: 185.1, totalDepth: 445.0, coalSeamIntersected: 'Seam II, III, IV, V', seamThickness: 5.1, coreRecoveryPercent: 95.8, ashContent: 32.9, coalGrade: 'G-11', status: 'Verified' },
  { boreholeId: 'BH-TAL-03', collarElevation: 179.8, totalDepth: 395.2, coalSeamIntersected: 'Seam I, II, III', seamThickness: 4.6, coreRecoveryPercent: 91.5, ashContent: 34.6, coalGrade: 'G-12', status: 'Verified' },
  { boreholeId: 'BH-TAL-04', collarElevation: 188.3, totalDepth: 512.0, coalSeamIntersected: 'Seam II, III (Fault Offset)', seamThickness: 4.2, coreRecoveryPercent: 88.0, ashContent: 36.2, coalGrade: 'G-12', status: 'Anomaly Detected' },
  { boreholeId: 'BH-TAL-05', collarElevation: 181.6, totalDepth: 460.8, coalSeamIntersected: 'Seam I, II, III, IV', seamThickness: 4.8, coreRecoveryPercent: 93.4, ashContent: 33.5, coalGrade: 'G-11', status: 'Verified' },
  { boreholeId: 'BH-TAL-06', collarElevation: 184.2, totalDepth: 480.0, coalSeamIntersected: 'Seam II, III, IV, VI', seamThickness: 5.2, coreRecoveryPercent: 96.1, ashContent: 33.1, coalGrade: 'G-11', status: 'Verified' },
  { boreholeId: 'BH-TAL-07', collarElevation: 177.5, totalDepth: 410.2, coalSeamIntersected: 'Seam II, III', seamThickness: 4.7, coreRecoveryPercent: 90.2, ashContent: 34.9, coalGrade: 'G-12', status: 'Verified' },
  { boreholeId: 'BH-TAL-08', collarElevation: 186.0, totalDepth: 525.0, coalSeamIntersected: 'Seam I to VIII (Deep)', seamThickness: 5.0, coreRecoveryPercent: 89.5, ashContent: 35.0, coalGrade: 'G-12', status: 'Pending Core Log' }
];

export const DOMAIN_ANOMALIES: GeologicalAnomaly[] = [
  {
    id: 'ANOM-01',
    title: 'Fault Line F1-F1\' Throw Variance',
    location: 'Sector B (North-West Boundary)',
    severity: 'High',
    detectedIn: 'Borehole BH-TAL-04 Core Logs & Seismic Profile',
    evidence: 'Displacement of Seam II by +12m vertical throw not recorded in 2018 master structural map.',
    reviewStatus: 'Pending Review',
    actionRequired: 'Update structural contour model and adjust opencast ultimate pit boundary.'
  },
  {
    id: 'ANOM-02',
    title: 'Parting Thinning between Seam II & Seam III',
    location: 'Central Graben Zone',
    severity: 'Moderate',
    detectedIn: 'Cross-section Section C-C\' (BH-TAL-02 to BH-TAL-06)',
    evidence: 'Inter-burden sandstone reduced from 3.2m to 0.8m over a 400m strike distance.',
    reviewStatus: 'Verified',
    actionRequired: 'Evaluate co-mining / composite seam extraction feasibility in mine plan.'
  },
  {
    id: 'ANOM-03',
    title: 'Localized Igneous Lamprophyre Sill Intrusion',
    location: 'Sector B Western Block (BH-TAL-08)',
    severity: 'Low',
    detectedIn: 'Core assay petrography report',
    evidence: 'Thermal devolatilization and natural coke (jhama) observed along 0.4m contact zone.',
    reviewStatus: 'Resolved',
    actionRequired: 'Demarcate non-beneficiated boundary in geological reserve block.'
  }
];

export const DOMAIN_HISTORICAL_COMPARISONS: HistoricalComparisonRecord[] = [
  {
    metric: 'Average Coal Seam Thickness',
    historicalValue: '4.20 m',
    historicalPeriod: '2018 Baseline Report',
    currentValue: '4.80 m',
    currentPeriod: '2024 Exploration',
    observedDifference: '+0.60 m (+14.3%)',
    status: 'Positive Trend',
    explanation: 'Observed increase in composite thickness due to intersection of previously unclassified bottom split seams in Barakar Formation Sector B.',
    evidenceSource: 'Talcher Geological Report (DOC-TAL-001)',
    evidencePage: 32,
    confidence: 94
  },
  {
    metric: 'Proved Coal Reserves (Mt)',
    historicalValue: '124.5 Mt',
    historicalPeriod: '2018 Baseline Report',
    currentValue: '118.2 Mt',
    currentPeriod: '2024 Exploration',
    observedDifference: '-6.3 Mt (-5.1%)',
    status: 'Depletion',
    explanation: 'Slight reduction reflects updated fault boundary exclusion zones following high-resolution 2D seismic survey.',
    evidenceSource: 'Resource Estimation Chapter (DOC-TAL-001)',
    evidencePage: 78,
    confidence: 96
  },
  {
    metric: 'Average Ash Content',
    historicalValue: '32.5%',
    historicalPeriod: '2018 Baseline Report',
    currentValue: '34.1%',
    currentPeriod: '2024 Exploration',
    observedDifference: '+1.6%',
    status: 'Warning',
    explanation: 'Increase in overall ash content caused by inclusion of interbedded shale bands in Seam II lower split.',
    evidenceSource: 'Exploration_Data_Q1_2024.xlsx (DOC-TAL-002)',
    evidencePage: 14,
    confidence: 91
  },
  {
    metric: 'Drilling Exploration Density',
    historicalValue: '12 boreholes/km²',
    historicalPeriod: '2018 Baseline Report',
    currentValue: '18 boreholes/km²',
    currentPeriod: '2024 Exploration',
    observedDifference: '+6 boreholes/km² (+50%)',
    status: 'Improved',
    explanation: 'Higher borehole density fulfills ISP / UNFC 111 category requirements for detailed pre-mining engineering.',
    evidenceSource: 'Drilling Summary Report (DOC-TAL-001)',
    evidencePage: 12,
    confidence: 98
  },
  {
    metric: 'Inherent Moisture Content',
    historicalValue: '6.4%',
    historicalPeriod: '2018 Baseline Report',
    currentValue: '6.2%',
    currentPeriod: '2024 Exploration',
    observedDifference: '-0.2%',
    status: 'Improved',
    explanation: 'Minor variance within standard empirical sampling tolerance limits across regional Barakar beds.',
    evidenceSource: 'Coal Proximate Analysis Lab Results',
    evidencePage: 45,
    confidence: 92
  }
];

export const DOMAIN_VALIDATION_CHECKS: ValidationCheck[] = [
  {
    id: 'VAL-001',
    name: 'Metadata & Project Boundary Completeness',
    category: 'Completeness',
    description: 'All mandatory CIL project identifier tags, leasehold survey coordinates, and subsidiary metadata are fully populated.',
    severity: 'Passed',
    status: 'Passed',
    evidenceSource: 'DOC-TAL-001 (Section 1: General Information)',
    actionRecommendation: 'No action needed. Compliance verified.'
  },
  {
    id: 'VAL-002',
    name: 'Borehole Density Consistency Verification',
    category: 'Consistency',
    description: 'Drilling density cited as 18 boreholes/km² in Section 2, but referenced as 15 boreholes/km² in Appendix Table 3.2.',
    severity: 'Warning',
    status: 'Action Required',
    evidenceSource: 'DOC-TAL-001 (Page 12 vs Page 118)',
    actionRecommendation: 'Harmonize appendix borehole counts to include 3 supplementary infill boreholes drilled in Q1 2024.'
  },
  {
    id: 'VAL-003',
    name: 'Technical Reviewer Digital Verification',
    category: 'Compliance',
    description: 'Official digital sign-off from Regional Institute Technical Reviewer is pending for Seam IV reserve calculations.',
    severity: 'Critical',
    status: 'Action Required',
    evidenceSource: 'CIL Standard Operating Procedure - Geological Sign-off 2024',
    actionRecommendation: 'Submit project file to Technical Officer (Dr. Sharma) for formal verification and sign-off.'
  },
  {
    id: 'VAL-004',
    name: 'Source Document Traceability Mapping',
    category: 'Source Traceability',
    description: 'All 14 numerical claims and historical comparison ratios map with verified lineage to ingested and verified documents.',
    severity: 'Passed',
    status: 'Passed',
    evidenceSource: 'Vector Evidence Index & Document Store',
    actionRecommendation: 'Traceability validated against CMPDI master repository.'
  },
  {
    id: 'VAL-005',
    name: 'Specific Gravity & Ash Ratio Consistency',
    category: 'Numerical Integrity',
    description: 'Calculated specific gravity of 1.48 g/cm³ mathematically correlates with 34.1% proximate ash content within 0.02 tolerance.',
    severity: 'Passed',
    status: 'Passed',
    evidenceSource: 'CMPDI Empirical Formula Guidelines (Equation 4.2)',
    actionRecommendation: 'Mathematical verification passed.'
  }
];

export const DOMAIN_MINING_METRICS = {
  monthlyProduction: [
    { month: 'Oct 2025', actual: 4120, target: 4000, variance: 120 },
    { month: 'Nov 2025', actual: 4350, target: 4200, variance: 150 },
    { month: 'Dec 2025', actual: 4800, target: 4500, variance: 300 },
    { month: 'Jan 2026', actual: 4620, target: 4600, variance: 20 },
    { month: 'Feb 2026', actual: 4910, target: 4700, variance: 210 },
    { month: 'Mar 2026', actual: 5240, target: 5000, variance: 240 }
  ],
  subsidiaryPerformance: [
    { subsidiary: 'MCL Talcher', actual: 5240, target: 5000, achievement: 104.8, strippingRatio: 2.41 },
    { subsidiary: 'BCCL Jharia', actual: 3120, target: 3300, achievement: 94.5, strippingRatio: 3.10 },
    { subsidiary: 'NCL Singrauli', actual: 6480, target: 6200, achievement: 104.5, strippingRatio: 2.15 },
    { subsidiary: 'MCL Ib Valley', actual: 4190, target: 4100, achievement: 102.2, strippingRatio: 2.35 },
    { subsidiary: 'ECL Raniganj', actual: 2850, target: 2900, achievement: 98.3, strippingRatio: 2.80 }
  ],
  kpiOverview: {
    totalExcavationYTD: '11.78M m³',
    overburdenExcavated: '8.42M m³',
    coalExtracted: '3.36M m³',
    avgStrippingRatio: '2.51',
    strippingRatioPlan: '2.30',
    fleetAvailability: '87.4%',
    fleetUtilization: '82.1%'
  }
};

export const DOMAIN_AUDIT_TRAIL: AuditRecord[] = [
  {
    id: 'AUD-901',
    timestamp: '05 Oct 2026, 11:24 AM',
    user: 'Dr. Sharma',
    role: 'Technical Officer',
    action: 'Approved Geological Technical Review',
    projectId: 'CMPDI-2026-014',
    targetObject: 'Talcher Coalfield - Sector B Geological Report',
    status: 'Approved',
    details: 'Verified Barakar Formation reserve estimates (118.2 Mt) and borehole logs.'
  },
  {
    id: 'AUD-902',
    timestamp: '05 Oct 2026, 10:48 AM',
    user: 'AI Copilot Engine',
    role: 'Automated Agent',
    action: 'Generated Historical Benchmark Comparison',
    projectId: 'CMPDI-2026-014',
    targetObject: 'DOC-TAL-001 vs 2018 Baseline',
    status: 'System Automated',
    details: 'Synthesized +14.3% seam thickness variance with 94% evidence confidence trace.'
  },
  {
    id: 'AUD-903',
    timestamp: '05 Oct 2026, 09:30 AM',
    user: 'S. Kumar',
    role: 'Geologist',
    action: 'Uploaded Exploration Dataset',
    projectId: 'CMPDI-2026-014',
    targetObject: 'Exploration_Data_Q1_2024.xlsx',
    status: 'Updated',
    details: 'Ingested 18 borehole logs with collar coordinates and ash proximate analysis.'
  },
  {
    id: 'AUD-904',
    timestamp: '04 Oct 2026, 04:15 PM',
    user: 'System (Validation Engine)',
    role: 'Automated Agent',
    action: 'Flagged Borehole Density Discrepancy',
    projectId: 'CMPDI-2026-015',
    targetObject: 'Jharia Block II Exploration Data',
    status: 'Flagged',
    details: 'Detected variance between 14/km² in executive summary and 12/km² in Appendix B.'
  },
  {
    id: 'AUD-905',
    timestamp: '04 Oct 2026, 02:00 PM',
    user: 'A. Patel',
    role: 'Senior Reviewer',
    action: 'Validated Environmental Compliance Model',
    projectId: 'CMPDI-2026-016',
    targetObject: 'Singrauli Environmental Clearance',
    status: 'Approved',
    details: 'Affirmed compliance with MoEFCC/CPCB regional environmental guidelines.'
  },
  {
    id: 'AUD-906',
    timestamp: '03 Oct 2026, 11:10 AM',
    user: 'Dr. Sharma',
    role: 'Technical Officer',
    action: 'Published Technical Quarterly Report',
    projectId: 'CMPDI-2026-017',
    targetObject: 'Ib Valley Production Summary FY 2025-26',
    status: 'Approved',
    details: 'Final authorization of stripping ratio optimization model for MCL board presentation.'
  }
];

export const DOMAIN_REPORTS: ReportItem[] = [
  {
    id: 'REP-2026-001',
    title: 'Geological Evaluation & Reserve Estimation - Talcher Coalfield',
    reportType: 'Geological Investigation Report',
    projectId: 'CMPDI-2026-014',
    subsidiary: 'MCL (Mahanadi Coalfields Limited)',
    period: 'Exploration Phase 2024-2026',
    status: 'Published',
    author: 'Dr. Sharma (Technical Officer)',
    dateCreated: '05 Oct 2026',
    summary: {
      executiveSummary: 'This comprehensive technical report synthesizes borehole core drilling (18 boreholes/km²), stratigraphic correlation, and resource modeling for Barakar Formation Sector B of Talcher Coalfield. Proved recoverable coal reserves stand at 118.2 Mt, with average seam thickness expanding to 4.80m (+14.3% over 2018 baseline). Structural fault F1-F1\' was delineated with +12m offset, requiring pit realignment. All findings are verified with 94% evidence traceability.',
      keyFindings: [
        'Average coal seam thickness evaluated at 4.80m across Seams I to VIII in Barakar Formation.',
        'Total proved geological reserves estimated at 118.2 Million Tonnes under UNFC 111 category.',
        'Average proximate ash content evaluated at 34.1% with gross calorific value classified as Grade G-11/G-12.',
        'Fault Line F1-F1\' vertical throw confirmed at 12m, providing precise technical basis for pit boundary demarcation.'
      ],
      sourcesUsed: [
        'Talcher Coalfield - Geological Report (DOC-TAL-001, 142 pp)',
        'Exploration_Data_Q1_2024.xlsx (DOC-TAL-002, 18 tables)',
        'CMPDI Historical Baseline Survey 2018 (Archive REF-2018-TAL)'
      ],
      confidenceScore: 94
    }
  },
  {
    id: 'REP-2026-002',
    title: 'Mining Production & Operational Efficiency Quarterly Assessment',
    reportType: 'Mining Production Report',
    projectId: 'CMPDI-2026-017',
    subsidiary: 'MCL (Ib Valley)',
    period: 'FY 2025-26 (Q3)',
    status: 'Published',
    author: 'S. Kumar (Geologist)',
    dateCreated: '02 Oct 2026',
    summary: {
      executiveSummary: 'Quarterly review of opencast excavation performance across Ib Valley. Total excavation reached 11.78M m³ with coal extraction at 3.36M m³ (104.8% of MoU target). Overburden stripping ratio increased slightly to 2.41:1 due to upper sandstone thickening. Fleet telemetry indicates 87.4% shovel availability.',
      keyFindings: [
        'Coal extraction exceeded planned quarterly target by 4.8%.',
        'Stripping ratio increased from 2.1 to 2.41:1, managed via dragline deployment optimization.',
        'Heavy equipment availability maintained above CIL 85% benchmark.'
      ],
      sourcesUsed: ['Ib Valley Production Summary (DOC-IBV-005)'],
      confidenceScore: 92
    }
  },
  {
    id: 'REP-2026-003',
    title: 'Deep Seam Coking Coal Exploration Review - Jharia Block II',
    reportType: 'Resource Evaluation Report',
    projectId: 'CMPDI-2026-015',
    subsidiary: 'BCCL (Bharat Coking Coal Limited)',
    period: 'Exploration Phase 2024',
    status: 'Technical Review',
    author: 'Dr. Sharma (Technical Officer)',
    dateCreated: '01 Oct 2026',
    summary: {
      executiveSummary: 'Detailed borehole intersection analysis for high-rank prime coking coal seams IX to XVI in Jharia. Preliminary crucible swelling indices range from 4 to 6. Awaiting resolution of borehole count discrepancy before final sign-off.',
      keyFindings: [
        'High-value metallurgical coking coal confirmed at depths beyond 380m.',
        'Pending resolution of borehole density notation variance (14 vs 12/km²).'
      ],
      sourcesUsed: ['Jharia Block II Exploration Data (DOC-JHA-003)'],
      confidenceScore: 88
    }
  }
];

export const DEMO_COPILOT_SUGGESTIONS = [
  'Compare current project findings with historical reports',
  'Summarize Talcher Coalfield Barakar stratigraphy',
  'Identify inconsistencies and validation flags',
  'Show supporting evidence trace for seam thickness',
  'Generate outline for official CMPDI Technical Report'
];
