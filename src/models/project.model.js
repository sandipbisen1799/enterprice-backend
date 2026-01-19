// models/Project.js
import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
      projectCode: {
    type: String,
    unique: true,
    uppercase: true
  },
  startDate:{type:Date,
    required:true 
  },
 endDate: {
  type: Date,
  validate: {
    validator: function (value) {
      return !this.startDate || value >= this.startDate;
    },
    message: "End date must be after start date"
  },
},
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
   teamMember: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  
    projectManager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
      riskLevel: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'low'
  },
    progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
   visibility: {
    type: String,
    enum: ['private', 'public'],
    default: 'private'
  },
    tags: [String],
      updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
   updatedAt: {
    type: Date
  },
  
  budget: {
    type: Number,
    default: 0
  },
tasks: [{
  type: mongoose.Schema.Types.ObjectId,
  ref: "Task"
}]
,

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "assigned", "completed",'onhold'],
      default: "pending",
    },
      isArchived: {
  type: Boolean,
  default: false
}

  },
  { timestamps: true }
);

export default mongoose.model("Project", projectSchema);
