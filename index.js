let express = require("express");
let cookie = require("cookie-session");
let bp = require("body-parser");
let fs =  require("fs")
let app = express();
let { open, sendmail, system, paths } =  require("./lib")
let mail = require("nodemailer")

app.use(bp.json());
app.use(cookie({
    "keys":["2397813982", "1928329837", "frasko 7w7"],
    "maxAge":3600*1000*24*31,
    "name":"corin",
}))

let dirs = [
    "data", "data/users"
];

dirs.forEach(x=> {
    if (!fs.existsSync(x)) {
        fs.mkdirSync(x)
    }
})


app.post("/sendcode", (req, res) => {
    sendmail(req.body.to, "Codigo de verificacion", 
        `su codigo de verificacion es: ${req.body.code}`
    );

    res.json({});
})




app.get("/", (req, res) => {

    res.send(open("./public/index.html").read())

})


function Api() {
    app.post("/login", (req, res) => {
        let user = req.body.user;
        let pass = req.body.pass;

        let usuario = system.get_user_data(user, pass)

        let login = usuario.pass & usuario.exist;

        if (login) {
            req.session.user = user
        }

        res.json({
            error: !login
        })

    });

    app.post("/register", (req, res) => {
        let user = req.body.user;
        let pass = req.body.pass;
        let email = req.body.email;

        let usuario = system.get_user_data(user, pass)

        let register = !usuario.exist;

        if (register) {

            system.register(user, pass, email)
            
        }

        res.json({
            error: !register
        })

    });

    app.post("/islogin", (req, res) => {
        let login = typeof(req.session.user);
        res.json({
            user: req.session.user,
            login: login,
        })
    });

    app.post("/list_contacts", (req, res) => {
        let user = req.session.user;

        let list = fs.readdirSync(paths.user_data_reg(user)).map(x=> {
            let data = open(paths.contact_data(user, x)).json.read();
            
            return({
                name:x
            })
        })
    });
    
}


app.use("/src", express.static("./src"));



let port = process.env.PORT||8070;
Api();

app.listen(port, () => {
    console.log("server open in the port:", port)
})