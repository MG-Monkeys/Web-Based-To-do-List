import mongoose from 'mongoose';

const tagSchema = new mongoose.Schema({
    _id: {
        type: Number,
        required: true,
    },
    tagName: {
        type: String,
        required: true,
    }
});

const Tag = mongoose.model('Tag', tagSchema);

export default Tag;