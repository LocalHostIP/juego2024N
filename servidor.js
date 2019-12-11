const express = require('express');
var app = express();
var server = require('http').Server(app);
const fs = require('fs');

var bestPuntajes=[];
var idActual=1;

function mycomparator(a,b) {
    return parseInt(b.maximo)-parseInt(a.maximo) ;
}

function guardarDatos(){
    var texto,i;
    console.log("Guardando datos...");
    texto='';
    for(i=0;i<bestPuntajes.length;i++){
        if(i!=bestPuntajes.length-1)
            texto+=bestPuntajes[i].nombre+","+bestPuntajes[i].puntaje+","+bestPuntajes[i].maximo+"\n";    
        else
            texto+=bestPuntajes[i].nombre+","+bestPuntajes[i].puntaje+","+bestPuntajes[i].maximo;
    }
    fs.writeFile("public/src/datos.csv",texto, function (err) {
        if (err) {
            return console.log(err);
        }
        console.log("Datos guardados correctamente");
    });
}

function leerDatos(){
    console.log("Leyendo archvios")
    fs.readFile("public/src/datos.csv", 'utf8', function (err,data) {
        if (err) {
            return console.log(err);
        }
        var objeto;
        var datos;
        datos=data.split('\n');
        for(i=0;i<datos.length;i++){
            objeto=datos[i].split(',');
            bestPuntajes.push({id:idActual.toString(),nombre:objeto[0],puntaje:objeto[1],maximo:objeto[2]});
            idActual++;
        }
        console.log("Datos leidos correctamente");
        console.log(bestPuntajes);
    });
}

app.set('port',process.env.PORT || 3000);

//Middlewares
app.use(express.urlencoded({extended: false}));
app.use(express.json());


app.post(function(req, res, next){
    next();
});

// app.use('/*',(req,res,next)=>{
//     console.log("Nueva conexion: "+req.header('user-agent')  );
//     next();
// });

app.post('/getID',(req,res)=>{
    console.log("Asignando nueva ID a "+req.header('user-agent'));
    console.log("id asignada: "+idActual);
    res.send({id:idActual,records:bestPuntajes});
    idActual++;
});

app.use('/enviarPuntaje', function(req, res,next){
    console.log("Nuevo registro:  "+req.body.id);
    var i;
    for(i=0;i<bestPuntajes.length;i++){ //Elimina el antiguo id
        if(bestPuntajes[i].id==req.body.id){
            bestPuntajes.splice(i,1);
            break
        }
    }
    bestPuntajes.push({id:req.body.id,nombre:req.body.nombre,puntaje:req.body.puntaje,maximo:req.body.maximo});

    bestPuntajes.sort(mycomparator);
    if(bestPuntajes.length>10){ //Si hay mas de 10 registros elimina los sobrantes
        bestPuntajes.splice(10,bestPuntajes.length-10);
    }   
    console.table(bestPuntajes);
    guardarDatos();
    res.send(bestPuntajes);
    next();
});

//Static files
app.use(express.static('public'));

//Listen
server.listen(app.get('port'),()=>{
    console.log("Servidor corriendo...");
    console.log("Puerto: 3000");
    leerDatos();
});