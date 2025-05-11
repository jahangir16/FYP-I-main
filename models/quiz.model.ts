import { Schema, model, Document, Types } from "mongoose";

export interface QuizQuestion extends Document {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  marks: number;
}

export interface Quiz extends Document {
  title: string;
  description: string;
  duration: number;
  courseId: Types.ObjectId;
  questions: QuizQuestion[];
  category: string;
  level: string;
  attempts: number;
  status: string;
  dateCreated: Date;
}

const quizQuestionSchema = new Schema<QuizQuestion>({
  question: { type: String, required: true },
  options: { type: [String], required: true },
  correctAnswer: { type: Number, required: true },
  explanation: { type: String, required: true },
  marks: { type: Number, required: true },
});

const quizSchema = new Schema<Quiz>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  duration: { type: Number, required: true },
  courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true },
  questions: [quizQuestionSchema],
  category: { type: String, required: true },
  level: { type: String, required: true },
  attempts: { type: Number, default: 0 }, // Add this field
  status: { type: String, default: "active" }, // Add this field
  dateCreated: { type: Date, default: Date.now }, // Add this field
});

const QuizModel = model<Quiz>("Quiz", quizSchema);

export default QuizModel;
