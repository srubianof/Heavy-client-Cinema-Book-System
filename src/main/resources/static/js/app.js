var app = (function () {
        var api = apiclient;
        var nombreCine = "";
        var fechaFuncion = "";
        var listaFunciones = [];
        var listaSillas = [];
        var numberSeats = 0;
        var funcionSeleccionada;


        var mapObjetos = (funciones) => {
            listaFunciones = funciones.map(({movie: {name, genre}, date}) => ({
                    name: name,
                    genre: genre,
                    time: date.split(" ")[1],
                    date: date
                })
            )
            $("#tablaMovies > tbody").empty();

            listaFunciones.forEach(({name, genre, time, date}) => {
                $("#tablaMovies > tbody").append(
                    `<tr>
                    <td> ${name} </td>
                    <td> ${genre} </td>
                    <td> ${time} </td>
                    <td> <button type="button" class="btn btn-success btn-lg btn-block" onclick="app.dibujarObjetos($('#cinemaName').val(),'${date}','${name}')">Ver Sillas</button> </td>
                    </tr>`
                );
            });
        }
        var dibujarObjetos = function (sillitas) {
            var canvas = document.getElementById("myCanvas");
            var lapiz = canvas.getContext("2d");
            numberSeats = 0;
            lapiz.strokeStyle = 'lightgrey';
            for (let i = 0; i < 7; i++) {
                for (let j = 0; j < 12; j++) {

                    if (sillitas[i][j] === true) {
                        lapiz.fillStyle = "#34BF49";
                        numberSeats++;

                    } else {
                        lapiz.fillStyle = "#FF4C4C";
                    }
                    lapiz.fillRect(j * 65, i * 65, 60, 60);
                }
            }

        }
        var getMovie= function (){

            return funcionSeleccionada.movie.name;
        }

        return {

            dibujarObjetos(nombre, fecha, nombrePelicula) {


                $("#availability").text("Availability of: " + nombrePelicula);
                console.log("perra")
                api.getFunctionsByCinemaAndDate(nombre, fecha, (funciones) => {
                    for (const funcion of funciones) {
                        if (funcion.movie.name === nombrePelicula) {
                            console.log("perra2 jeje")
                            dibujarObjetos(funcion.seats);
                            funcionSeleccionada = funcion;
                            fechaFuncion = funcion.date;
                            break;
                            //:3
                        }
                    }
                    $("#numSeats").text("Number of available chairs: " + numberSeats);

                })

            },
            actualizarListadodeFunciones(nombre, fecha) {
                this.cambiarFecha(fecha);
                this.cambiarNombreCine(nombre);
                api.getFunctionsByCinemaAndDate(nombre, fecha, mapObjetos);
            },
            consultarAsientosDisponibles(nombreCine, fecha, nombrePelicula) {
                api.getFunctionsByCinemaAndDate(nombreCine, fecha, dibujarObjetos);
            },
            cambiarNombreCine(nombre) {
                nombreCine = nombre;
            },
            cambiarFecha(fecha) {
                fechaFuncion = fecha;
            },
            actualizarSilla(cinema,fila,columna){
                api.updateChairbyRowAndColumn(cinema,fechaFuncion,getMovie(),fila,columna);
                this.dibujarObjetos(cinema,fechaFuncion,getMovie());

            }
        }
    }
)();
