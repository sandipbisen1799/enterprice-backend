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
  startDate:Date,
  endDate :Date,
  
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


    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "assigned", "completed"],
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
