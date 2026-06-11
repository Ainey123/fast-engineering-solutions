// Service definitions for Fast Engineering Solutions

export const services = [
  {
    id: 'construction',
    title: 'Construction & Renovation',
    shortDesc: 'Design-build solutions, layout maps, structural upgrades, and full contracting.',
    longDesc: 'From blueprint design to full structural execution, our civil and structural engineering teams build premium residential, commercial, and industrial spaces with complete regulatory approvals.',
    icon: 'wrench',
    color: 'var(--color-primary)',
    badgeColor: 'badge-blue',
    steps: [
      { num: 1, name: 'Structural Planning & Design', desc: 'Detailed architectural blueprints and layout design approval.' },
      { num: 2, name: 'Site Inspection & Soil Testing', desc: 'Rigorous engineering evaluation of the ground and surroundings.' },
      { num: 3, name: 'Digital Quote & Timeline', desc: 'Itemized material estimates, structural quotes, and milestones.' },
      { num: 4, name: 'Execution & Quality Sign-Off', desc: 'Civil construction managed by senior engineers with 100% safety standards.' }
    ]
  },
  {
    id: 'maintenance',
    title: 'Technical Maintenance',
    shortDesc: 'Preventative audits, HVAC, plumbing, structural repairs, and paint jobs.',
    longDesc: 'Ensure your building assets remain in peak condition. We provide detailed structural audit checks, central air-conditioning repair, high-grade waterproofing, and professional plumbing.',
    icon: 'settings',
    color: 'var(--color-secondary)',
    badgeColor: 'badge-amber',
    steps: [
      { num: 1, name: 'Maintenance Logged', desc: 'Submit your structural, plumbing, or electrical issue via the app.' },
      { num: 2, name: 'Engineer Inspection', desc: 'Certified technician inspects the premises with thermal imaging tools.' },
      { num: 3, name: 'Service Costing Approval', desc: 'Get transparent breakdown pricing directly on your dashboard.' },
      { num: 4, name: 'Repair & System Check', desc: 'Rapid resolution of issue followed by post-repair load testing.' }
    ]
  },
  {
    id: 'facility',
    title: 'Facility & Power Management',
    shortDesc: 'Solar plant setup, diesel generator maintenance, and grid load audits.',
    longDesc: 'Power assurance and energy conservation. We design, install, and support solar PV arrays, backup industrial power generators, and perform complete energy consumption audits to save you money.',
    icon: 'activity',
    color: 'var(--color-info)',
    badgeColor: 'badge-blue',
    steps: [
      { num: 1, name: 'Energy Consumption Audit', desc: 'Analysis of billing and electrical distribution boards.' },
      { num: 2, name: 'Solar / Power Design', desc: 'Custom specification drawings for solar inverters or generator setup.' },
      { num: 3, name: 'Quote & Financial Yield Model', desc: 'Project cost along with calculated ROI and payback timelines.' },
      { num: 4, name: 'Grid Integration & Testing', desc: 'Professional hook-up, net-metering setup, and commissioning.' }
    ]
  },
  {
    id: 'emergency',
    title: 'Emergency SOS Repair',
    shortDesc: 'Critical breakdowns, gas leakage, electrical fires, and water leak patching.',
    longDesc: 'Immediate dispatch for critical engineering hazards. If you have an electrical short-circuit, catastrophic structural breakdown, or immediate pipe bursts, trigger our emergency dispatch.',
    icon: 'alert-triangle',
    color: 'var(--color-danger)',
    badgeColor: 'badge-red',
    isEmergency: true,
    steps: [
      { num: 1, name: 'SOS Signal Transmitted', desc: 'Live GPS dispatch request logged immediately by operations desk.' },
      { num: 2, name: 'Rapid Response Confirmation', desc: 'Assigned emergency response team dials client in under 2 minutes.' },
      { num: 3, name: 'On-Site Hazard Mitigation', desc: 'Engineers arrive to isolate electrical, structural, or fluid hazards.' },
      { num: 4, name: 'Emergency Repair Execution', desc: 'Immediate work to stabilize systems with detailed report logs.' }
    ]
  }
];

export function getServiceById(id) {
  return services.find(s => s.id === id);
}
