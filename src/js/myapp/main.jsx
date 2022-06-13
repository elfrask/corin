

function sendmail(to, asunto, msg) {
    send("/sendmail", {
        to:to,
        asunto:asunto,
        msg:msg
    })   
}



class Register extends React.Component {
    state = {
        login: true,
        check: false,
        codigo: ""
    };
    render() {

        let event_login = genlink(this.props.onlogin);
        let event_register = genlink(this.props.onregister);
        let data = {}


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
                                    })
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
                                        data = {
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
                                                this.setState({check:true, codigo:code})

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
                                            event_register(data)
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
        reg: false
    };
    render() {

        app_instanced = this;


        return(
            <div className="fill medio">

                {
                    this.state.login?(

                        []

                    ):(

                        <Register
                        
                        onlogin={(data, target) => {
                            send("/login").then(x=>{
                                if (x.error) {
                                    mensaje("no se pudo iniciar session, nombre de usuario o contraseña invalida")
                                } else {

                                }
                            })
                        }}

                        onregister={(data, target) => {
                            send("/login").then(x=>{
                                if (x.error) {
                                    mensaje("no se pudo registrar, nombre de usuario ya ocupado")
                                } else {

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
    
    ReactDOM.render(
        <Main/>,
        document.body,
        () => {
            
        }
    )
}

main()
