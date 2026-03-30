import mongoose from 'mongoose';

const InvitesSchema = new mongoose.Schema({
    senderId: {
        type: String,
        required: true,
    },
    recipientId: {
        type: String,
        required: true,
    },
    groupId: {
        type: String,
        required: true,
    },
});

const Invites = mongoose.model('Invites', InvitesSchema);

export default Invites;