/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

var  bMedida = false;
var  tempInt = "";
var  temperatura="";

function degToCompass(num) {
  var val = Math.floor((num / 22.5) + 0.5);
  var arr = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
  return arr[(val % 16)];
}


const app = {
    // Application Constructor
    hora: "",
    minu: "",
    seg: "",
    URI: "",
    punto: false,
    
    initialize:  () => {
       
        app.URI = "https://api.openweathermap.org/data/2.5/weather?q=sevilla,ES&appid=c2ecf0a83c555c2054704fd94ff29f9e&units=metric&lang=es&callback=?";
        
        app.bindEvents();
        setInterval('app.medida()', 3600000);  // 1h
        setInterval('app.reloj()', 12000);
        setInterval('app.cambioMedida()', 5000);
        console.log("initialize: ");
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    bindEvents: function () {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        //$(document).on('pageshow', '#main', this.onPageShow);
        app.medida();
        console.log("bindEvents:");
    },

    onDeviceReady: function () {
        app.receivedEvent('deviceready');
        //$(document).bind("resume", app.onResumedApp);
        window.addEventListener("batterylow", app.onBatteryLow, false); 
        window.addEventListener("batterystatus", app.onBatteryStatus, false); 
        
        app.medida();
        app.reloj();
       
        console.log("onDeviceReady");
    },
    onBatteryLow: function (info) {
          //alert("Estado de la Bateria:  Nivel " + info.level + "\nEsta conectado: " + info.isPlugged);
          $("idBateria").text("Nivel bateria " +info.level)
                        .css("color", "red");
          console.log("onBatteryLow");
    },
    onBatteryStatus: function (info) {
          //alert("Estado de la Bateria:  Nivel " + info.level + "\nEsta conectado: " + info.isPlugged);
          if(info.isPluged)
            $("idBateria").text("");
          console.log("onBatteryStatus");
    },
    reloj:  () => {
        
        console.log("Reloj ...");
        var hora = new Date();
        var strHora = "";
       
        var humedad = "";
        var presion = "";
        

        app.hora = hora.getHours();
        app.minu = hora.getMinutes();
        app.seg = hora.getSeconds();

        app.minu = app.minu > 9 ? app.minu : '0' + app.minu;
        strHora = app.hora + ':' + app.minu;


        $("#idHora span:first").text(app.hora);
        $("#idHora span:last").text(app.minu);

        $("#idFecha").text(hora.toLocaleDateString("es"));
        
        
         $.getJSON('http://api.thingspeak.com/channels/172131/fields/4/last.json?api_key=SQ0AWSJRWFJ8Z7O1')
                 .done(function(data){
                     
                     tempInt=data.field4;
                     console.log("Temp. Interior: "+tempInt);
                    })
            
                  .error(function () {

                    console.log("Error comunicacion");
                  });

        $.getJSON('http://api.thingspeak.com/channels/172131/feeds/last.json?api_key=SQ0AWSJRWFJ8Z7O1')
                
                .done(function (data) {
                 
         
                    if( bMedida)
                    {
                        temperatura = data.field1;
                        $("#idTemp").text(temperatura.slice(0, 2))
                                    .css("border-top","4px dotted white")
                                    .css("border-bottom","");
                                      // .css("color","red");
                        console.log("Temperatura 1: " + data.field1); 
                    }
                    else
                    {
                         //console.log("Temperatura 4: " + data.field4);   
                        // temperatura = data.field4;
                         $("#idTemp").text(tempInt.slice(0, 2))
                                    // .css("color","blue");
                                     .css("border-bottom","4px dotted white")
                                     .css("border-top","") ;
                                      
                                     
                    }
                   // temperatura = data.field1;
                    humedad = data.field2;
                    presion = data.field3;
                    //$("#idTemp").text(temperatura.slice(0, 2));
                    $("#idHumedad").text(humedad.slice(0, 2));
                    if(data.field3.length === 5)
                      $("#idPresion").text(presion.slice(0, 3));
                    else
                      $("#idPresion").text(presion.slice(0, 4)); 

                    console.log("Temperatura: " + data.field1);
                    console.log("Humedad: " + data.field2);
                    console.log("Presion: " + data.field3+" L "+data.field3.length);
                })

                .error(function () {

                    console.log("Error comunicacion");
                });

        //Corriente

        $.getJSON('http://api.thingspeak.com/channels/267256/feeds/last.json?api_key=0C2M9I6C2LOH21AI')
                //, function (vj) {
                .done(function (data) {


                    if (data.field1 <= 6.0)
                        $("#idCorriente").text(data.field1).removeClass("blink blink_500").css("color", "yellowgreen");
                    else if (data.field1 >= 6.0 && data.field1 <= 10.0)
                        $("#idCorriente").text(data.field1)
                                .removeClass("blink_500")
                                .addClass("blink")
                                .css("color", "orange");
                    else
                        $("#idCorriente").text(data.field1)
                                .addClass("blink_500")
                                .css("color", "yellow");
                    

                    console.log("Corriente: " + data.field1);

                })

                .error(function () {
                    console.log("Error comunicacion");
                });
      
    },
    
    medida : () => {
        
       console.log("Medida ...");
        
     $.getJSON(app.URI)
        .done((data) => {

          console.log("Response: " + data);

          console.log(`Temperatura :${data.main.temp} ºC,Humedad: ${data.main.humidity} %Hr,Presion: ${data.main.pressure} Kpa,${data.weather[0].description}`);
          console.log(`Estado: ${data.weather[0].description}`);

          console.log("Direccion viento: " + degToCompass(data.wind.deg));

          const dir = degToCompass(data.wind.deg);

        //marquee
           $("#marText").html(`T:${data.main.temp} ºC,H: ${data.main.humidity} %Hr,P: ${data.main.pressure} Kpa`);//,DV ${data.wind.deg}º,${dir}`);        
         
         //Icono
           let iconUrl = `http://openweathermap.org/img/w/${data.weather[0].icon}.png`;
           console.log(iconUrl);
           $("#wicon").attr('src', iconUrl);    
           
           $("#idViento").html(`DV ${data.wind.deg}º,${dir}`);

          
       }).error( () => {
                    console.log("Error comunicacion");
        });
     
    },

    // Update DOM on a Received Event
    receivedEvent: function (id) {

        console.log('Received Event: ' + id);
    },
    cambioMedida: function () {
        bMedida = !bMedida;
       
        console.log("Cambio medida: " + bMedida);
        
       
    }
};

