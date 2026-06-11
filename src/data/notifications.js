// Mock notification data generator

export function getInitialNotifications() {
  const now = new Date();
  
  return [
    {
      id: 'n1',
      title: 'Quote Approved',
      message: 'Your electrical panel upgrade budget details have been approved by the planning board.',
      timestamp: new Date(now.getTime() - 2 * 60 * 1000).toISOString(), // 2 mins ago
      type: 'success',
      read: false
    },
    {
      id: 'n2',
      title: 'Weather Warning: Lahore Rain',
      message: 'Heavy rains are expected in Lahore this week. Protect structures by booking professional waterproofing now.',
      timestamp: new Date(now.getTime() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
      type: 'warning',
      read: false
    },
    {
      id: 'n3',
      title: 'Site Inspector Assigned',
      message: 'Engr. Ahmed Khan has been dispatched to perform soil quality audits on your booking reference #FES-2194.',
      timestamp: new Date(now.getTime() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
      type: 'info',
      read: true
    },
    {
      id: 'n4',
      title: 'Security Alert: Login Detected',
      message: 'A new web login session was initialized from browser Chrome on Windows 11.',
      timestamp: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      type: 'info',
      read: true
    }
  ];
}
