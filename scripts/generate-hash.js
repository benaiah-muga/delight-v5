const bcrypt = require('bcrypt');

async function generateHash() {
  const password = 'queen256';
  const saltRounds = 10;
  const hash = await bcrypt.hash(password, saltRounds);
  console.log('Hashed password:', hash);
  
  // Also log the environment variables to add to Vercel
  console.log('\nAdd these to your Vercel environment variables:');
  console.log('ADMIN_EMAIL=elizabethmirembe556@gmail.com');
  console.log(`ADMIN_PASSWORD_HASH=${hash}`);
}

generateHash().catch(console.error);
