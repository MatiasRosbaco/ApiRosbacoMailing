const sgMail = require("@sendgrid/mail");
let fs = require("fs");
let path = require("path");
let creds = JSON.parse(
  fs
    .readFileSync(path.resolve(__dirname, "../salesforce-creds.json"))
    .toString()
);
var jsforce1 = require("../jsforce.js");
sgMail.setApiKey(process.env.SendGridKey); // cambiar a variable de ambiente

const controllers = {
  sendMail: async (req, res) => {
    let respuesta;
    console.log(req.query);
    let idProyecto = req.query.idProyecto;
    let objetos = await jsforce1.connection(idProyecto);
    let proyecto = objetos.proyectoObj.records[0];
    console.log(proyecto);
    console.log(objetos.estadosObj);
    try {
      const messages = objetos.estadosObj.records.map((estado) => {
        let saldoPesos;
        let importeCac;
        let importeDiferencia;
        let importeDolares;
        let saldoDolares;
        let textoPesos;
        let textoDolares;

        console.log(proyecto.Numero_de_cuenta_dolares__c);
        if (estado.Tipo_de_plan__c == "Pesos") {
          if (estado.Saldo_a_cobrar_en_pesos__c == undefined) {
            saldoPesos = 0;
            importeCac = 0;
            importeDiferencia = 0;
          } else {
            saldoPesos = estado.Saldo_a_cobrar_en_pesos__c;
            importeCac = estado.Importe_mas_cac_aid__c;
            importeDiferencia = estado.Importe_diferencia_de_indice__c;
          }
          return textoPesos;
        }
        if (estado.Tipo_de_plan__c == "Dolar") {
          if (estado.Saldo_a_cobrar_en_dolares__c == undefined) {
            saldoDolares = 0;
            importeDolares = 0;
          } else {
            saldoDolares = estado.Saldo_a_cobrar_en_dolares__c;
            importeDolares = estado.Importe_en_dolares__c;
          }

          return textoDolares;
        }

        textoPesos = {
          to: [
            estado.Email_propietario_1__c,
            estado.Email_propietario_2__c,
            estado.Email_propietario_3__c,
            "comunidad.rosbaco@gmail.com",
          ],
          from: "clientes@rosbacopartners.com",
          subject: "Informacion de saldos " + estado.Nombre_unidad__c + "",
          text:
            "Estimado/a " +
            estado.Nombre_propietario__c +
            "Le informamos que al dia de la fecha" +
            estado.Fecha__c +
            "el monto a abonar por la compra de la Unidad de referencia esta compuesto por:" +
            "1) La suma de $ " +
            saldoPesos +
            " correspondiente a la " +
            Plan_de_pago_en_pesos__c +
            "de su plan de pagos;" +
            " La cuenta habilitada a fin de realizar correctamente su/s pago/s es la siguiente: " +
            "- Razón social:" +
            proyecto.Razon_social__c +
            "- Cuit: " +
            proyecto.Cuit__c +
            "- Banco:" +
            proyecto.Banco__c +
            "- Cuenta en pesos: - CBU: " +
            proyecto.Cbu_pesos__c +
            "- Alias:" +
            proyecto.Alias_pesos__c +
            "- Número de cuenta:" +
            proyecto.Numero_de_cuenta_pesos__c +
            "Recuerde que, atento a las disposiciones vigentes (art.1° Ley 25.345 y cctes.), todos los pagos superiores a $ 1.000 deberán ser realizados mediante transferencia y/o depósito bancario.Una vez que haya podido realizar el pago de la/s suma/s indicada/s, le solicitamos tenga a bien responder a este mismo correo, adjuntando el/los correspondiente/s comprobante/s para su correcta imputación." +
            "Nota:" +
            "(*) Para consultas dirigirse al correo nathalie.lossada@rosbacopartners.com.  " +
            "(**) La cuota en pesos se encuentra calculada en base al índice CAC provisorio a la fecha " +
            estado.Fecha__c +
            ", con más los ajustes por corrección de índice de los meses anteriores. A los fines de su cálculo se ha realizado la siguiente operación:" +
            "C = CB * (IB / IP) + CID" +
            "Cuyas referencias son:" +
            "C: Cuota" +
            "CB: Cuota Base, pactada en su Boleto de Compraventa." +
            "IB: Índice Base, según Boleto de Compraventa (conocido a la fecha de firma del Boleto)." +
            "IP: Índice provisorio conocido a la fecha." +
            "CID: Corrección por índice definitivo." +
            "Se debe tener en cuenta que a la fecha LA PARTE VENDEDORA no cuenta con el índice CAC oficial definitivo del mes correspondiente al vencimiento de su cuota, sino con el determinado dos meses antes. Por tal motivo se utiliza un índice provisorio para el cálculo de la cuota del mes y se le adiciona el ajuste por corrección de índice definitivo de las cuotas anteriores (las cuales también fueron liquidadas con índices provisorios)" +
            "Quedamos a disposición por cualquier inquietud." +
            "Atentos saludos," +
            "Equipo de Comunidad" +
            "Rosbaco & Partners" +
            "Contacto: (011) 15-5613-1675",
          html:
            "<p>Estimado/a " +
            estado.Nombre_propietario__c +
            "," +
            "<br>Le informamos que al dia de la fecha" +
            estado.Fecha__c +
            "," +
            "el monto a abonar por la compra de la Unidad de referencia esta compuesto por: " +
            "<br><br>1) La suma de $ " +
            saldoPesos +
            " correspondiente a la " +
            Plan_de_pago_en_pesos__c +
            " de su plan de pagos;" +
            "<br><br>La cuenta habilitada a fin de realizar correctamente su/s pago/s es la siguiente: " +
            "<br>- Razón social:" +
            proyecto.Razon_social__c +
            "<br>- Cuit: " +
            proyecto.Cuit__c +
            "<br>- Banco:" +
            proyecto.Banco__c +
            "<br>- Cuenta en pesos: - CBU: " +
            proyecto.Cbu_pesos__c +
            "<br>- Alias:" +
            proyecto.Alias_pesos__c +
            "<br>- Número de cuenta:" +
            proyecto.Numero_de_cuenta_pesos__c +
            "<br><br>Recuerde que, atento a las disposiciones vigentes (art.1° Ley 25.345 y cctes.), todos los pagos superiores a $ 1.000 deberán ser realizados mediante transferencia y/o depósito bancario.Una vez que haya podido realizar el pago de la/s suma/s indicada/s, le solicitamos tenga a bien responder a este mismo correo, adjuntando el/los correspondiente/s comprobante/s para su correcta imputación." +
            "<br><br>Nota:" +
            "<br><br>(*) Para consultas dirigirse al correo nathalie.lossada@rosbacopartners.com.  " +
            "<br><br>(**) La cuota en pesos se encuentra calculada en base al índice CAC provisorio a la fecha " +
            estado.Fecha__c +
            ", con más los ajustes por corrección de índice de los meses anteriores. A los fines de su cálculo se ha realizado la siguiente operación:" +
            "<br><br>C = CB * (IB / IP) + CID" +
            "<br>Cuyas referencias son:" +
            "<br><br>C: Cuota" +
            "<br>CB: Cuota Base, pactada en su Boleto de Compraventa." +
            "<br>IB: Índice Base, según Boleto de Compraventa (conocido a la fecha de firma del Boleto)." +
            "<br>IP: Índice provisorio conocido a la fecha." +
            "<br>CID: Corrección por índice definitivo." +
            "<br><br>Se debe tener en cuenta que a la fecha LA PARTE VENDEDORA no cuenta con el índice CAC oficial definitivo del mes correspondiente al vencimiento de su cuota, sino con el determinado dos meses antes. Por tal motivo se utiliza un índice provisorio para el cálculo de la cuota del mes y se le adiciona el ajuste por corrección de índice definitivo de las cuotas anteriores (las cuales también fueron liquidadas con índices provisorios)" +
            "<br><br>Quedamos a disposición por cualquier inquietud." +
            "<br><br>Atentos saludos," +
            "<br>Equipo de Comunidad" +
            "<br>Rosbaco & Partners" +
            "<br>Contacto: (011) 15-5613-1675</p>",
        };
        textoDolares = {
          to: [
            estado.Email_propietario_1__c,
            estado.Email_propietario_2__c,
            estado.Email_propietario_3__c,
          ],
          from: "clientes@rosbacopartners.com",
          subject: "Informacion de saldos " + estado.nombre_unidad__c + "",
          text:
            "Estimado/a " +
            estado.nombre_propietario__c +
            "Le informamos que al dia de la fecha " +
            estado.fecha__c +
            "el monto a abonar por la compra de la Unidad de referencia esta compuesta por: " +
            "La Suma de USD " +
            saldoDolares +
            "correspondiente a la " +
            Plan_de_pago_en_dolares__c +
            " de su plan de pagos;" +
            "La cuenta habilitada a fin de realizar correctamente su/s pago/s es la siguiente:" +
            "Datos de la cuenta bancaria:" +
            "- Razón social:" +
            proyecto.razon_social__c +
            "- Cuit: " +
            proyecto.cuit__c +
            "- Banco:" +
            proyecto.banco__c +
            "- Cuenta en dolares: - CBU: " +
            proyecto.cbu_dolares__c +
            "- Alias:" +
            proyecto.alias_dolares__c +
            "- Número de cuenta:" +
            proyecto.numero_de_cuenta_dolares__c +
            "Recuerde que, atento a las disposiciones vigentes (art.1° Ley 25.345 y cctes.), todos los pagos superiores a $ 1.000 deberán ser realizados mediante transferencia y/o depósito bancario.Una vez que haya podido realizar el pago de la/s suma/s indicada/s, le solicitamos tenga a bien responder a este mismo correo, adjuntando el/los correspondiente/s comprobante/s para su correcta imputación." +
            "Nota:" +
            "(*) Para consultas dirigirse al correo nathalie.lossada@rosbacopartners.com.  " +
            "Quedamos a disposición por cualquier inquietud." +
            "Atentos saludos," +
            "Equipo de Comunidad" +
            "Rosbaco & Partners" +
            "Contacto: (011) 15-5613-1675",
          html:
            "<p>Estimado/a " +
            estado.nombre_propietario__c +
            "<br>Le informamos que al dia de la fecha " +
            estado.fecha__c +
            "el monto a abonar por la compra de la Unidad de referencia esta compuesta por: " +
            "<br><br>La Suma de USD " +
            saldoDolares +
            "correspondiente a la " +
            Plan_de_pago_en_dolares__c +
            " de su plan de pagos;" +
            "<br>La cuenta habilitada a fin de realizar correctamente su/s pago/s es la siguiente:" +
            "<br><br>Datos de la cuenta bancaria:" +
            "<br>- Razón social:" +
            proyecto.razon_social__c +
            "<br>- Cuit: " +
            proyecto.cuit__c +
            "<br>- Banco:" +
            proyecto.banco__c +
            "<br>- Cuenta en dolares:" +
            "<br><br>- CBU: " +
            proyecto.cbu_dolares__c +
            "<br>- Alias:" +
            proyecto.alias_dolares__c +
            "<br>- Número de cuenta:" +
            proyecto.numero_de_cuenta_dolares__c +
            "<br><br>Recuerde que, atento a las disposiciones vigentes (art.1° Ley 25.345 y cctes.), todos los pagos superiores a $ 1.000 deberán ser realizados mediante transferencia y/o depósito bancario.Una vez que haya podido realizar el pago de la/s suma/s indicada/s, le solicitamos tenga a bien responder a este mismo correo, adjuntando el/los correspondiente/s comprobante/s para su correcta imputación." +
            "<br><br>Nota:" +
            "<br>(*) Para consultas dirigirse al correo nathalie.lossada@rosbacopartners.com.  " +
            "<br>Quedamos a disposición por cualquier inquietud." +
            "<br><br>Atentos saludos," +
            "<br>Equipo de Comunidad" +
            "<br>Rosbaco & Partners" +
            "<br>Contacto: (011) 15-5613-1675 </p>",
        };
      });

      await sgMail
        .send(messages)
        .then(() => {
          console.log("Emails enviados");
          respuesta = {
            meta: {
              status: 200,
              data: {
                estadosID: objetos.estadosObj.records.map((estado) => {
                  return estado.nombre_unidad__c;
                }),
              },
            },
          };
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.error(error);
      respuesta = {
        meta: {
          status: 400,
        },
      };
      throw error;
    }
    res.json(respuesta);
  },
};

module.exports = controllers;
