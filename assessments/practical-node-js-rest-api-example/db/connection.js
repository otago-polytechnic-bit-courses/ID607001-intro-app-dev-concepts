import mongoose from "mongoose";

const conn = (url) => mongoose.connect(url);

export default conn;
