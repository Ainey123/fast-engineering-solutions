// Mock project bookings data generator

export function getInitialBookings() {
  return [
    {
      id: 'FES-9842',
      serviceId: 'construction',
      serviceName: 'Construction & Renovation',
      clientName: 'M. Rafay Malik',
      phone: '+92 321 8484123',
      date: '2026-06-15',
      time: '10:00 AM',
      location: 'DHA Phase 6, Lahore',
      status: 'In Progress', // Approved -> Dispatched -> In Progress -> Completed
      statusIndex: 2, // Matches index in [Approved, Dispatched, In Progress, Completed]
      engineer: {
        name: 'Engr. Ahmed Khan',
        role: 'Senior Structural Engineer',
        phone: '+923004545280',
        avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80'
      },
      gpsAddress: 'DHA Phase 6, Lahore, Pakistan',
      createdDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() // 2 days ago
    },
    {
      id: 'FES-7123',
      serviceId: 'maintenance',
      serviceName: 'Technical Maintenance',
      clientName: 'Zainab Bibi',
      phone: '+92 312 9901452',
      date: '2026-06-18',
      time: '02:30 PM',
      location: 'Model Town, Lahore',
      status: 'Approved',
      statusIndex: 0,
      engineer: {
        name: 'Engr. Bilal Shah',
        role: 'HVAC Operations Lead',
        phone: '+923004545280',
        avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&auto=format&fit=crop&q=80'
      },
      gpsAddress: 'Model Town Block C, Lahore',
      createdDate: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString() // 4 hours ago
    }
  ];
}
