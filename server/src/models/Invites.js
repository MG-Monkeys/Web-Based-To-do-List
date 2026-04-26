import mongoose from 'mongoose';

const InvitesSchema = new mongoose.Schema({
    senderName: {
        type: String,
        required: true,
    },
    senderId: {
        type: String,
        required: true,
    },
    recipientId: {
        type: String,
        required: true,
    },
    groupName: {
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