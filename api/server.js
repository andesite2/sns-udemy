const express = require("express");
const app = express();
const cors = require("cors");

const POST = 8000;
app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routers/auth"));
app.use("/api/posts", require("./routers/posts"));
app.use("/api/users", require("./routers/users"));

app.listen(POST, () => {
    console.log(`Server is running on port ${POST}`);
});
