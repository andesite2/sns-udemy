const express = require("express");
const app = express();

const POST = 8000;

app.use(express.json());

app.use("/api/auth", require("./routers/auth"));

app.listen(POST, () => {
    console.log(`Server is running on port ${POST}`);
});
