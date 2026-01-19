const commentSchema = new mongoose.Schema({
  taskId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
    required: true
  },

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  comment: {
    type: String,
    required: true
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});