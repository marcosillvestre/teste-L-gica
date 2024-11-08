import axios from "axios";
import csv from 'csv-parser';
import { Router } from "express";
import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from "url";
import { v4 } from 'uuid';


export const routes = new Router()
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename)

function WriteFile(data) {

    const FileData = fs.createWriteStream(
        path.join(__dirname, "..", "test.csv")
    )
    FileData.write("id;uid;type;rh_factor;group\n")

    for (let index = 0; index < data.length; index++) {
        const element = data[index];
        const { id, uid, type, rh_factor, group } = element

        FileData.write(`${id};${uid};${type};${rh_factor};${group}\n`)
    }

    FileData.end()
}

async function ReadFile() {
    if (!fs.existsSync(path.join(__dirname, "..", "test.csv"))) return "error"

    const json = [];
    const data = new Promise((resolve, reject) => {
        fs.createReadStream(path.join(__dirname, "..", "test.csv"))
            .pipe(csv({ separator: ";" }))
            .on("data", (data) => json.push(data))
            .on("end", () => {
                resolve(json)
            })
            .on('error', (err) => {
                reject(err)
            })

    })

    return await data
}


routes.get("/random", async (req, res) => {
    const { size } = req.query

    try {
        const { data } = await axios.get(`https://random-data-api.com/api/v2/blood_types?size=${size}`)

        return res.status(200).json(data)
    } catch (error) {
        return res.status(500).json({ mssage: "Somenthing went wrong" })
    }
})


routes.get("/csv", async (req, res) => {

    const { key, value } = req.query


    try {
        const csvData = await ReadFile()


        if (value === "") {
            return res.status(200).json(csvData)
        }

        const json = []
        for (let index = 0; index < csvData.length; index++) {
            const element = csvData[index];

            if (element[key].toLowerCase().includes(value.toLowerCase())) {
                json.push(element)
                continue
            }

        }

        const data = await json
        return res.status(201).json(data)

    } catch (error) {
        console.log(error)
        return res.status(500).json({ mssage: "File not write" })

    }
})

routes.post("/random", async (req, res) => {
    const { size } = req.query
    try {

        const { data } = await axios.get(`https://random-data-api.com/api/v2/blood_types?size=${size}`)


        await WriteFile(data)

        return res.status(201).json({ message: "done" })

    } catch (error) {
        return res.status(500).json({ mssage: "File not write" })

    }


})

routes.post("/register", async (req, res) => {
    const { type, rh_factor, group } = req.body

    const csvData = await ReadFile()
    const id = v4()

    const newRegister = csvData.concat(
        { id: id.slice(0, 4), uuid: id, type, rh_factor, group }
    )

    try {
        await WriteFile(newRegister)
        return res.status(201).json({ message: "done" })
    } catch (error) {
        return res.status(500).json({ mssage: "File not write" })

    }
})

routes.post("/edit", async (req, res) => {
    const { id, type, rh_factor, group } = req.body

    const csvData = await ReadFile()
    const json = []

    for (let index = 0; index < csvData.length; index++) {
        const element = csvData[index];

        if (element.id === id) {
            element["type"] = type
            element["rh_factor"] = rh_factor
            element["group"] = group
        }

        json.push(element)
    }

    try {
        await WriteFile(json)
        return res.status(201).json({ message: "done" })
    } catch (error) {
        return res.status(500).json({ mssage: "File not write" })

    }



})


routes.delete("/delete", async (req, res) => {
    const { id } = req.query


    const json = [];
    fs.createReadStream(path.join(__dirname, "..", "test.csv"))
        .pipe(csv({ separator: ";" }))
        .on("data", (data) => {
            if (data.id !== id) json.push(data)
        })
        .on("end", () => {

            const FileData = fs.createWriteStream(
                path.join(__dirname, "..", "test.csv")
            )
            FileData.write("id;uid;type;rh_factor;group\n")

            for (let index = 0; index < json.length; index++) {
                const element = json[index];
                const { id, uid, type, rh_factor, group } = element

                FileData.write(`${id};${uid};${type};${rh_factor};${group}\n`)
            }

            FileData.end()

            return res.status(201).json({ message: "done" })

        })

})

