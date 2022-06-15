

function sendmail(to, asunto, msg) {
    send("/sendmail", {
        to:to,
        asunto:asunto,
        msg:msg
    })   
}

function add_row(name, the, me, bg) {

    let bg_color = bg||"transparent"
    
    return(
        <div className="lc_row" style={{
            backgroundColor:bg_color
        }}>
            <div className="lc_e medio">
                {name}
            </div>
            <div className="lc_e medio" style={{
                color: "crimson"
            }}>
                {the}
            </div>
            <div className="lc_e medio" style={{
                color: "yellowgreen"
            }}>
                {me}
            </div>
        </div>
    )
}

class ListContacts extends React.Component {
    state = {
        data:[],
        total:{
            the: 0,
            me: 0,
        }
    };
    componentDidMount() {
        send("/list_contacts").then(x=>{
            let data = (
                x.data
                //range(0, 100).map(x=>({name:`Contact: ${x}`, money:{the:x, me:x}}))
            );

            let conteo = {
                the: 0,
                me: 0
            };

            data.forEach(y => {
                let money = y.money
                conteo.me = conteo.me + money.me;
                conteo.the = conteo.the + money.the;
            });

            this.setState({
                data:data,
                total: conteo
            })
        });
        console.log("loading contacts data...")
    }
    render() {
        console.log("Render GUI")

        //let conteo = {the: 0, me: 0};

        let target = this.props.target

        return(
            <div className="fill-h">

                <div style={{"backgroundColor":"darkslateblue"}}>
                    <br />
                    <center>
                        <h1 style={{color:"gold"}}>
                            @{this.props.user}
                        </h1>
                    </center>
                    <br />
                    <div className="fill-h">
                        <div className="bc l" style={{"backgroundColor":"brown"}}>
                            <div className="bcd medio">
                                Perdidas
                            </div>
                            <div className="bcd medio" id="_lc_lost">
                                {this.state.total.the}$
                            </div>

                        </div>
                        <div className="bc l" style={{"backgroundColor":"green"}}>
                            <div className="bcd medio">
                                Ganancias
                            </div>
                            <div className="bcd medio" id="_lc_lost">
                                {this.state.total.me}$
                            </div>
                            
                        </div>
                    </div>
                </div>

                <div className="list_contact_box">
                    { add_row("Nombres", "Les debes", "Te deben", "#111") }

                    {
                        this.state.data.map
                        //range(0, 10).map(x=> ({name: `Contact: ${x}`,money:{the: x,me: x,}})).map
                        ((x, i)=>{

                            let money = x.money

                            return(
                            
                                <div>
                                    {add_row((
                                        <a onClick={() => {



                                            target.setState({state:1, arg: {
                                                contact: x.name
                                            } })
                                        }} href="#">
                                            {x.name}
                                        </a>
                                    ), money.the + "$", money.me + "$", "#222")}
                                </div>
                            
                            )
                        })
                    }
                    { add_row("Total", this.state.total.the + "$", this.state.total.me + "$", "#222") }

                </div>
            </div>
        )

    }
}
class Contact extends React.Component {
    state = {
        contact:"",
        money: [],
        total:{
            the:0,
            me:0,
        }
    };
    componentDidMount() {
        send("/contact", {contact: this.props.arg.contact}).then(x=>{
            if (x.error) {
                mensaje("error on load data");
                this.props.target.setState({state: 0, arg: 0})
            } else {

                let data = x.data;

                let total = { the: 0, me: 0 };

                data.history.forEach(y=> {

                    let money = y.money
                    total.me = total.me + money.me;
                    total.the = total.the + money.the;

                })

                this.setState({
                    contact: this.props.arg.contact,
                    money: data.history,
                    total: total
                })

            }
        })
    }
    render() {

        let target = this.props.target

        return(
            <div className="fill-h">

                <div style={{"backgroundColor":"darkslateblue"}}>
                    <br />
                    <center>
                        <h1 style={{color:"gold"}}>
                            #{this.state.contact}
                        </h1>
                    </center>
                    <br />
                    <div className="fill-h">
                        <div className="bc l" style={{"backgroundColor":"brown"}}>
                            <div className="bcd medio">
                                Perdidas
                            </div>
                            <div className="bcd medio" id="_lc_lost">
                                {this.state.total.the}$
                            </div>

                        </div>
                        <div className="bc l" style={{"backgroundColor":"green"}}>
                            <div className="bcd medio">
                                Ganancias
                            </div>
                            <div className="bcd medio" id="_lc_lost">
                                {this.state.total.me}$
                            </div>
                            
                        </div>
                    </div>
                </div>
                <div
                    className="sumit"
                    onClick={() => {
                        send("/remove_contact", {contact:this.state.contact}).then(x => {
                            if (!x.error) {
                                this.props.target.setState({
                                    state: 0,
                                    arg: {}
                                })
                            } else mensaje("no se pudo borrar el contacto...")
                        })
                    }}
                >
                    Eliminar contacto
                </div>

                <div className="list_contact_box">
                    { add_row("Asunto", "Les debes", "Te deben", "#111") }

                    {
                        this.state.money.map
                        //range(0, 10).map(x=> ({name: `Contact: ${x}`,money:{the: x,me: x,}})).map
                        ((x, i)=>{

                            let money = x.money

                            return(
                            
                                <div>
                                    {add_row((
                                        <a onClick={() => {



                                            target.setState({state:4, arg: {
                                                contact: this.state.contact,
                                                facture: i,
                                            } })
                                        }} href="#">
                                            {x.name}
                                        </a>
                                    ), money.the + "$", money.me + "$", "#222")}
                                </div>
                            
                            )
                        })
                    }
                    { add_row("Total", this.state.total.the + "$", this.state.total.me + "$", "#222") }

                </div>
            </div>
        )

    }
}


class CreateContact extends React.Component {
    state = {

    };
    render() {

        let target = this.props.target;


        return(
            <div className="fill-h">
                <br />
                <input defaultValue={""} type="text" className="camp-input" placeholder="nombre del contacto" id="new_con" />

                <div className="sumit" onClick={() => {
                    
                    let nombre = go("new_con").value;
                    for (let i = 0; i < _not_tokens.length; i++) {
                        const e = _not_tokens[i];
                        if (nombre.includes(e)) {
                            return mensaje("El nombre no puede poseer caracteres especiales")
                        }
                        
                    }

                    console.log(nombre)



                    send("/new_contact", {contact: nombre}).then(x=>{

                        if (x.error) {
                            mensaje("no pueden haber dos contactos con el mismo asunto")
                        } else {

                            target.setState({state: 0, arg: {}})
                        }
                    })
                    
                }}>
                    Crear Contacto
                </div>
            </div>
        )
    }
};

class CreateFacture extends React.Component {
    state = {

    };
    render() {

        let target = this.props.target;


        return(
            <div className="fill-h">
                <br />
                <input defaultValue={""} type="text" className="camp-input" placeholder="Asunto de deuda" id="asunt" />
                <input defaultValue={"0"} type="number" className="camp-input" placeholder="Monto" id="_monto" />

                <div className="sumit" onClick={() => {
                    
                    let asunt = go("asunt").value;
                    let monto = parseFloat(go("_monto").value);
                    
                    if (asunt.trim() === "") asunt = "Factura" 
                    //console.log(nombre)

                    send("/new_facture", {contact: this.props.arg.contact, asunt:asunt, monto: monto}).then(x=>{

                        if (x.error) {
                            mensaje("no pudo agregar la factura")
                        } else {

                            target.setState({state: 1, arg: {
                                contact: this.props.arg.contact
                            }})
                        }
                    })
                    
                }}>
                    Crear Factura 
                </div>
                <br />
                <center style={{color:"#aaa"}}>
                   (+ ganancia) (- perdida)
                </center>
            </div>
        )
    }
}


class AdminFacture extends React.Component {
    state = {
        monto: {
            the: 0,
            me: 0,
        },
        facture: -1,
        contact: "",
        asunt: ""
    };
    componentDidMount() {

        send("/facture", {
            facture: this.props.arg.facture,
            contact: this.props.arg.contact,
        }).then(x=>{

            if (x.error) {
                this.props.target.setState({
                    state: 0,
                    arg: {}
                })
                return mensaje("No se a podido cargar la informacion");
            }

            let data = x.data
            

            this.setState({
                contact: this.props.arg.contact,
                facture: this.props.arg.facture,
                asunt: data.name,
                monto: data.money 
            })

        }).catch(x=> this.componentDidMount());
    };
    render() {


        return(
            <div className="fill-h">
                
                

                <div style={{"backgroundColor":"darkslateblue"}}>
                    <br />
                    <center>
                        <h3 style={{color:"gold"}}>
                            {this.state.asunt}
                        </h3>
                    </center>
                    <br />
                    <div className="fill-h">
                        <div className="bc l" style={{"backgroundColor":"brown"}}>
                            <div className="bcd medio">
                                Perdidas
                            </div>
                            <div className="bcd medio" id="_lc_lost">
                                {this.state.monto.the}
                            </div>

                        </div>
                        <div className="bc l" style={{"backgroundColor":"green"}}>
                            <div className="bcd medio">
                                Ganancias
                            </div>
                            <div className="bcd medio" id="_lc_lost">
                                {this.state.monto.me}
                            </div>
                            
                        </div>
                    </div>
                </div>
                <br />
                
                <div className="sumit" onClick={() => {
                    this.props.target.setState({
                        state: 1,
                        arg: {
                            contact: this.state.contact
                        }
                    })
                }}>
                    Ok
                </div>
                <br />
                <div className="sumit" onClick={() => {

                    send("/remove_facture", {
                        facture: this.state.facture,
                        contact: this.state.contact,
                    }).then(x=> {

                        if (!x.error) {
                            
                            this.props.target.setState({
                                state: 1,
                                arg: {
                                    contact: this.state.contact
                                }
                            })
                        } else mensaje("hubo un error al momento de solventar...")
                    })

                }}>
                    Solventar deuda
                </div>
                
            </div>
        )
    }
}



let estados = [
    // Principales

    ListContacts, // 0
    Contact, // 1

    // Adminstrar

    CreateContact, // 2
    CreateFacture, // 3

    AdminFacture, // 4

]





class Register extends React.Component {
    state = {
        login: true,
        check: false,
        codigo: "",
        data: {}
    };
    render() {

        let event_login = genlink(this.props.onlogin);
        let event_register = genlink(this.props.onregister);
        


        return(

            <div className="box-login">
                <div className="">
                    {
                        this.state.login?(

                            <div>

                                <input type="text" id="user" className="camp-input" placeholder="nombre de usuario"/>
                                <input type="password" id="pass" className="camp-input"  placeholder="contraseña"/>
                                <div className="sumit" onClick={() => {
                                    event_login({
                                        user:go("user").value,
                                        pass:go("pass").value,
                                    }, this)
                                }}>
                                    Iniciar session
                                </div>
                                <br />
                                <a 
                                href="#" 
                                onClick={() => {this.setState({login:false})}} 
                                style={{color:"gold"}}> 
                                    registrate 
                                </a>

                            </div>

                        ):(
                            <div>

                                <div
                                style={{
                                    display:(this.state.check)?("none"):("---")

                                }}
                                >
                                    <input type="text" id="user" className="camp-input" placeholder="nombre de usuario"/>
                                    <input type="password" id="pass" className="camp-input" placeholder="contraseña"/>
                                    <input type="password" id="repass" className="camp-input" placeholder="volver a escribir la contraseña"/>
                                    <input type="text" id="email" className="camp-input" placeholder="introducir correo"/>
                                    <div 

                                    style={{display:(this.state.check)?("none"):("---")}}
                                    className="sumit"
                                    onClick={() => {
                                        let data = {
                                            user: go("user").value,
                                            pass: go("pass").value,
                                            repass: go("repass").value,
                                            email: go("email").value,
                                        }

                                        let check = [
                                            RegExpresions.username.test(data.user),
                                            RegExpresions.email.test(data.email),
                                            data.pass == data.repass,
                                        ]

                                        if (!check.includes(false)) {

                                            
                                            let code = parseInt((Math.random()*(10**8))+"")+"";
                                            
                                            

                                            console.log("code:", code)
                                            send("/sendcode", {
                                                to: data.email,
                                                code: code,
                                            }).then(x=>{
                                                this.setState({check:true, codigo:code, data:data})

                                            })
                                            
                                        } else {
                                            for (let i = 0; i < check.length; i++) {
                                                const element = check[i];

                                                let msg = ""

                                                switch (i) {
                                                    case 0:

                                                        msg = "El usuario es invalido";
                                                        
                                                        break;
                                                    case 1:
                                                        
                                                        msg = "El correo es invalido";
                                                        
                                                        break;
                                                    case 2:
                                                        
                                                        msg = "las contraseñas no coinciden";

                                                        break;
                                                        
                                                }

                                                if (!element) {
                                                    mensaje(msg);
                                                    break;
                                                    
                                                }

                                                
                                                
                                            }
                                        }
                                    }}>
                                        Enviar codigo
                                    </div>
                                    <br />
                                    <a 
                                    href="#" 
                                    onClick={() => {this.setState({login:true})}} 
                                    style={{
                                        color:"gold",
                                    }}> 
                                        inicia session 
                                    </a>

                                </div>


                                <div
                                style={{
                                    display:(!this.state.check)?("none"):("block")
                                    
                                }}
                                >
                                    <div className="sumit" onClick={() => {
                                        send("/sendcode", {
                                            to: data.email,
                                            code: this.state.codigo,
                                        }).then(x=>{
                                        })
                                    }}>
                                        Reenviar codigo
                                    </div>

                                    <br />
                                    <br />
                                    <input type="text" id="codigo" className="camp-input" placeholder="introducir codigo"/>
                                    <div className="sumit" onClick={() => {
                                        let code = go("codigo").value;
                                        console.log(code, this.state.codigo)
                                        if (code === this.state.codigo) {
                                            event_register(this.state.data, this)
                                        } else {
                                            mensaje("Codigo de verificacion incorrecto")
                                        }
                                    }}>
                                        Registrate
                                    </div>

                                </div>

                            </div>
                        )
                    }
                </div>
            </div>

        )

    }
}


class Main extends React.Component {
    state = {
        login: false,
        user: "",
        state:0,
        arg:{}
    };
    render() {

        let ADD_EVENTS = [
            () => {
                this.setState({state: 2})
            },
            () => {
                this.setState({state: 3})
            },
        ]

        app_instanced = this;
        let Estado_actual = estados[this.state.state];
        let Add = ADD_EVENTS[this.state.state]

        


        return(
            <div className="fill medio">

                {
                    this.state.login?(

                        <div className="fill">
                            <div className="head">
                                <Img
                                
                                    className="pointer l"
                                    img="/src/img/icon.png"
                                    size="50px"
                                    click={() => {
                                        this.setState({state: 0, arg: {}})
                                    }}

                                />

                                <Img

                                    style={{
                                        display:(typeof(Add) !== "undefined")? "block": "none"
                                    }}
                                                                
                                    className="pointer r"
                                    img="/src/img/plus.png"
                                    size="50px"
                                    click={() => {
                                        Add(this.state.arg, this.state.user)
                                    }}

                                />

                                
                            </div>
                            <div className="body">
                                <Estado_actual user={this.state.user} target={this} arg={this.state.arg} />
                            </div>
                        </div>

                    ):(

                        <Register
                            onlogin={(data, target) => {
                                send("/login", {
                                    user:data.user,
                                    pass:data.pass,
                                }).then(x=>{
                                    if (x.error) {
                                        mensaje("no se pudo iniciar session, nombre de usuario o contraseña invalida")
                                    } else {
                                        target.setState({
                                            login: true,
                                            check: false,
                                            codigo: ""
                                        }, () => {
                                            main()
                                        })
                                    }
                                })
                            }}

                            onregister={(data, target) => {
                                send("/register", {
                                    user:data.user,
                                    pass:data.pass,
                                    email:data.email,
                                }).then(x=>{
                                    if (x.error) {
                                        mensaje("no se pudo registrar, nombre de usuario ya ocupado")
                                    } else {

                                        send("/login", {
                                            user:data.user,
                                            pass:data.pass,
                                        }).then(x=>{

                                            target.setState({
                                                login: true,
                                                check: false,
                                                codigo: ""
                                            }, () => {

                                                main()

                                            })

                                        })

                                        

                                    }
                                })
                            }}
                        />

                    )
                }

            </div>
        )
    }
};

let app_instanced = new Main();

function main(redat) {

    send("/islogin").then(x=>{
        
        ReactDOM.render(
            <Main/>,
            document.body,
            (e) => {

                app_instanced.setState(x)
                
            }
        )

    }).catch(x=>{
        main()
    })
    
}

main()
