# Database Setup Instructions

This guide will help you populate your Firebase database with sample data for the Mangrove Surveillance system.

## Prerequisites

1. **Firebase Project Setup**: Make sure you have a Firebase project created and configured
2. **Service Account Key**: Download your Firebase service account key JSON file
3. **Environment Setup**: Ensure your Firebase configuration is properly set up

## Setup Steps

### 1. Configure Firebase Service Account

1. Go to your Firebase Console
2. Navigate to Project Settings > Service Accounts
3. Click "Generate new private key"
4. Download the JSON file
5. Rename it to `firebase-service-account.json`
6. Place it in the `Backend/src/config/` directory

### 2. Install Dependencies

```bash
cd Backend
npm install
```

### 3. Populate Database

Run the database population script:

```bash
npm run populate-db
```

This will populate your Firebase database with:

- **12 Users**: Various types (NGO, Community, Individual, Government)
- **8 Incidents**: Different types and statuses
- **5 Leaderboard Entries**: Top contributors with points and tiers
- **1 Settings Document**: Default system configuration

## Sample Data Overview

### Users (12 total)
- Marine Bio NGO (NGO)
- Ahmad Rahman (Community)
- EcoGuardians (NGO)
- Dr. Sarah Chen (Individual)
- Coastal Watch (Government)
- Mangrove Conservation Society (NGO)
- Prof. Michael Torres (Individual)
- Blue Ocean Foundation (NGO)
- Local Fishermen Association (Community)
- Environmental Protection Agency (Government)
- Dr. Lisa Wang (Individual)
- Green Earth Initiative (NGO)

### Incidents (8 total)
- Illegal Logging (2 incidents)
- Unauthorized Fishing (1 incident)
- Pollution Discharge (1 incident)
- Wildlife Poaching (1 incident)
- Land Reclamation (1 incident)
- Oil Spill (1 incident)
- Water Pollution (1 incident)

### Leaderboard (5 entries)
- Environmental Protection Agency (4,250 points - Diamond)
- EcoGuardians (3,780 points - Platinum)
- Mangrove Conservation Society (2,890 points - Gold)
- Marine Bio NGO (2,340 points - Gold)
- Blue Ocean Foundation (2,150 points - Silver)

## Verification

After running the population script, you can verify the data in your Firebase Console:

1. Go to Firebase Console > Firestore Database
2. Check the following collections:
   - `users` (12 documents)
   - `incidents` (8 documents)
   - `leaderboard` (5 documents)
   - `settings` (1 document)

## Troubleshooting

### Common Issues

1. **Service Account Key Not Found**
   - Ensure `firebase-service-account.json` is in `Backend/src/config/`
   - Check file permissions

2. **Firebase Permission Errors**
   - Verify your service account has Firestore read/write permissions
   - Check Firestore security rules

3. **Connection Issues**
   - Verify your Firebase project ID is correct
   - Check your internet connection

### Reset Database

To clear and repopulate the database:

```bash
# Clear existing data (optional - be careful!)
# You can manually delete collections in Firebase Console

# Repopulate
npm run populate-db
```

## Data Structure

### User Document Structure
```json
{
  "id": "USR-001",
  "name": "Marine Bio NGO",
  "email": "contact@marinebio.org",
  "type": "NGO",
  "location": "Jakarta, Indonesia",
  "joinDate": "2023-03-15",
  "totalReports": 45,
  "resolvedReports": 38,
  "points": 2340,
  "status": "active",
  "createdAt": "2023-03-15T00:00:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

### Incident Document Structure
```json
{
  "id": "INC-2024-001",
  "type": "Illegal Logging",
  "location": "Mangrove Sector A-7",
  "reporter": "Marine Bio NGO",
  "date": "2024-01-15",
  "time": "14:30",
  "status": "new",
  "severity": "high",
  "description": "Large-scale tree cutting observed in protected zone",
  "userId": "USR-001",
  "createdAt": "2024-01-15T14:30:00.000Z",
  "updatedAt": "2024-01-15T14:30:00.000Z"
}
```

## Next Steps

After populating the database:

1. Start your backend server: `npm run dev`
2. Start your frontend application
3. Navigate to the admin dashboard
4. Verify that all data is displaying correctly
5. Test the functionality of all features

## Support

If you encounter any issues:

1. Check the console output for error messages
2. Verify your Firebase configuration
3. Ensure all dependencies are installed
4. Check Firestore security rules

The system is now ready for use with comprehensive sample data!



