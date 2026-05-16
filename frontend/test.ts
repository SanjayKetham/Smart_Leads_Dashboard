import axios from 'axios';

const testLead = async () => {
    try {
        // 1. Login to get token
        const loginRes = await axios.post('http://localhost:5555/api/auth/login', {
            email: 'sales@smartleads.com',
            password: 'salespassword123'
        });
        const token = loginRes.data.token;
        console.log('Logged in, token:', token.slice(0, 10) + '...');

        // 2. Add lead
        const leadRes = await axios.post('http://localhost:5555/api/leads', {
            name: 'Test Lead via Script',
            email: 'script@test.com',
            status: 'New',
            source: 'Website'
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Lead added:', leadRes.data);

        // 3. Fetch leads
        const fetchRes = await axios.get('http://localhost:5555/api/leads', {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Fetched leads count:', fetchRes.data.leads.length);
        
        const found = fetchRes.data.leads.find((l: any) => l.email === 'script@test.com');
        console.log('Was the new lead in the fetch list?', !!found);
    } catch (e: any) {
        console.error('Error:', e.response?.data || e.message);
    }
};

testLead();
