const bcrypt = require('bcryptjs');

async function test() {
    const password = 'Password@123';
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    console.log('Password:', password);
    console.log('Hash:', hash);
    
    const isMatch = await bcrypt.compare(password, hash);
    console.log('Is match:', isMatch);
    
    if (isMatch) {
        console.log('Bcrypt works correctly');
    } else {
        console.error('Bcrypt fails to match its own hash!');
    }
}

test();
