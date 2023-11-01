const Admin = require("./admin.routes.js");
const Tours = require("./tours.routes.js");
const Users = require("./users.routes.js");

function route(app){
    app.use("/admin", Admin)
    app.use("/tours", Tours)
    app.use("/users", Users)
}

module.exports = route