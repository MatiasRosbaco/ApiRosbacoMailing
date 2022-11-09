const sgMail = require('@sendgrid/mail');
let fs = require('fs');
let path = require('path');
let creds = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../salesforce-creds.json')).toString());
var jsforce1 = require('../jsforce.js');
sgMail.setApiKey(creds.sendgridApi);// cambiar a variable de ambiente


const controllers={
    sendMail:async(req,res) => {
        let respuesta;
        console.log(req.query);
        let idProyecto = req.query.idProyecto;
        let objetos = await jsforce1.connection(idProyecto);
        let proyecto = objetos.proyectoObj.records;
        console.log(proyecto);
        console.log(objetos);
        try{
            const messages = objetos.estadosObj.records.map((estado)=>{
                let saldoPesos;
                let saldoDolares;
                if(estado.Saldo_a_cobrar_en_pesos__c == undefined){
                    saldoPesos = 0;
                }else{
                    saldoPesos = estado.Saldo_a_cobrar_en_pesos__c
                }
                if(estado.Saldo_a_cobrar_en_dolares__c == undefined){
                    saldoDolares = 0;
                }else{
                    saldoDolares = estado.Saldo_a_cobrar_en_dolares__c
                }
                return{
                    to: [estado.Email_propietario_1__c,estado.Email_propietario_2__c,estado.Email_propietario_3__c],
                    from: 'clientes@rosbacopartners.com',
                    subject: 'Informacion de saldos '+estado.nombre_unidad__c+'',
                    text: 'Estimado/a '+estado.nombre_propietario__c+',Le informamos que el saldo a abonar por precio (*) hasta el día '+estado.fecha__c+', correspondiente al boleto de compraventa de referencia, asciende a la suma de PESOS '+saldoPesos+' y suma en DOLARES '+saldoDolares+'En cumplimiento con las disposiciones legales vigentes, todos los pagos en pesos correspondientes al pago del precio de tu boleto de compraventa, corresponderá realizarse vía transferencia o vía depósito bancario a la cuenta debajo detallada, sin excepción, con posterior envío de comprobante de pago por este medio  Datos de la cuenta bancaria: - Razón social:'+proyecto.razon_social__c+'   - CUIT: '+proyecto.cuit__c+'  - Banco:'+proyecto.banco__c+'   Cuenta en pesos: - CBU: '+proyecto.cbu_pesos__c+' - Alias:'+proyecto.alias_pesos__c+' - Número de cuenta:'+proyecto.numero_de_cuenta_pesos__c+' Cuenta en dolares: - CBU: '+proyecto.cbu_dolares__c+' - Alias:'+proyecto.alias_dolares__c+' - Número de cuenta:'+proyecto.numero_de_cuenta_dolares__c+' Nos mantenemos a disposición en caso de dudas o consultas por los medios habituales.  Notas:  (*) El saldo informado no incluye intereses punitorios por deudas anteriores. En caso de corresponder aplicación de intereses, estos serán informados una vez cancelada la deuda. Como siempre, a disposición. Saludamos atentamente  Equipo de Comunidad Rosbaco & Partners Contacto: (011) 15-5613-1675 ',
                    html: '<p>Estimado/a '+estado.nombre_propietario__c+'<br>,Le informamos que el saldo a abonar por precio (*) hasta el día '+estado.fecha__c+', correspondiente al boleto de compraventa de referencia, asciende a la suma de PESOS '+saldoPesos+' y suma en DOLARES '+saldoDolares+'<br> En cumplimiento con las disposiciones legales vigentes, todos los pagos en pesos correspondientes al pago del precio de tu boleto de compraventa, corresponderá realizarse vía transferencia o vía depósito bancario a la cuenta debajo detallada, sin excepción, con posterior envío de comprobante de pago por este medio:<br>  Datos de la cuenta bancaria: <br> -Razón social:  '+proyecto.razon_social__c+'   <br>-CUIT: '+proyecto.cuit__c+'  <br> -Banco: '+proyecto.banco__c+'  <br> Cuenta en pesos: <br> -CBU: '+proyecto.cbu_pesos__c+' <br> -Alias: '+proyecto.alias_pesos__c+' <br> -Número de cuenta: '+proyecto.numero_de_cuenta_pesos__c+' <br> Cuenta en dolares: <br> - CBU: '+proyecto.cbu_dolares__c+' <br> - Alias:'+proyecto.alias_dolares__c+' <br> - Número de cuenta:'+proyecto.numero_de_cuenta_dolares__c+'<br> Nos mantenemos a disposición en caso de dudas o consultas por los medios habituales.  <br>Notas:  (*) El saldo informado no incluye intereses punitorios por deudas anteriores. En caso de corresponder aplicación de intereses, estos serán informados una vez cancelada la deuda. <br>Como siempre, a disposición. <br> Saludamos atentamente  <br> Equipo de Comunidad <br>Rosbaco & Partners <br>Contacto: <br>(011) 15-5613-1675 </p>', 
                }
            })
        
        await sgMail.send(messages).then(()=>{
            console.log('Emails enviados');
            respuesta = {
                meta: {
                    status: 200,
                }
            }
        }).catch(error =>{
            console.log(error);
        })
    }catch(error){
        console.error(error)
                respuesta = {
                    meta: {
                        status: 400,
                    }
                }
        throw error;
    }
    res.json(respuesta);
    }
}

module.exports = controllers;