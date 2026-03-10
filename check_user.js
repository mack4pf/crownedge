import dbConnect from './src/lib/db.js';
import User from './src/models/User.js';

async function checkUser() {
    try {
        await dbConnect();
        const user = await User.findOne({ email: 'testuser@crownedge.com' });
        if (user) {
            console.log('SUCCESS: User found in database');
            console.log('User Name:', user.name);
            console.log('User Email:', user.email);
            console.log('User Country:', user.country);
            console.log('User Currency:', user.currency);
        } else {
            console.log('FAILURE: User not found in database');
        }
    } catch (error) {
        console.error('Error checking user:', error);
    } finally {
        process.exit();
    }
}

checkUser();
