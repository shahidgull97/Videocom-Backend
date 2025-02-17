// import app from "./index.js";
import { connectDB } from "./confi/db.js";
import server from "./index.js";

const serverStar = server.listen(process.env.PORT, "0.0.0.0", async (err) => {
  if (err) {
    console.log(`server failed with error ${err}`);
  } else {
    await connectDB();
    console.log(`server is running at http://localhost:${process.env.PORT}`);
  }
});

// const PORT = process.env.PORT || 5000;
// server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
