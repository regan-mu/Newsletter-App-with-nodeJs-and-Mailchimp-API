const express = require('express');
const bodyParser = require('body-parser');
const client = require("@mailchimp/mailchimp_marketing");

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'))

client.setConfig({
    apiKey: "d355a5761cd74d7ae0fe8e5faff12afc-us6",
    server: "us6",
  });

app.get('/', (req, res) => {
    res.sendFile(`${__dirname}/signup.html`);
})

app.post('/', (req, res) => {
    // Parse the day from the submitted form
    const fname = req.body.fname;
    const lname = req.body.lname;
    const email = req.body.mail;
    const members = [{
        email_address: email,
        status: "subscribed",
        merge_fields: {
            FNAME: fname,
            LNAME: lname
        }
    }];  
    // Connect to Mailchimp 
    const run = async () => {
        // Handle Exceptions
        try {
            const response = await client.lists.batchListMembers("4e0b2f9100", {members: members,})
            res.sendFile(`${__dirname}/success.html`);
        }
        catch (err) {
            res.status(400).sendFile(`${__dirname}/failure.html`);
        }
    }
    run();
})

app.post('/failure', (req, res) => {
    res.redirect('/');
})

app.listen(process.env.PORT || port, ()=>{
    console.log('Listening on port ' + port);
} )
