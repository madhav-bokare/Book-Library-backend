import mongoose from "mongoose";

const BookSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
  img: { type: String, required: true },
  category: { type: String, required: true, lowercase: true },
  content: { type: String, required: true }, 
  link: { type: String, required: true, enum: ["free", "paid"] },

  price: { type: Number },  
}, { timestamps: true });

const Book = mongoose.model("Book", BookSchema);
export default Book;
