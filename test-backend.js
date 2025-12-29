// Quick test script to check if backend is running
fetch('http://localhost:5000/api/health')
  .then(res => res.json())
  .then(data => {
    console.log('✅ Backend is running!', data);
  })
  .catch(err => {
    console.error('❌ Backend is NOT running!', err.message);
    console.log('\nTo start the backend, run:');
    console.log('  cd server');
    console.log('  npm run dev');
  });




