var pos = [["pos11","pos21","pos31","pos41"],
        ["pos12","pos22","pos32","pos42"],
        ["pos13","pos23","pos33","pos43"],
        ["pos14","pos24","pos34","pos44"]];
var valores=[[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]];

var posicionesLibres=[[0,0],[0,1],[0,2],[0,3],
    [1,0],[1,1],[1,2],[1,3],
    [2,0],[2,1],[2,2],[2,3],
    [3,0],[3,1],[3,2],[3,3]];
var puntaje=0;
var posMax=0;
var jugando=0;
var id=-1;

var mouseClickPos=[[0,0],[0,0]];

function actualizarTablero()
{
    $("#id_puntos").html("Puntos: "+puntaje);
    $("#id_maximo").html("Maximo: "+posMax);
    for(i=0;i<4;i++)
        for(j=0;j<4;j++){
            $("#"+pos[i][j]).removeClass();
            $("#"+pos[i][j]).addClass("pos");
            $("#"+pos[i][j]).addClass('n'+valores[i][j]);
            if(valores[i][j]==0)
                $('#'+pos[i][j]).html(' '); 
            else
                $('#'+pos[i][j]).html(valores[i][j]);  
            }
}

function enviarPuntaje(){
    var nombre=$('#txt_nombre').val();
    if(nombre=="")
        nombre="Silvido";
    
    datos={
        id:id,
        nombre:nombre,
        puntaje:puntaje,
        maximo:posMax,
    };
    $.ajax({
        url: '/enviarPuntaje',
        // dataType: "jsonp",
        data: datos,
        type: 'POST',
        success: function (data) {
            var htmlTags = '<tr>'+
            '<th>Nombre</th>'+
            '<th>Puntos</th>'+
            '<th>Maximo</th>'+
            '</tr>';
            $('#tabla_mejoresPuntajes').html(htmlTags);
            for(i=0;i<data.length;i++)
            {
                htmlTags = '<tr>'+
                '<td>' + data[i].nombre + '</td>'+
                '<td>' + data[i].puntaje + '</td>'+
                '<td>' + data[i].maximo + '</td>'+
                '</tr>';
                $('#tabla_mejoresPuntajes').append(htmlTags);
            }
        },
        error: function (xhr, status, error) {
            console.log('Error: ' + error.message);
        },
    });
}

function getId(){
    $.ajax({
        url: '/getID',
        // dataType: "jsonp",
        data: {},
        type: 'POST',
        success: function (data) {
            console.log(data);
            id=data.id;
            enviarPuntaje();
        },
        error: function (xhr, status, error) {
            console.log('Error: ' + error.message);
            location.reload();
        },
    });
}

function perder(){
    enviarPuntaje();
    jugando=0;
    $("#lbPuntaje").html("Tu puntaje: "+puntaje);
    $("#lbMaximo").html("Tu maximo: "+posMax);
    $(".juegoFinalizado").css("display","block");
}

function iniciar(){
    //posicionesLibres=[[3,3]];
    //valores=[[2,4,8,8],[16,32,64,128],[256,512,1024,2048],[256,8192,16384,0]];
    $(".juegoFinalizado").css("display","none"); 
    posicionesLibres=[[0,0],[0,1],[0,2],[0,3],
    [1,0],[1,1],[1,2],[1,3],
    [2,0],[2,1],[2,2],[2,3],
    [3,0],[3,1],[3,2],[3,3]];
    puntaje=0;
    posMax=0;
    jugando=1;
    valores=[[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]];
    getId();
    colocarRandom();
    actualizarTablero();
}

function colocarRandom()
{
    if(posicionesLibres.length>0)
    {
        var cordenada=Math.round(Math.random()*(posicionesLibres.length-1));
        x=posicionesLibres[cordenada][0];
        y=posicionesLibres[cordenada][1];   
        if(Math.random()>.89)
        {
            valores[y][x]=4;
            puntaje+=4;
            if (posMax==0)
                posMax=4;
        }
        else
        {
            valores[y][x]=2;
            puntaje+=2;
            if (posMax==0)
                posMax=2;
        }
        posicionesLibres.splice(cordenada,1);
    }
    
    if(posicionesLibres.length<1){
        var sinOpciones=true;
        for(i=0;i<4&&sinOpciones==true;i++){
            for(j=0;j<4 && sinOpciones==true;j+=2){
                if(valores[i][j]==valores[i][j+1])
                    sinOpciones=false;
            }
        }
        
        for(i=0;i<4&&sinOpciones==true;i++){
            for(j=0;j<4 && sinOpciones==true;j+=2){
                if(valores[j][i]==valores[j+1][i])
                    sinOpciones=false;
            }
        }
        if(sinOpciones==true)
            perder();   
    }
}

function actualizarPosicionesValidas()
{
    posicionesLibres=[];
    for(i=0;i<4;i++)
        for(j=0;j<4;j++){
            if(valores[i][j]==0)
                posicionesLibres.push([j,i]);
        }
}

function mover(d){
    var valor;
    var actualizacion=0;
    var animacion=[60,30,5];

    switch(d){
        case 1:
            for(var i=1;i<4;i++)
            {
                for(var j=0;j<4;j++)
                {
                    valor =valores[i][j];
                    if(valor!=0)
                    {      
                        p_desplazar=i;
                        while(p_desplazar>0){
                            p_desplazar--;
                            if(valores[p_desplazar][j]==valor)
                            {
                                actualizacion=1;
                                valores[p_desplazar+1][j]=0;
                                valores[p_desplazar][j]*=2;
                                anime({
                                    targets: document.getElementById(pos[i][j]),
                                    translateY:[
                                        {value: -animacion[0],duration:animacion[1]},
                                        {value: 0,duration:animacion[2]}
                                    ],
                                });
                                if(valores[p_desplazar][j]>posMax)
                                    posMax=valores[p_desplazar][j];
                                break;
                                
                            }
                            else if(valores[p_desplazar][j]!=0)
                            {
                                break;
                            }
                            else
                            {
                                actualizacion=1;
                                valores[p_desplazar][j]=valor;
                                valores[p_desplazar+1][j]=0;
                                anime({
                                    targets: document.getElementById(pos[i][j]),
                                    translateY:[
                                        {value: -animacion[0],duration:animacion[1]},
                                        {value: 0,duration:animacion[2]}
                                    ],
                                });
                            }
                        }
                        
                    }                    
                }
            }
            break;
        case 2:
            for(var i=2;i>=0;i--)
            {
                for(var j=0;j<4;j++)
                {
                    valor =valores[i][j];
                    if(valor!=0)
                    {      
                        p_desplazar=i;
                        while(p_desplazar<3){
                            p_desplazar++;
                            if(valores[p_desplazar][j]==valor)
                            {
                                actualizacion=1;
                                valores[p_desplazar-1][j]=0;
                                valores[p_desplazar][j]*=2;
                                anime({
                                    targets: document.getElementById(pos[i][j]),
                                    translateY:[
                                        {value: animacion[0],duration:animacion[1]},
                                        {value: 0,duration:animacion[2]}
                                    ],
                                });
                                if(valores[p_desplazar][j]>posMax)
                                    posMax=valores[p_desplazar][j];
                                break;
                            }
                            else if(valores[p_desplazar][j]!=0)
                            {
                                break;
                            }
                            else
                            {
                                anime({
                                    targets: document.getElementById(pos[i][j]),
                                    translateY:[
                                        {value: animacion[0],duration:animacion[1]},
                                        {value: 0,duration:animacion[2]}
                                    ],
                                });
                                actualizacion=1;
                                valores[p_desplazar][j]=valor;
                                valores[p_desplazar-1][j]=0;
                            }
                        }
                    }                    
                }
            }
            break;
        case 3:
            for(var i=3;i>=0;i--)
            {
                for(var j=2;j>=0;j--)
                {
                    valor =valores[i][j];
                    if(valor!=0)
                    {      
                        p_desplazar=j;
                        while(p_desplazar<4){
                            p_desplazar++;
                            if(valores[i][p_desplazar]==valor)
                            {
                                actualizacion=1;
                                valores[i][p_desplazar-1]=0;
                                valores[i][p_desplazar]*=2;
                                anime({
                                    targets: document.getElementById(pos[i][j]),
                                    translateX:[
                                        {value: animacion[0],duration:animacion[1]},
                                        {value: 0,duration:animacion[2]}
                                    ],
                                });
                                if(valores[i][p_desplazar]>posMax)
                                    posMax=valores[i][p_desplazar];
                                break;
                            }
                            else if(valores[i][p_desplazar]!=0)
                            {
                                break;
                            }
                            else
                            {
                                anime({
                                    targets: document.getElementById(pos[i][j]),
                                    translateX:[
                                        {value: animacion[0],duration:animacion[1]},
                                        {value: 0,duration:animacion[2]}
                                    ],
                                });
                                actualizacion=1;
                                valores[i][p_desplazar]=valor;
                                valores[i][p_desplazar-1]=0;
                            }
                        }
                    }                    
                }
            }
            break;
        case 4:
            for(var i=3;i>=0;i--)
            {
                for(var j=0;j<4;j++)
                {
                    valor =valores[i][j];
                    if(valor!=0)
                    {      
                        p_desplazar=j;
                        while(p_desplazar>0){
                            p_desplazar--;
                            if(valores[i][p_desplazar]==valor) //SUmar teclas
                            {
                                actualizacion=1;
                                valores[i][p_desplazar+1]=0;
                                valores[i][p_desplazar]*=2;
                                anime({
                                    targets: document.getElementById(pos[i][j]),
                                    translateX:[
                                        {value: -animacion[0],duration:animacion[1]},
                                        {value: 0,duration:animacion[2]}
                                    ],
                                });
                                if(valores[i][p_desplazar]>posMax)
                                    posMax=valores[i][p_desplazar];
                                break;
                            }
                            else if(valores[i][p_desplazar]!=0) //No desplazamiento
                            {
                                break;
                            }
                            else //Desplazamiento normal
                            {
                                anime({
                                    targets: document.getElementById(pos[i][j]),
                                    translateX:[
                                        {value: -animacion[0],duration:animacion[1]},
                                        {value: 0,duration:animacion[2]}
                                    ],
                                });
                                actualizacion=1;
                                valores[i][p_desplazar]=valor;
                                valores[i][p_desplazar+1]=0;
                            }
                        }
                    }                    
                }
            }
            break;
    }

    if(actualizacion==1){ 
        actualizarPosicionesValidas();
        colocarRandom();
        setTimeout(() => { actualizarTablero(); }, 50);     
    }

}

$(document).on('keypress',function(e) {
    if(jugando==1){
        if(e.which == 119) {
            mover(1); //Mover hacia arriba
        }
        else if(e.which == 115){
            mover(2); //Mover hacia abajo  
        }
        else if(e.which == 100){
            mover(3); //Mover hacia derecha
        }
        else if(e.which == 97){
            mover(4); //Mover hacia abajo
        }
    }
});

$(".main").on('touchstart',function(e){
    mouseClickPos[0][0] = e.changedTouches[0].pageX;
    mouseClickPos[0][1] = e.changedTouches[0].pageY;
});

$(".main").on('touchend',function(e){
    mouseClickPos[1][0] = e.changedTouches[0].pageX;
    mouseClickPos[1][1] = e.changedTouches[0].pageY;
    movimiento = [0,0]; //Direccion y cantidad

    
    if(mouseClickPos[1][0]-mouseClickPos[0][0]>0){
        movimiento=[3,mouseClickPos[1][0]-mouseClickPos[0][0]];
    }else{
        movimiento=[4,mouseClickPos[0][0]-mouseClickPos[1][0]];
    }

    if(mouseClickPos[1][1]-mouseClickPos[0][1]>0){
        if(movimiento[1]<mouseClickPos[1][1]-mouseClickPos[0][1])
            movimiento=[2,mouseClickPos[1][1]-mouseClickPos[0][1]];
    }else{
        if(movimiento[1]<mouseClickPos[0][1]-mouseClickPos[1][1])
            movimiento=[1,mouseClickPos[0][1]-mouseClickPos[1][1]];
    }
    if(jugando==1)
        if(movimiento[1]>10)
            mover(movimiento[0]);
});

$(".mejoresPuntajesCabezera").on('touchend',function(e){
    enviarPuntaje();
    if($("#tabla_mejoresPuntajes").css("display")=="none"){
        $("#tabla_mejoresPuntajes").css("display","block");
        $(".mejoresPuntajesCabezera").css("height","8%");
        $(".mejoresPuntajes").css("height","unset");
        var $target=$('html,body')
        $target.animate({scrollTop: $target.height()},1000);
    }else{
        $("#tabla_mejoresPuntajes").css("display","none");
        $(".mejoresPuntajesCabezera").css("height","100%");
        $(".mejoresPuntajes").css("height","8%");
    }
});

$(".mejoresPuntajesCabezera").on('click',function(e){
    enviarPuntaje();
});

$("#btReiniciar").on('click',function(e){
    iniciar();
});

iniciar();