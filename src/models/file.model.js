const fileSchema = new mongoose.Schema({
  fileName: String,
  fileUrl: String,

  taskId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task'
  },

  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  uploadedAt: {
    type: Date,
    default: Date.now
  }
});
