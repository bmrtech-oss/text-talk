const mongoose = require('mongoose');
require('dotenv').config();

const migrate = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB for migration');

    // Run migrations in order
    console.log('Running migration 001...');
    // Add migration logic here
    
    console.log('Running migration 002...');
    // Add migration logic here

    console.log('Migrations completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

migrate();
