import mongoose from 'mongoose';

const GroupSchema = new mongoose.Schema({
    groupName: {
        type: String,
        required: true,
    },
    ownerId: {
        type: String,
        required: true,
    },
});

const Groups = mongoose.model('Groups', GroupSchema);

export default Groups;