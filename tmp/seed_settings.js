const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://cryptconaexchange_db_user:1ST8uk8yDx5fAMYE@crownedgebroker.njbsqm9.mongodb.net/?appName=Crownedgebroker';

async function seedSettings() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to the database.');

        const SettingSchema = new mongoose.Schema({
            key: { type: String, required: true, unique: true },
            value: { type: mongoose.Schema.Types.Mixed, required: true },
            description: { type: String }
        }, { timestamps: true });

        const Setting = mongoose.models.Setting || mongoose.model('Setting', SettingSchema);

        const DEFAULTS = [
            { key: 'whatsapp_number', value: '+1234567890', description: 'WhatsApp contact number' },
            { key: 'payment_btc', value: '1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2', description: 'Bitcoin Address' },
            { key: 'payment_eth', value: '0x32Be343B94f860124dC4fEe278FDCBD38C102D88', description: 'Ethereum Address' },
            { key: 'payment_usdt', value: 'T9yD14Nj9j7xAB4dbGeiX9h8unkKzPGEW2', description: 'USDT TRC20 Address' },
            { key: 'payment_bank', value: 'Bank Name: Chase\nAcct: 123456789', description: 'Bank Details' },
            { key: 'payment_pix', value: 'pix@crownedgebroker.pro', description: 'Pix Key' },
        ];

        for (const def of DEFAULTS) {
            await Setting.findOneAndUpdate({ key: def.key }, { $setOnInsert: def }, { upsert: true });
        }

        console.log('Settings seeded successfully.');
        
    } catch (error) {
        console.error('Error seeding settings:', error);
    } finally {
        await mongoose.disconnect();
    }
}

seedSettings();
