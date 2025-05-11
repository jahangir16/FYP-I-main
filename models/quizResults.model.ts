import { Schema, model, Document, Types } from "mongoose";

export interface QuizResult extends Document {
  studentId: Types.ObjectId;
  quizId: Types.ObjectId;
  courseId: Types.ObjectId;
  marksObtained: number;
  totalMarks: number;
  attemptedOn: Date;
  questionResults: {
    questionId: Types.ObjectId;
    marksObtained: number;
  }[];
}

const quizResultSchema = new Schema<QuizResult>({
  studentId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  quizId: { type: Schema.Types.ObjectId, ref: "Quiz", required: true },
  courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true },
  marksObtained: { type: Number, required: true },
  totalMarks: { type: Number, required: true },
  attemptedOn: { type: Date, default: Date.now },
  questionResults: [
    {
      questionId: { type: Schema.Types.ObjectId, required: true },
      marksObtained: { type: Number, required: true },
    },
  ],
});

const QuizResultModel = model<QuizResult>("QuizResult", quizResultSchema);

export default QuizResultModel;
