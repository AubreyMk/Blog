const express = require('express');
const path = require('path');
const fileupload = require('express-fileupload');

let initial_path = path.join(__dirname, "public");

const app = express();
app.use(express.static(initial_path));
app.use(fileupload());

app.get('/editor', (req, res) => {
    res.sendFile(path.join(initial_path, "editor.html"));
});

app.get('/', (req, res) => {
    res.sendFile(path.join(initial_path, "home.html"));
});

app.get("/:blog", (req, res) => {
    res.sendFile(path.join(initial_path, "blog.html"));
});

app.post('/upload', (req, res) => {
    if (req.files && req.files.image) {
        let file = req.files.image;
        let date = new Date();
        // image name
        let imagename = date.getDate() + date.getTime() + file.name;
        // image upload path
        let uploadPath = path.join('public/uploads', imagename);

        // create upload
        file.mv(uploadPath, (err) => {
            if (err) {
                return res.status(500).json({ success: false, message: 'File upload failed', error: err });
            }
            // return the image path
            res.json({ success: true, url: `uploads/${imagename}` });
        });
    } else {
        res.status(400).json({ success: false, message: 'No file uploaded' });
    }
});

const server = app.listen(3000, function() {
    console.log(new Date().toISOString() + ": server started on port 3000");
});

app.use((req, res) => {
    res.status(404).json({ success: false, message: "404 Not Found" });
});
