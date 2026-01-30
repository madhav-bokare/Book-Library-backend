import mongoose from "mongoose";

const BookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      index: true,          
      trim: true,
    },

    img: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
      lowercase: true,
      index: true,          
    },

    content: {
      type: String,
      required: true,
    },

    link: {
      type: String,
      required: true,
      enum: ["free", "paid"],
      index: true,          
    },

    price: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    versionKey: false,  
  }
);

BookSchema.index({ category: 1, link: 1 });

const Book = mongoose.model("Book", BookSchema);
export default Book;
