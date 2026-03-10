import mongoose from 'mongoose';

const DepositSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amountLocal: { type: Number, required: true }, // Based on user currency e.g 500
    currency: { type: String, required: true },
    method: { type: String, required: true }, // 'BTC', 'ETH', 'USDT', 'BANK', 'PIX'
    receiptUrl: { type: String, default: null }, // from upload
    status: { type: String, enum: ['PENDING', 'APPROVED', 'REJECTED'], default: 'PENDING' }
}, { timestamps: true });

export default mongoose.models.Deposit || mongoose.model('Deposit', DepositSchema);
