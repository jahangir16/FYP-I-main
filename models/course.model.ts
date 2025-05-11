import mongoose, { Document, Model, Schema } from "mongoose";
import { IUser } from "./user.model";

// Define the Document interface
interface IDocument extends Document {
  name: string;
  type: string;
  size: number;
  file: string;
}

// Define the Document schema
const documentSchema = new Schema<IDocument>({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  size: {
    type: Number,
    required: true,
  },
  file: {
    type: String,
    required: true,
  },
});

// Define the Comment interface
export interface IComment extends Document {
  user: IUser;
  question: string;
  questionReplies: IComment[];
}

// Define the Review interface
interface IReview extends Document {
  user: IUser;
  rating?: number;
  comment: string;
  commentReplies?: IReview[];
}

// Define the Link interface
interface ILink extends Document {
  title: string;
  url: string;
}

// Define the CourseData interface
export interface ICourseData extends Document {
  title: string;
  description: string;
  videoUrl: string;
  videoThumbnail: object;
  videoSection: string;
  videoLength: number;
  videoPlayer: string;
  links: ILink[];
  suggestion: string;
  questions: IComment[];
  documents?: IDocument[]; // Use the IDocument interface
}

// Define the Course interface
export interface ICourse extends Document {
  name: string;
  description: string;
  categories: string;
  price: number;
  estimatedPrice?: number;
  thumbnail: object;
  tags: string;
  level: string;
  demoUrl: string;
  benefits: { title: string }[];
  prerequisites: { title: string }[];
  reviews: IReview[];
  courseData: ICourseData[];
  ratings?: number;
  purchased: number;
  title: string;
  createdBy: IUser;
}

// Define the Review schema
const reviewSchema = new Schema<IReview>(
  {
    user: Object,
    rating: {
      type: Number,
      default: 0,
    },
    comment: String,
    commentReplies: [Object],
  },
  { timestamps: true }
);

// Define the Link schema
const linkSchema = new Schema<ILink>({
  title: String,
  url: String,
});

// Define the Comment schema
const commentSchema = new Schema<IComment>(
  {
    user: Object,
    question: String,
    questionReplies: [Object],
  },
  { timestamps: true }
);

// Define the CourseData schema
const courseDataSchema = new Schema<ICourseData>({
  videoUrl: String,
  videoThumbnail: Object,
  title: String,
  videoSection: String,
  description: String,
  videoLength: Number,
  videoPlayer: String,
  links: [linkSchema],
  suggestion: String,
  questions: [commentSchema],
  documents: [documentSchema], // Use the documentSchema here
});

// Define the Course schema
const courseSchema = new Schema<ICourse>(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    categories: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    estimatedPrice: {
      type: Number,
    },
    thumbnail: {
      public_id: {
        type: String,
      },
      url: {
        type: String,
      },
    },
    tags: {
      type: String,
      required: true,
    },
    level: {
      type: String,
      required: true,
    },
    demoUrl: {
      type: String,
      required: true,
    },
    benefits: [{ title: String }],
    prerequisites: [{ title: String }],
    reviews: [reviewSchema],
    courseData: [courseDataSchema],
    ratings: {
      type: Number,
      default: 0,
    },
    purchased: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

// Create the Course model
const CourseModel: Model<ICourse> = mongoose.model("Course", courseSchema);

export default CourseModel;
