const dotenv = require('dotenv')
const express = require('express')
const path = require('path')
const { ref, uploadBytes, listAll, getDownloadURL, deleteObject } = require("firebase/storage")
const { storage } = require('./config')
const multer = require("multer")
const upload = multer({ storage: multer.memoryStorage() })

dotenv.config()
const app = express()

const { PORT } = process.env

// middlewares
app.use(express.json())
app.use(express.static('public'))

// routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'home.html'))
})

app.post('/upload', upload.array("files"), async (req, res) => {

    try {

        const files = req.files

        if (files.length === 0) {
            return res.json({
                message: 'No File.'
            })
        }

        for (let file of files) {

            const storageRef = ref(storage, file.originalname)
            const uploadTask = await uploadBytes(storageRef, file.buffer, { contentType: file.mimetype })

        }

        res.json({ message: 'ok' })

    } catch (error) {

        console.log(error)
        res.status(500).json({
            message: 'Somthing went wrong'
        })

    }

})

app.get('/all', async (req, res) => {

    try {

        const reference = ref(storage)
        const list = await listAll(reference)

        let files = []

        for (let item of list.items) {
            const fileRef = ref(storage, item.fullPath)
            const download = await getDownloadURL(fileRef)
            files.push({ filename: item.name, download })
        }

        res.status(200).json(files)

    } catch (error) {

        console.log(error)
        res.status(500).json({
            message: 'Somthing went wrong'
        })

    }

})

// delete all files
const deleteAllFiles = async () => {

    try {

        const reference = ref(storage)
        const list = await listAll(reference)

        for (let item of list.items) {
            const fileRef = ref(storage, item.fullPath)
            await deleteObject(fileRef)
        }

        console.log('Clean Up: ' + new Date.now())

    } catch (error) {
        console.log(error)
    }

}

// delete file every 24 hours
setInterval(deleteAllFiles, 86400000)

app.listen(PORT, () => {
    console.log(`Server running on PORT: ${PORT}`)
})