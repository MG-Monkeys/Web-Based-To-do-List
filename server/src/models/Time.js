import mongoose from 'mongoose';

const timeSchema = new mongoose.Schema({
    createdAt: {
        type: Date,
        required: true,
    },
    editedAt: {
        type: Date, 
        required: false,
    },
    dueDate: {
        type: Date,
        required: true,
    },
    completedAt: {
        type: Date, 
        required: false,
    }

});

//description
      //tags
      //time
        //createdAt
        //editedAt
        //dueDate
        //completedAt
      //reoccurance
        //monthly,daily,weekly,yearly
      //isDone
      //creatorId
      //groupId

const Time = mongoose.model('Time', timeSchema);

export default Time;