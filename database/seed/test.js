import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../server/.env') });

const MONGO = process.env.MONGO_URI;
console.log('Connecting to:', MONGO);

try {
  await mongoose.connect(MONGO, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 10000,
  });
  console.log('✅ Connected:', mongoose.connection.name);
  await mongoose.connection.db.admin().ping();
  console.log('✅ Ping successful');
  process.exit(0);
} catch (err) {
  console.error('❌ Connection test failed:', err);
  process.exit(1);
}
