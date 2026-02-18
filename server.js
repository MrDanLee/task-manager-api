require('dotenv').config();
const app = require('./src/app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log('===========================================');
  console.log('  TASK MANAGER API - By Daniel Lozano');
  console.log('===========================================');
  console.log(`  Server running at: http://localhost:${PORT}`);
  console.log('');
  console.log('  Available endpoints:');
  console.log('    POST /api/auth/register');
  console.log('    POST /api/auth/login');
  console.log('    GET  /api/tasks');
  console.log('    POST /api/tasks');
  console.log('    PUT  /api/tasks/:id');
  console.log('    DELETE /api/tasks/:id');
  console.log('===========================================');
});