const admin = require('firebase-admin');
const path = require('path');

// Initialize Firebase Admin
const serviceAccount = require('../config/firebase-service-account.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Sample data for users
const sampleUsers = [
  {
    id: 'USR-001',
    name: 'Marine Bio NGO',
    email: 'contact@marinebio.org',
    type: 'NGO',
    location: 'Jakarta, Indonesia',
    joinDate: '2023-03-15',
    totalReports: 45,
    resolvedReports: 38,
    points: 2340,
    status: 'active',
    createdAt: new Date('2023-03-15').toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'USR-002',
    name: 'Ahmad Rahman',
    email: 'ahmad.r@email.com',
    type: 'Community',
    location: 'Surabaya, Indonesia',
    joinDate: '2023-06-20',
    totalReports: 28,
    resolvedReports: 22,
    points: 1560,
    status: 'active',
    createdAt: new Date('2023-06-20').toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'USR-003',
    name: 'EcoGuardians',
    email: 'team@ecoguardians.org',
    type: 'NGO',
    location: 'Bangkok, Thailand',
    joinDate: '2023-01-10',
    totalReports: 67,
    resolvedReports: 59,
    points: 3780,
    status: 'active',
    createdAt: new Date('2023-01-10').toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'USR-004',
    name: 'Dr. Sarah Chen',
    email: 'sarah.chen@university.edu',
    type: 'Individual',
    location: 'Singapore',
    joinDate: '2023-08-05',
    totalReports: 23,
    resolvedReports: 20,
    points: 1290,
    status: 'active',
    createdAt: new Date('2023-08-05').toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'USR-005',
    name: 'Coastal Watch',
    email: 'info@coastalwatch.org',
    type: 'Government',
    location: 'Manila, Philippines',
    joinDate: '2023-02-28',
    totalReports: 34,
    resolvedReports: 31,
    points: 1980,
    status: 'inactive',
    createdAt: new Date('2023-02-28').toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'USR-006',
    name: 'Mangrove Conservation Society',
    email: 'info@mangroveconservation.org',
    type: 'NGO',
    location: 'Kuala Lumpur, Malaysia',
    joinDate: '2023-04-12',
    totalReports: 52,
    resolvedReports: 45,
    points: 2890,
    status: 'active',
    createdAt: new Date('2023-04-12').toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'USR-007',
    name: 'Prof. Michael Torres',
    email: 'm.torres@research.edu',
    type: 'Individual',
    location: 'Quezon City, Philippines',
    joinDate: '2023-07-18',
    totalReports: 19,
    resolvedReports: 16,
    points: 1120,
    status: 'active',
    createdAt: new Date('2023-07-18').toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'USR-008',
    name: 'Blue Ocean Foundation',
    email: 'contact@blueocean.org',
    type: 'NGO',
    location: 'Ho Chi Minh City, Vietnam',
    joinDate: '2023-05-03',
    totalReports: 41,
    resolvedReports: 35,
    points: 2150,
    status: 'active',
    createdAt: new Date('2023-05-03').toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'USR-009',
    name: 'Local Fishermen Association',
    email: 'fishermen@local.org',
    type: 'Community',
    location: 'Bali, Indonesia',
    joinDate: '2023-09-22',
    totalReports: 33,
    resolvedReports: 28,
    points: 1780,
    status: 'active',
    createdAt: new Date('2023-09-22').toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'USR-010',
    name: 'Environmental Protection Agency',
    email: 'epa@government.gov',
    type: 'Government',
    location: 'Bangkok, Thailand',
    joinDate: '2023-01-15',
    totalReports: 78,
    resolvedReports: 72,
    points: 4250,
    status: 'active',
    createdAt: new Date('2023-01-15').toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'USR-011',
    name: 'Dr. Lisa Wang',
    email: 'lisa.wang@marine.edu',
    type: 'Individual',
    location: 'Taipei, Taiwan',
    joinDate: '2023-08-30',
    totalReports: 26,
    resolvedReports: 23,
    points: 1450,
    status: 'active',
    createdAt: new Date('2023-08-30').toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'USR-012',
    name: 'Green Earth Initiative',
    email: 'info@greenearth.org',
    type: 'NGO',
    location: 'Yangon, Myanmar',
    joinDate: '2023-06-08',
    totalReports: 37,
    resolvedReports: 32,
    points: 1920,
    status: 'active',
    createdAt: new Date('2023-06-08').toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Sample data for incidents
const sampleIncidents = [
  {
    id: 'INC-2024-001',
    type: 'Illegal Logging',
    location: 'Mangrove Sector A-7',
    reporter: 'Marine Bio NGO',
    date: '2024-01-15',
    time: '14:30',
    status: 'new',
    severity: 'high',
    description: 'Large-scale tree cutting observed in protected zone',
    userId: 'USR-001',
    createdAt: new Date('2024-01-15T14:30:00').toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'INC-2024-002',
    type: 'Unauthorized Fishing',
    location: 'Coastal Zone B-12',
    reporter: 'Local Fisherman',
    date: '2024-01-14',
    time: '08:15',
    status: 'investigating',
    severity: 'medium',
    description: 'Commercial fishing nets found in restricted breeding area',
    userId: 'USR-009',
    createdAt: new Date('2024-01-14T08:15:00').toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'INC-2024-003',
    type: 'Pollution Discharge',
    location: 'River Delta C-3',
    reporter: 'EcoGuardians',
    date: '2024-01-13',
    time: '16:45',
    status: 'resolved',
    severity: 'critical',
    description: 'Industrial waste discharge affecting water quality',
    userId: 'USR-003',
    createdAt: new Date('2024-01-13T16:45:00').toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'INC-2024-004',
    type: 'Wildlife Poaching',
    location: 'Protected Area D-9',
    reporter: 'Coastal Watch',
    date: '2024-01-12',
    time: '22:20',
    status: 'investigating',
    severity: 'high',
    description: 'Evidence of bird trapping and habitat destruction',
    userId: 'USR-005',
    createdAt: new Date('2024-01-12T22:20:00').toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'INC-2024-005',
    type: 'Land Reclamation',
    location: 'Mangrove Sector E-4',
    reporter: 'Community Leader',
    date: '2024-01-11',
    time: '10:30',
    status: 'dismissed',
    severity: 'low',
    description: 'Small-scale unauthorized landfill in mangrove area',
    userId: 'USR-002',
    createdAt: new Date('2024-01-11T10:30:00').toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'INC-2024-006',
    type: 'Oil Spill',
    location: 'Coastal Zone F-8',
    reporter: 'Blue Ocean Foundation',
    date: '2024-01-10',
    time: '09:45',
    status: 'new',
    severity: 'critical',
    description: 'Oil slick observed near mangrove roots',
    userId: 'USR-008',
    createdAt: new Date('2024-01-10T09:45:00').toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'INC-2024-007',
    type: 'Illegal Logging',
    location: 'Mangrove Sector G-2',
    reporter: 'Mangrove Conservation Society',
    date: '2024-01-09',
    time: '13:20',
    status: 'resolved',
    severity: 'medium',
    description: 'Unauthorized tree cutting in conservation area',
    userId: 'USR-006',
    createdAt: new Date('2024-01-09T13:20:00').toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'INC-2024-008',
    type: 'Water Pollution',
    location: 'River Delta H-5',
    reporter: 'Dr. Sarah Chen',
    date: '2024-01-08',
    time: '11:15',
    status: 'investigating',
    severity: 'high',
    description: 'Chemical discharge affecting mangrove ecosystem',
    userId: 'USR-004',
    createdAt: new Date('2024-01-08T11:15:00').toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Sample data for leaderboard
const sampleLeaderboard = [
  {
    userId: 'USR-010',
    name: 'Environmental Protection Agency',
    type: 'Government',
    points: 4250,
    reportsThisMonth: 12,
    streak: 15,
    tier: 'Diamond',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    userId: 'USR-003',
    name: 'EcoGuardians',
    type: 'NGO',
    points: 3780,
    reportsThisMonth: 9,
    streak: 22,
    tier: 'Platinum',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    userId: 'USR-006',
    name: 'Mangrove Conservation Society',
    type: 'NGO',
    points: 2890,
    reportsThisMonth: 8,
    streak: 8,
    tier: 'Gold',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    userId: 'USR-001',
    name: 'Marine Bio NGO',
    type: 'NGO',
    points: 2340,
    reportsThisMonth: 6,
    streak: 12,
    tier: 'Gold',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'USR-008',
    name: 'Blue Ocean Foundation',
    type: 'NGO',
    points: 2150,
    reportsThisMonth: 5,
    streak: 6,
    tier: 'Silver',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Function to populate users collection
async function populateUsers() {
  console.log('Populating users collection...');
  const batch = db.batch();
  
  for (const user of sampleUsers) {
    const userRef = db.collection('users').doc(user.id);
    batch.set(userRef, user);
  }
  
  await batch.commit();
  console.log(`✅ Added ${sampleUsers.length} users to the database`);
}

// Function to populate incidents collection
async function populateIncidents() {
  console.log('Populating incidents collection...');
  const batch = db.batch();
  
  for (const incident of sampleIncidents) {
    const incidentRef = db.collection('incidents').doc(incident.id);
    batch.set(incidentRef, incident);
  }
  
  await batch.commit();
  console.log(`✅ Added ${sampleIncidents.length} incidents to the database`);
}

// Function to populate leaderboard collection
async function populateLeaderboard() {
  console.log('Populating leaderboard collection...');
  const batch = db.batch();
  
  for (const entry of sampleLeaderboard) {
    const leaderboardRef = db.collection('leaderboard').doc(entry.userId);
    batch.set(leaderboardRef, entry);
  }
  
  await batch.commit();
  console.log(`✅ Added ${sampleLeaderboard.length} leaderboard entries to the database`);
}

// Function to populate settings
async function populateSettings() {
  console.log('Populating settings collection...');
  const settingsRef = db.collection('settings').doc('default');
  
  const defaultSettings = {
    notifications: {
      emailAlerts: true,
      pushNotifications: true,
      reportThreshold: 10
    },
    moderation: {
      autoApprove: false,
      requireManualReview: true
    },
    gamification: {
      pointsPerReport: 10,
      bonusMultiplier: 1.5
    },
    system: {
      maintenanceMode: false,
      maxFileSize: 10485760, // 10MB
      allowedFileTypes: ['jpg', 'jpeg', 'png', 'pdf']
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  await settingsRef.set(defaultSettings);
  console.log('✅ Added default settings to the database');
}

// Main function to populate all collections
async function populateDatabase() {
  try {
    console.log('🚀 Starting database population...');
    
    await populateUsers();
    await populateIncidents();
    await populateLeaderboard();
    await populateSettings();
    
    console.log('🎉 Database population completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`- Users: ${sampleUsers.length}`);
    console.log(`- Incidents: ${sampleIncidents.length}`);
    console.log(`- Leaderboard entries: ${sampleLeaderboard.length}`);
    console.log('- Settings: 1 default configuration');
    
  } catch (error) {
    console.error('❌ Error populating database:', error);
  } finally {
    process.exit(0);
  }
}

// Run the population script
if (require.main === module) {
  populateDatabase();
}

module.exports = {
  populateDatabase,
  populateUsers,
  populateIncidents,
  populateLeaderboard,
  populateSettings
};





