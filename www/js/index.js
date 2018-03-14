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
var app = {
    // Application Constructor
    hora: "",
    minu: "",
    seg: "",
    punto:false,
    initialize: function() {
        this.bindEvents();
        setInterval('app.reloj()',10000);
        console.log("initialize: ");
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    bindEvents: function () {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        //$(document).on('pageshow', '#main', this.onPageShow);
        
        console.log("bindEvents:");
    },
    
    onDeviceReady: function () {
        app.receivedEvent('deviceready');
        //$(document).bind("resume", app.onResumedApp);
        app.reloj();
        console.log("onDeviceReady");
    },
    reloj: function () {
        var hora = new Date();
        var strHora="";
        var temperatura="";
        var humedad="";
        var presion="";
        var corriente="";
         
        app.hora = hora.getHours();
        app.minu = hora.getMinutes();
        app.seg  = hora.getSeconds();
        
        app.minu = app.minu > 9 ? app.minu : '0' + app.minu;
        strHora =  app.hora + ':' + app.minu;
                                
        
        $("#idHora span:first").text(app.hora);
        $("#idHora span:last").text(app.minu);
        
        $("#idFecha").text(hora.toLocaleDateString("es"));
                
        
        $.getJSON('http://api.thingspeak.com/channels/172131/feeds/last.json?api_key=SQ0AWSJRWFJ8Z7O1')
                //, function (vj) {
                .done(function (data) {
                    
                    temperatura=data.field1;
                    humedad=data.field2;
                    presion=data.field3;
                    $("#idTemp").text(temperatura.slice(0,2));
                    $("#idHumedad").text(humedad.slice(0,2));
                    $("#idPresion").text(presion.slice(0,4));
                    
                    console.log("Temperatura: " + data.field1);
                    console.log("Humedad: " + data.field2);
                    console.log("Presion: " + data.field3);
                })

                .error(function () {
                     
                      console.log("Error comunicacion");
                });  
        
        //Corriente
        
        $.getJSON('http://api.thingspeak.com/channels/267256/feeds/last.json?api_key=0C2M9I6C2LOH21AI')
                //, function (vj) {
                .done(function (data) {
                    
                   
                    corriente=data.field1;
            
                    if(data.field1 <= 6.0 )
                         $("#idCorriente").text(data.field1).removeClass("blink blink_500").css("color","yellowgreen");
                    else if (data.field1 >= 6.0 && data.field1 <= 10.0 )
                         $("#idCorriente").text(data.field1)
                                          .addClass("blink")
                                          .css("color","yellow");
                    else
                         $("#idCorriente").text(data.field1)
                                          .addClass("blink_500")
                                          .css("color","coral");;  
                    
                    console.log("Corriente: " + data.field1);
                   
                })

                .error(function () {
                     
                      console.log("Error comunicacion");
                });  
        
        
        
        console.log("reloj: "+strHora);
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        
        console.log('Received Event: ' + id);
    }
};

