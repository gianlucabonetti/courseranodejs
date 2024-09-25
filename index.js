const express = require("express");
const app = express();

app.use(express.json());
app.use("/book", require("./router/book.js").routes);
app.use("/user", require("./router/user.js").routes);
app.use("/review", require("./router/review.js").routes);

app.set("json spaces", 2);
app.listen(5000, () => console.log("Server is running"));
