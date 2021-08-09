const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var answerSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    rollno: {
      type: String,
      required: false,
    },
    emailid: {
      type: String,
      required: false,
    },
    rating: {
      type: Number,
      default: 0,
      required: false,
    },
    answer: {
      type: String,
      required: false,
    },
    picture: {
      type: String,
      required: false,
    },
    date: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const quesSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    rollno: {
      type: String,
      required: false,
    },
    emailid: {
      type: String,
      required: false,
    },
    question_title: {
      type: String,
      required: true,
    },
    question: {
      type: String,
      required: true,
    },
    picture: {
      type: String,
      required: false,
    },
    date: {
      type: String,
      required: false,
    },
    keywordarray: {
      type: Array,
      required: true,
    },
    answer: [answerSchema],
  },
  {
    timestamps: true,
  }
);

var Ques = mongoose.model("Questions", quesSchema);

module.exports = Ques;
