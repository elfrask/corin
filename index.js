let express = require("express");
let cookie = require("cookie-session");
let bp = require("body-parser");
let fs =  require("fs")
let app = express();
let { open, sendmail, system, paths } =  require("./lib");
let mail = require("nodemailer");
let path = require("path");

app.use(cookie({
    "keys":["2397813982", "1928329837", "frasko 7w7"],
    "maxAge":3600*1000*24*31,
    "name":"corin",
}))
app.use(bp.json());

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

});


function tomoney(n) {
    let me = {
        the: 0,
        me: 0,
    };

    if (n < 0) {
        me.the = -n
    } else {
        me.me = n
    };

    return me
}

function remove_index(v, i) {

    let a = v.splice(i);
    a.reverse(); a.pop(); a.reverse();
    v.push(...a);
    return v

}


function Api() {

    app.post("/test", (req, res) => {
        res.send({
            cookies:(
                Object.assign(req.session, {})
            )
        })
    })

    app.post("/login", (req, res) => {
        let user = req.body.user;
        let pass = req.body.pass;

        console.log(req.body)

        let usuario = system.get_user_data(user, pass)

        let login = usuario.pass & usuario.exist;
        if (login) {
            req.session.user = user
            console.log("the user:", user, "is login")
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
            console.log("the user:", user, "is register")
            
        }

        res.json({
            error: !register
        })

    });

    app.post("/islogin", (req, res) => {
        let login = typeof(req.session.user) === "string";
        console.log(req.session);

        res.json({
            user: req.session.user||"",
            login: login,
        })
    });

    app.post("/list_contacts", (req, res) => {
        let user = req.session.user;

        let list = fs.readdirSync(paths.user_data_reg(user)).map(x=> {
            
            let contact = path.parse(x).name;
            console.log("loading:", contact)

            let data = open(paths.contact_data(user, contact)).json.read();

            let money = {
                the:0,
                me:0,
            }

            data.history.forEach(y=>{
                money.the = y.money.the + money.the;
                money.me = y.money.me + money.me;
            })
            
            return({
                name: contact,
                money: money
            })
        });

        res.json({data:list})
    });

    app.post("/new_contact", (req, res) => {
        let user = req.session.user;
        let contact = req.body.contact

        console.log(`the user '${user}' to added contact: '${contact}'`)

        let exist = fs.existsSync(paths.contact_data(user, contact));

        if (!exist) {
            
            system.set_contact_data(user, contact, {
                name: contact,
                history: []
            })
        }

        res.json({
            error: exist
        })

    })

    app.post("/new_facture", (req, res) => {
        let user = req.session.user;
        let contact = req.body.contact;

        let facture = {
            asunt: req.body.asunt,
            monto: req.body.monto,
        }

        let error = true;

        let pa = paths.contact_data(user, contact)

        if (fs.existsSync(pa)) {
            error = false;

            //let file = open(pa)
            let data = system.get_contact_data(user, contact).data;

            console.log(data)

            let added = {
                money: tomoney(facture.monto),
                name: facture.asunt
            }

            data.history.push(added)

            system.set_contact_data(user, contact, data)
            //file.json.write(data);
        }


        res.json({
            error: error
        })



    })

    app.post("/remove_facture", (req, res) => {
        let user = req.session.user;
        let contact = req.body.contact;
        let facture = req.body.facture;


        let error = true;

        let pa = paths.contact_data(user, contact)

        if (fs.existsSync(pa)) {
            error = false;

            //let file = open(pa)
            let data = system.get_contact_data(user, contact).data;

            data.history = remove_index(data.history, facture)


            system.set_contact_data(user, contact, data)
            //file.json.write(data);
        }


        res.json({
            error: error
        })



    })

    app.post("/contact", (req, res) => {
        let contact = req.body.contact
        let user = req.session.user;

        let out = {
            error: true,
            data: {}
        }

        let p  = paths.contact_data(user, contact)

        if (fs.existsSync(p)) {
            
            out.data = open(p).json.read();
            out.error = false;
        }


        res.json(out)
        
    })

    app.post("/facture", (req, res) => {
        let contact = req.body.contact
        let facture = req.body.facture
        let user = req.session.user;

        let out = {
            error: true,
            data: {}
        }

        let p  = paths.contact_data(user, contact)

        if (fs.existsSync(p)) {
            
            out.data = open(p).json.read().history[facture];
            out.error = false;
        }

        console.log(out, {
            contact: contact,
            facture: facture,
            user: user,
        })


        res.json(out)
        
    })

    app.post("/remove_contact", (req, res) => {

        let contact = req.body.contact;
        let user = req.session.user;

        let out = {
            error: true
        };

        let p = paths.contact_data(user, contact);

        if (fs.existsSync(p)) {
            fs.unlinkSync(p)
            out.error = false;
        }

        res.json(out)

    });
    
}


app.use("/src", express.static("./src"));



let port = process.env.PORT||8070;
Api();

app.listen(port, () => {
    console.log("server open in the port:", port)
})