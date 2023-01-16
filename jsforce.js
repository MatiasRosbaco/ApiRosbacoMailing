var jsforce = require('jsforce');
var fs = require('fs');
var path = require('path');
let creds = JSON.parse(fs.readFileSync(path.resolve(__dirname, './salesforce-creds.json')).toString());
const controller = {
    connection: async function(idProyecto){
        const today = new Date();
        let month = today.getMonth() + 1;
            var conn = new jsforce.Connection({
                loginUrl: creds.url
            });
            try {
                await conn.login(creds.username, creds.password+creds.securityToken);//cambiar a ouath y variable de ambiente
                console.log('Connected to Salesforce!');
                //creds.accessToken = conn.accessToken;
                //creds.instanceUrl = conn.instanceUrl;
                //console.log(creds.accessToken);
                //console.log(creds.instanceUrl);
                // now you can use conn to read/write data...
                let soqlProyecto = "SELECT 	Banco__c,Razon_social__c,Numero_de_cuenta_pesos__c,alias_pesos__c,cbu_pesos__c, Cuit__c, numero_de_cuenta_dolares__c,cbu_dolares__c,alias_dolares__c FROM obra__c WHERE id = '"+ idProyecto + "'LIMIT 1";
                var proyecto = await conn.query(soqlProyecto);
                let soqlUnidad = "SELECT id FROM unidad__c WHERE obra__c = '"+ idProyecto +"'";
                let unidades = await conn.query(soqlUnidad);
                let idUnidades = unidades.records.map((unidad => {
                    return unidad.Id;
                }));
                let soqlEstados = "SELECT Importe_diferencia_de_indice__c,Importe_mas_cac_aid__c,Importe_en_dolares__c,fecha__c,Nombre_propietario__c,Nombre_unidad__c,Email_propietario_1__c,Email_propietario_2__c,Email_propietario_3__c,Saldo_a_cobrar_en_dolares__c,Saldo_a_cobrar_en_pesos__c FROM estado_de_cuentas__c WHERE unidad__c IN ('" + idUnidades.join("','") + "') " + "AND mes__c = "+month+" LIMIT 200";
                var estados = await conn.query(soqlEstados);
                console.log(estados);
                await conn.logout();
                console.log('connection logged out');
            } catch (err) { 
                console.error(err);
            }
            return objetos = {
                estadosObj:estados,
                proyectoObj:proyecto
            };
    },
    getEstados: async()=>{

    }
}

module.exports = controller;