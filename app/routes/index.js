const Admin = require("./admin.routes.js");
const Tours = require("./tours.routes.js");
const Users = require("./users.routes.js");
const Categories = require("./categories.routes.js");
const News = require("./news.routes.js");

function route(app){
    app.use("/admin", Admin)
    app.use("/tours", Tours)
    app.use("/users", Users)
    app.use("/categories", Categories)
    app.use("/news", News)
}

module.exports = route