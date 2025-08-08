const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');

async function createAdminUser() {
  const email = 'elizabethmirembe556@gmail.com';
  const password = 'queen256';
  const name = 'Elizabeth Mirembe';
  const role = 'admin';

  // Hash the password
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  // Create user object
  const newUser = {
    email,
    password: hashedPassword,
    name,
    role
  };

  // Path to users.json
  const usersPath = path.join(process.cwd(), 'data', 'users.json');
  
  // Read existing users
  let users = [];
  try {
    users = JSON.parse(fs.readFileSync(usersPath, 'utf-8') || '[]');
    
    // Remove any existing user with this email
    users = users.filter(user => user.email !== email);
  } catch (error) {
    console.log('Creating new users file...');
  }

  // Add new user
  users.push(newUser);

  // Save back to file
  fs.writeFileSync(usersPath, JSON.stringify(users, null, 2));
  
  console.log('Admin user created successfully!');
  console.log('Email:', email);
  console.log('Password:', password);
}

// Run the function
createAdminUser().catch(console.error);
