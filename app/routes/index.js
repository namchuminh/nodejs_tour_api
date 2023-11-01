const AdminAuthRoute = require("./adminAuth.routes.js");
const AdminTours = require("./adminTours.routes.js");
const auth = require("../middlewares/auth.middleware.js");

function route(app){
    app.use("/admin", AdminAuthRoute)
    app.use("/admin/tours", auth, AdminTours)
}

module.exports = route