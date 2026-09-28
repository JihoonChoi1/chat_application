const path = require('path');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const User = require('./Models/userModel');

dotenv.config({ path: path.join(__dirname, '.env') });

const demoUsers = [
  { name: 'Guest User', email: 'guest@example.com', password: '123456' },
  { name: 'Jordan Lee', email: 'jordan@example.com', password: '123456' },
  { name: 'Sam Rivera', email: 'sam@example.com', password: '123456' },
];

const seed = async () => {
  await connectDB();

  for (const demo of demoUsers) {
    const exists = await User.findOne({ email: demo.email });
    if (exists) {
      console.log(`Already exists: ${demo.email}`);
      continue;
    }
    await User.create(demo);
    console.log(`Created ${demo.email}`);
  }

  console.log('Seed complete');
  process.exit(0);
};

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
