let fs = require("fs");
let mail = require("nodemailer");
let credentials = require("./pass")

function open(p) {
    let me = {
        path: p,
        read: () => fs.readFileSync(me.path, "utf8"),
        write: (d) => fs.readFileSync(me.path, d),
        json:{
            read:() => {
                let out = {}
                
                try {

                    let data = fs.readFileSync(me.path, "utf8")
                    out = JSON.parse(data);

                } catch (e) {};

                return out
            },
            write:(d) => {
                let out = false

                try {

                    let data = JSON.stringify(d);
                    fs.writeFileSync(me.path, data)

                    out = true
                    
                } catch (e) {};

                return out
            }
        },
        toString:() => me.read(),
        template:(t) => me.read().replace("{template}", t),
    }

    if (!fs.existsSync(p)) {
        fs.writeFileSync(p, "")
    }

    return me
}

function sendmail(para, asunto, mensaje) {
    let correo = mail.createTransport(credentials.email.yahoo);
    let email = {
        from:credentials.email.yahoo.auth.user,
        to:para,
        subject:asunto,
        text:mensaje
    }
    correo.sendMail(email, (res, err) => {
        if (err) {
            console.log("error :c")
            console.log(err)
        }
    })
}

let paths = {
    user_root:(user) => `./data/users/${user}`,
    user_data:(user) => `./data/users/${user}/data.json`,
    user_data_reg:(user) => `./data/users/${user}/reg`,
    contact_data:(user, contact) => `./data/users/${user}/reg/${contact}.json`,
};

let system = {
    get_user_data:(user, pass) => {
        let pa = paths.user_data(user)
        let data = {
            exist: fs.existsSync(pa),
            data: {},
            pass: false,
        }

        if (data.exist) {
            let data2 = open(pa).json.read();
            let password = data2.pass === pass;

            data.pass = password;
        }

        return data
    },
    set_user_data:(user, data) => {
        let pa = paths.user_data(user);
        open(pa).json.write(data)
    },
    set_contact_data:(user, contact, data) => {
        let pa = paths.contact_data(user, contact);
        open(pa).json.write(data)
    },
    get_contact_data:(user, contact) => {
        let pa = paths.contact_data(user, contact)
        let data = {
            exist: fs.existsSync(pa),
            data: {},
        }

        if (data.exist) {
            let data2 = open(pa).json.read();

        }

        return data
    },
    register:(user, pass, email) => {
        let data = {
            user:user,
            pass:pass,
            email:email,
        }

        fs.mkdirSync(paths.user_root(user))
        fs.mkdirSync(paths.user_data_reg(user))

        open(paths.user_data(user)).json.write(data);

        

    }
    
}


module.exports = {
    open:open,
    sendmail:sendmail,
    paths:paths,
    system:system
}