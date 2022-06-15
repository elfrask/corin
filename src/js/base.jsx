let go = (e) => document.getElementById(e);
let asi = (a, b) => Object.assign(a, b);
let send = (url, body) => (new Promise((res, err) => {

    fetch(url, {
        method:"POST",
        body: JSON.stringify(body||{}),
        headers:{
            'Content-Type': 'application/json'
        }
    }).then(x=>x.json().then(y=>res(y))).catch(x=>err(x));
    

}))
let range = (i, e, s) => {
    let out = []

    i = i||0;
    e = e||1;
    s = s||1;

    for (let index = i; index < e; index = index + s) {
        
        out.push(index)
        
    }

    return out

};
let genlink = (e) => {
    switch (typeof(e)) {
        case "string":
            
            return () => {document.location.assign(e)};
        case "function":

            return e;
        default:

            return () => {}
    }
}


let _not_tokens = ",|!\"'/\\-.;:()[]{}¡¿?~€¬$&%=+*@#ªº^¨Çç`<>".split("")


let RegExpresions = {
    email: (
        /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/
    ),
    username: (
        /^[a-zA-Z0-9]+([a-zA-Z0-9](_|-| )[a-zA-Z0-9])*[a-zA-Z0-9]+$/
    )

}


function mensaje(t, tipo) {
    alert (t)
}

function testing() {
    send("/test").then(x=>console.log(x));
    send("/islogin").then(x=>console.log(x));
}


class Img extends React.Component { 
    // style, className, img, size, (x, y)
    // title, alt, click
    render() {
        return (
            <div
                className={"img " + (this.props.className||"")}
                style={asi({
                    backgroundImage:`url('${this.props.img}')`,
                    width:this.props.size||this.props.x||"",
                    height:this.props.size||this.props.y||"",
                }, this.props.style)}
                onClick={genlink(this.props.click)}
                title={this.props.title||""}
                alt={this.props.alt||""}
            >
                {this.props.children}
            </div>
        )
    }
}
