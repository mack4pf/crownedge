const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb://pxxluser_mm9wf3g88c66d42:78aa4fab06cad6d9eed45ec6b869ca92524f20feb450872d987a255363636724@db.pxxl.pro:37887/';

async function listUsers() {
    try {
        await mongoose.connect(MONGODB_URI);
        const User = mongoose.models.User || mongoose.model('User', new mongoose.Schema({}, { strict: false }));
        const users = await User.find({}).limit(5);
        console.log('Users found:', users.length);
        console.log(JSON.stringify(users, null, 2));
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
    }
}

listUsers();
