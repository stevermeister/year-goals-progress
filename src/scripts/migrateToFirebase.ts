import { goals, statusNumber } from '../data/goals';
import { migrateInitialData } from '../services/goalService';

const runMigration = async () => {
  try {
    console.log('Starting data migration to Firebase...');
    await migrateInitialData(goals, statusNumber);
    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
  }
};

runMigration();
