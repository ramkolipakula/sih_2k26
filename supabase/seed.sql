
-- Seed data for CMPDI Intelligence Copilot

TRUNCATE TABLE public.documents, public.data_sources, public.reports, public.tasks, public.topics CASCADE;

INSERT INTO public.documents (id, title, document_type, organization, project, mine, year, file_type, page_count, status, uploaded_at, description) VALUES
(gen_random_uuid(), 'Jharia Coalfield Geological Report 2023', 'Geological Report', 'CMPDI', 'Jharia Master Plan', 'Jharia', 2023, 'PDF', 142, 'INDEXED', NOW() - INTERVAL '10 days', 'Detailed geological findings and coal seam analysis for Jharia block.'),
(gen_random_uuid(), 'Bokaro Mining Project Report 2024', 'Mining Report', 'BCCL', 'Bokaro Block', 'Bokaro', 2024, 'PDF', 98, 'INDEXED', NOW() - INTERVAL '8 days', 'Annual production statistics and mechanization updates.'),
(gen_random_uuid(), 'Odisha Exploration Block Report 2024', 'Exploration Data', 'CMPDI', 'Odisha Block 1', 'Odisha', 2024, 'PDF', 55, 'INDEXED', NOW() - INTERVAL '5 days', 'Deep seam exploration survey results.'),
(gen_random_uuid(), 'Raniganj Coalfield Geological Assessment', 'Geological Report', 'ECL', 'Raniganj Expansion', 'Raniganj', 2022, 'PDF', 210, 'INDEXED', NOW() - INTERVAL '40 days', 'Comprehensive geological evaluation of Raniganj area.'),
(gen_random_uuid(), 'Talcher Coalfield Exploration Report', 'Exploration Data', 'MCL', 'Talcher Survey', 'Talcher', 2023, 'PDF', 85, 'INDEXED', NOW() - INTERVAL '30 days', 'Exploratory drilling data and reserve estimates.'),
(gen_random_uuid(), 'Singrauli Mining Operations Report', 'Mining Report', 'NCL', 'Singrauli Open Cast', 'Singrauli', 2024, 'PDF', 115, 'INDEXED', NOW() - INTERVAL '15 days', 'Operations and equipment efficiency report.'),
(gen_random_uuid(), 'Korba Coalfield Production Report', 'Mining Report', 'SECL', 'Korba Mine', 'Korba', 2023, 'PDF', 60, 'PROCESSING', NOW() - INTERVAL '2 days', 'Quarterly production figures and quality assessment.'),
(gen_random_uuid(), 'Environmental Monitoring Report — Jharia', 'Environmental Report', 'BCCL', 'Jharia Master Plan', 'Jharia', 2023, 'PDF', 76, 'INDEXED', NOW() - INTERVAL '60 days', 'Air and water quality monitoring results.'),
(gen_random_uuid(), 'Mine Planning & Optimization Report', 'Technical Report', 'CMPDI', 'General', 'Multiple', 2024, 'PDF', 45, 'INDEXED', NOW() - INTERVAL '1 day', 'Strategic planning for open cast mines.'),
(gen_random_uuid(), 'Coal Quality Assessment — Bokaro', 'Technical Report', 'BCCL', 'Bokaro Block', 'Bokaro', 2024, 'PDF', 32, 'INDEXED', NOW() - INTERVAL '4 days', 'Ash content and calorific value analysis.'),
(gen_random_uuid(), 'Geological Survey — Odisha Block', 'Geological Report', 'MCL', 'Odisha Block 2', 'Odisha', 2023, 'PDF', 128, 'INDEXED', NOW() - INTERVAL '20 days', 'Topographical and geological mapping.'),
(gen_random_uuid(), 'Technical Feasibility Report — New Mining Project', 'Technical Report', 'WCL', 'WCL Expansion', 'Nagpur', 2024, 'PDF', 90, 'UPLOADED', NOW() - INTERVAL '1 hour', 'Feasibility study for new underground operations.');

INSERT INTO public.data_sources (name, source_type, department, status, document_count, last_synced, description) VALUES
('CMPDI Document Repository', 'Internal DB', 'Geology', 'ACTIVE', 1248, NOW() - INTERVAL '1 hour', 'Primary repository for geological exploration reports.'),
('CIL Historical Reports', 'Archive', 'Operations', 'ACTIVE', 5430, NOW() - INTERVAL '1 day', 'Digitized historical mining reports and production data.'),
('Geological Survey Repository', 'External API', 'Geology', 'ACTIVE', 892, NOW() - INTERVAL '2 hours', 'Linked survey data from national geological databases.'),
('Mining Production Database', 'Internal DB', 'Production', 'ACTIVE', 2361, NOW() - INTERVAL '15 minutes', 'Live production and dispatch statistics.'),
('Exploration Project Repository', 'Cloud Storage', 'Exploration', 'MAINTENANCE', 450, NOW() - INTERVAL '5 days', 'Raw exploration data, core logs, and geophysical surveys.'),
('Environmental Monitoring Repository', 'Internal DB', 'Environment', 'ACTIVE', 720, NOW() - INTERVAL '4 hours', 'Continuous monitoring data for active mine sites.');

INSERT INTO public.reports (title, report_type, project, period, status, created_by, summary) VALUES
('Q1 2024 Jharia Production Summary', 'Mining Production Report', 'Jharia', 'Q1 2024', 'PUBLISHED', 'Admin', '{"executive_summary": "Production exceeded targets by 5%."}'),
('Odisha Block Exploration Status', 'Exploration Summary', 'Odisha', '2023-2024', 'DRAFT', 'Geologist', '{"executive_summary": "Initial drilling shows promising seams."}'),
('Annual Environmental Audit - BCCL', 'Environmental Report', 'BCCL', '2023', 'PUBLISHED', 'Environment Officer', '{"executive_summary": "All parameters within permissible limits."}');

INSERT INTO public.tasks (title, description, task_type, priority, status, assigned_to) VALUES
('Review extracted geological data', 'Verify the extracted seam thickness values from the recent Odisha survey.', 'Data Review', 'High', 'PENDING', 'Geologist'),
('Verify production figures', 'Reconcile Q4 production data for Singrauli with dispatch records.', 'Verification', 'High', 'PENDING', 'Mining Engineer'),
('Review exploration report', 'Draft review for the Talcher Coalfield exploration findings.', 'Document Review', 'Medium', 'IN_PROGRESS', 'Geologist'),
('Validate inconsistent production data', 'Production data mismatch in Bokaro internal reports (2 sources).', 'Verification', 'High', 'PENDING', 'Admin'),
('Approve generated mining report', 'Final approval required for Q1 2024 Jharia Production Summary.', 'Approval', 'High', 'COMPLETED', 'Management'),
('Review newly uploaded document', 'Assess the technical feasibility report for WCL expansion.', 'Document Review', 'Medium', 'PENDING', 'Reporting Officer');

INSERT INTO public.topics (topic, category, document_count, importance, summary) VALUES
('Coal Production Trends', 'Operations', 450, 'High', 'Consistent increase in surface mining production.'),
('Groundwater Management', 'Environment', 120, 'High', 'Critical factor in deep mining operations in Jharia.'),
('Deep Seam Exploration', 'Geology', 85, 'Medium', 'Focus area for new capacity addition in Odisha.'),
('Mechanization & Automation', 'Technology', 210, 'High', 'Key driver for efficiency improvements in ECL.'),
('Subsidence Monitoring', 'Safety', 95, 'High', 'Ongoing concern in legacy underground mines.');
