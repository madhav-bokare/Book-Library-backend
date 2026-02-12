import mongoose from "mongoose";

const BookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
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
    },

    content: {
      type: String,
      required: true,
    },

    link: {
      type: String,
      enum: ["free", "paid"],
      required: true,
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

/* FAST INDEX */
BookSchema.index({ category: 1, link: 1 });

export default mongoose.models.Book ||
  mongoose.model("Book", BookSchema);
