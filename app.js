const express = require('express');
const fs = require('fs');
const path = require('path');
const methodOverride = require('method-override');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    fs.readdir('./posts', (err, files) => {
        if (err) {
            return res.status(500).send('Error reading posts directory.');
        }

        const posts = files.map(file => {
            const content = fs.readFileSync(path.join(__dirname, 'posts', file), 'utf8');
            const title = content.split('\n')[0].replace('Title: ', '');
            const id = path.basename(file, '.txt');
            return { title, id };
        });

        res.render('index', { posts });
    });
});

app.get('/post/:id', (req, res) => {
    const postId = req.params.id;
    const filePath = path.join(__dirname, 'posts', `${postId}.txt`);

    fs.readFile(filePath, 'utf8', (err, content) => {
        if (err) {
            return res.status(404).send('Post not found');
        }

        const lines = content.split('\n');
        const title = lines[0].replace('Title: ', '');
        const date = lines[1].replace('Date: ', '');
        const body = lines.slice(2).join('\n');

        res.render('post', { title, date, body });
    });
});

app.post('/post', (req, res) => {
    const { title, date, body } = req.body;
    
    if (!title || !date || !body) {
        return res.status(400).send('Title, date, and body are required.');
    }

    const postId = title.toLowerCase().replace(/ /g, '-');
    const filePath = path.join(__dirname, 'posts', `${postId}.txt`);
    
    const content = `Title: ${title}\nDate: ${date}\n${body}`;
    
    fs.writeFile(filePath, content, err => {
        if (err) {
            return res.status(500).send('Error creating post.');
        }
        
        res.status(201).redirect('/');
    });
});

if (process.env.NODE_ENV !== 'test') {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}

module.exports = app;
