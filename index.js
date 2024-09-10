const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

// Vzorová data pro anketu
let poll = {
    question: "Který předmět preferujete?",
    options: [
        { text: "Programování počítačů", votes: 0 },
        { text: "Počítačové sítě", votes: 0 },
        { text: "Anglický jazyk", votes: 0 },
        { text: "Tělesná výchova", votes: 0 }
    ]
};

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// HTML + CSS pro zobrazení ankety
const pollForm = `
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f9;
            color: #333;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
        }
        .container {
            background-color: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 15px rgba(0,0,0,0.1);
            text-align: center;
            max-width: 400px;
            width: 100%;
        }
        h1 {
            color: #333;
        }
        form {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
        }
        label {
            margin: 10px 0;
            font-size: 18px;
        }
        button {
            padding: 10px 20px;
            background-color: #007BFF;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            margin-top: 10px;
        }
        button:hover {
            background-color: #0056b3;
        }
        .results {
            margin-top: 20px;
        }
        .results ul {
            list-style-type: none;
            padding: 0;
        }
        .results ul li {
            background-color: #f9f9f9;
            padding: 10px;
            border-bottom: 1px solid #ddd;
        }
    </style>
    <div class="container">
        <h1>${poll.question}</h1>
        <form action="/vote" method="post">
            ${poll.options.map((option, index) => `
                <label>
                    <input type="radio" name="vote" value="${index}" id="option${index}">
                    ${option.text}
                </label>
            `).join('')}
            <button type="submit">Hlasovat</button>
        </form>
    </div>
`;

// Route pro zobrazení ankety
app.get('/', (req, res) => {
    res.send(`
        <html>
            <head><title>Anketa</title></head>
            <body>
                ${pollForm}
            </body>
        </html>
    `);
});

// Route pro zpracování hlasování
app.post('/vote', (req, res) => {
    const voteIndex = parseInt(req.body.vote);
    if (!isNaN(voteIndex) && poll.options[voteIndex]) {
        poll.options[voteIndex].votes++;
        res.send(`
            <html>
                <head><title>Výsledky ankety</title></head>
                <body>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            background-color: #f4f4f9;
                            color: #333;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            height: 100vh;
                            margin: 0;
                        }
                        .container {
                            background-color: #fff;
                            padding: 20px;
                            border-radius: 8px;
                            box-shadow: 0 0 15px rgba(0,0,0,0.1);
                            text-align: center;
                            max-width: 400px;
                            width: 100%;
                        }
                        h1 {
                            color: #333;
                        }
                        .results {
                            margin-top: 20px;
                        }
                        .results ul {
                            list-style-type: none;
                            padding: 0;
                        }
                        .results ul li {
                            background-color: #f9f9f9;
                            padding: 10px;
                            border-bottom: 1px solid #ddd;
                        }
                        a {
                            display: block;
                            margin-top: 20px;
                            color: #007BFF;
                            text-decoration: none;
                        }
                        a:hover {
                            text-decoration: underline;
                        }
                    </style>
                    <div class="container">
                        <h1>Děkujeme za hlas!</h1>
                        <div class="results">
                            <h2>Výsledky ankety:</h2>
                            <ul>
                                ${poll.options.map(option => `<li>${option.text}: ${option.votes} hlasů</li>`).join('')}
                            </ul>
                        </div>
                        <a href="/">Zpět na anketu</a>
                    </div>
                </body>
            </html>
        `);
    } else {
        res.send('Neplatná volba!');
    }
});

// Spuštění serveru
app.listen(port, () => {
    console.log(`Server běží na http://localhost:${port}`);
});