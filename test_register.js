async function testRegister() {
    try {
        const response = await fetch('http://localhost:5000/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                firstname: 'Test',
                lastname: 'User',
                email: 'test' + Date.now() + '@example.com',
                password: 'Password123!'
            })
        });
        const data = await response.json();
        console.log('Status:', response.status);
        console.log('Data:', data);
    } catch (error) {
        console.error('Fetch error:', error.message);
    }
}

testRegister();
