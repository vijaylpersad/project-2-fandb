
   
let express = require("express");
let db = require("../models");
let router = express.Router();

// POST /projects - create a new project --from jason project organizer
router.post("/", async (req, res) => {
    if (req.cookies.userId) {
        try {
            const [newProject, newProjectCreated] =
                await db.userFavTeam.findOrCreate({
                    where: {
                        name: req.body,//.name,
                        userId: req.body.userId
                    },
                });
            res.redirect("/");
        } catch (err) {
            console.log("err", err);
        }
    } else {
        res.redirect("/users/login");
    }
});

// // GET /projects/new - display form for creating a new project
// router.get("/teamresults", (req, res) => {
//     if (req.cookies.userId) {
//         res.render("projects/new", { user: res.locals.user });
//     } else {
//         res.redirect("/users/login");
//     }
// });


router.delete("/", async (req, res) => {
    if (req.cookies.userId) {
        try {
            const foundProject = await db.userFavTeam.findOne({
                where: { name: req.params },
            });
            await foundProject.destroy();
            res.redirect("/");
        } catch (err) {
            console.log(err);
        }
    } else {
        res.redirect("users/login");
    }
});

module.exports = router;