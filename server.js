const express = require("express");
const dbconnection = require("./config/database");
const cors = require("cors");
const dotenv = require("dotenv");

const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const activitionRoutes = require("./routes/activitionRoutes");
const chapterRoutes = require("./routes/chapterRoutes");
const examRoutes = require("./routes/examRoutes");
const courseRoutes = require("./routes/courseRoutes");
const examResultsRouter = require("./routes/examResultsRoutes");
const watchHistoryRoutes = require("./routes/watchHistoryRoutes");
const rankRouter = require("./routes/rankRouter");
 
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

dbconnection();

// ✅ Middleware
app.use(cors({
  origin: ["http://localhost:3000", "https://waltere.vercel.app"],
  credentials: true,
}));

app.use(express.json());

app.use('/auth', authRoutes);
app.use('/active', activitionRoutes);
app.use('/chapter', chapterRoutes);
app.use('/exam', examRoutes);
app.use('/course', courseRoutes);
app.use('/user', userRoutes);
app.use('/examResult', examResultsRouter);
app.use('/watchHistory',watchHistoryRoutes)
app.use('/rank',rankRouter)
 
app.listen(PORT, () => {
  console.log(`The server is running on port ${PORT}`);
});
