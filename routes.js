import axios from "axios";
import csv from 'csv-parser';
import { Router } from "express";
import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from "url";

export const routes = new Router()
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename)

routes.get("/random", async (req, res) => {
    const { size } = req.query

    try {
        const { data } = await axios.get(`https://random-data-api.com/api/v2/blood_types?size=${size}`)

        console.log(data)
        return res.status(200).json(data)
    } catch (error) {
        return res.status(500).json({ mssage: "Somenthing went wrong" })
    }
})


routes.get("/read", async (req, res) => {
    try {


        const json = [];
        // const FileData =
        fs.createReadStream(path.join(__dirname, "test.csv"))
            .pipe(csv({ separator: ";" }))
            .on("data", (data) => json.push(data))
            .on("end", () => console.log(json))


        // const readableFile = new Readable()
        // readableFile.push(FileData);
        // readableFile.push(null);



        // console.log(liner)

        // csv({ delimiter: ";" })
        //     .fromStream(FileData)
        //     .subscribe(
        //         (jsonObj) => {
        //             console.log(jsonObj)
        //             // const oj = JSON.parse(jsonObj)

        //             // const liner = readLine.createInterface({
        //             //     input: jsonObj,
        //             // })
        //             // console.log(oj)
        //         },
        //         (err) => console.error(err),
        //         () => console.log("Complete")
        //     )

        return res.status(200).json(json)
    } catch (error) {
        console.log(error)
        return res.status(500).json({ mssage: "There's no file yet" })
    }

})

routes.post("/random", async (req, res) => {
    const { size } = req.query
    try {

        const { data } = await axios.get(`https://random-data-api.com/api/v2/blood_types?size=${size}`)


        const FileData = fs.createWriteStream(
            path.join(__dirname, "test.csv")
        )
        FileData.write("id;uid;type;rh_factor;group\n")

        for (let index = 0; index < data.length; index++) {
            const element = data[index];
            const { id, uid, type, rh_factor, group } = element

            FileData.write(`${id};${uid};${type};${rh_factor};${group}\n`)
        }

        FileData.end()

        return res.status(201).json({ data })

    } catch (error) {
        return res.status(500).json({ mssage: "File not write" })

    }


})

routes.post("/register", async (req, res) => {
    const { type, rh_factor, group } = req.body




})