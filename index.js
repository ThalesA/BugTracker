const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const { promisify } = require('util');
const sgMail = require('@sendgrid/mail');

const GoogleSpreadsheet = require('google-spreadsheet');
const credentials = require('./bugtracker.json');

const docId = '11JkGZ8799TTsqucyQAAv0OFrzZxtKeQnigACxd2x4H4'
const worksheetIndex = 0
const sendGrid = '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'

app.set('view engine', 'ejs');
app.set('views', path.resolve(__dirname, 'views'));

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (request, response) => {
    response.render('home'); 
});

app.post('/', async(request, response) => {
    try {
        const doc = new GoogleSpreadsheet(docId);
        await promisify(doc.useServiceAccountAuth)(credentials)
        const info = await promisify(doc.getInfo)()
        const worksheet = info.worksheets[worksheetIndex]
        await promisify(worksheet.addRow)({
                        name: request.body.name, 
                        email: request.body.email, 
                        issueType:request.body.issueType,
                        source: request.query.source || 'direct', 
                        howToReproduce: request.body.howToReproduce, 
                        expectedOuput:request.body.expectedOuput, 
                        receivedOuput: request.body.receivedOuput,
                        userAgent: request.body.userAgent,
                        userDate: request.body.userDate
                    })

        //se for critico
        if (request.body.issueType === 'CRITICAL') {
            sgMail.setApiKey(sendGrid);
            const msg = {
                to: 'thales.assis08@gmail.com',
                from: 'thales.assis08@gmail.com',
                subject: 'BUG Critico reportado',
                text: `O usuário ${request.body.name} reportou um problema.`,
                html: `O usuário ${request.body.name} reportou um problema.`,
            };
            await sgMail.send(msg);
        }
        
        response.render('sucesso')
    } catch (err) {
        response.send('Erro ao enviar formulário.')
        console.log(err)
    }
    
})

app.listen(3000, (err) => {
    if (err) {
        console.log('Aconteceu um erro', err);
    } else {
        console.log('BugTracker rodando na porta http://localhost:3000');
    }
});