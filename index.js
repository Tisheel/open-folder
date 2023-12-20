const dotenv = require('dotenv')
const express = require('express')
const path = require('path')
const fileUpload = require('express-fileupload')
const fs = require('fs');

dotenv.config()
const app = express()

const { PORT } = process.env

// middlewares
app.use(express.json())
app.use(express.static('public'))
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/'
}))

// routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'home.html'))
})

app.post('/upload', (req, res) => {

    const { files } = req.files

    if (files === null) {
        return res.json({
            message: 'No File.'
        })
    }

    files.mv(path.join(__dirname, 'uploads', files.name), (err) => {
        if (err) {
            console.log(err)
            res.json({
                message: 'Somthing went wrong.'
            })
            return
        }
    })

    res.redirect('/')

})

app.get('/files', (req, res) => {

    fs.readdir(path.join(__dirname, 'uploads'), (err, files) => {

        if (err) {
            return res.json({
                message: 'Somthing went wrong.'
            })
        }

        res.json(files)

    })

})

app.get('/delete/file/:name', (req, res) => {
    const { name } = req.params
    fs.unlinkSync(path.join(__dirname, 'uploads', name))
    res.redirect('/')
})

app.get('/file/:name', (req, res) => {
    const { name } = req.params
    res.sendFile(path.join(__dirname, 'uploads', name))
})

app.listen(PORT, () => {
    console.log(`Server running on PORT: ${PORT}`)
})