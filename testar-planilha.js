const GoogleSpreadsheet = require('google-spreadsheet');
const credentials = require('./bugtracker.json');

/*const doc = new GoogleSpreadsheet('11JkGZ8799TTsqucyQAAv0OFrzZxtKeQnigACxd2x4H4');
doc.useServiceAccountAuth(credentials, (err) => {
    if (err) {
        console.log('não foi possivel abrir a planilha');
    } else {
        console.log('planilha aberta');
        doc.getInfo((err, info) => {
            const worksheet = info.worksheets[0]
            worksheet.addRow({ name: 'THales', email: 'thales@gmail.com'}, err => {
                console.log('inserido')
            })
        })
    }
})*/