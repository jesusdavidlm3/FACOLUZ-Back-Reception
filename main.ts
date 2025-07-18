import express from "npm:express@4.18.2";
import cors from 'npm:cors'
import jwt from 'npm:jsonwebtoken'
import * as db from './dbConnection.ts'
import * as tokenVerification from './tokenVerification.ts'
import "jsr:@std/dotenv/load";

const port = Deno.env.get("PORT")
const secret = Deno.env.get("SECRET")

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.post('/api/login', async (req, res) => {
	const {passwordHash} = req.body
	let dbResponse
	try{
		dbResponse = await db.login(req.body)
		if(dbResponse.length == 0){
			res.status(404).send('Usuario no encontrado')
		}else if(dbResponse[0].passwordSHA256 != passwordHash){
			res.status(401).send('Contraseña Incorrecta')
		}else if(dbResponse[0].active == false){
			res.status(404).send('Este usuario se encuentra inactivo')
		}else if(dbResponse[0].type != 4){
			res.status(401).send('Usted no es personal de recepcion')
		}else{
			const token = jwt.sign({
				id: dbResponse[0].id,
				name: dbResponse[0].name,
				type: dbResponse[0].type,
				exp: Date.now() + 600000
			}, secret)
			res.status(200).send({...dbResponse[0], jwt: token})
		}
	}catch(err){
		console.log(err)
		res.status(500).send('error del servidor')
	}
})

app.get('/api/verifyPatient/:patientId', tokenVerification.forReception, async(req, res) => {
	const patientId = req.params.patientId;
	try{
		const dbResponse = await db.verifyPatient(patientId)
		console.log(dbResponse.length)
		if(dbResponse.length > 0){
			res.status(200).send(dbResponse)
		}else{
			res.status(404).send("El paciente no esta registrado")
		}
	}catch(err){
		console.log(err)
		res.status(500)
	}
})

app.post('/api/makeAdultHistory', tokenVerification.forReception, async(req, res) => {
	const data = req.body;
	try{
		const dbResponse = await db.makeAdultHistory(data)
		res.status(200).send(dbResponse)
	}catch(err){
		console.log(err)
		res.status(500).send(err)
	}
})

app.post('/api/makeChildHistory', tokenVerification.forReception, async(req, res) => {
	const data = req.body;
	console.log(data)
	try{
		const dbResponse = await db.makeChildHistory(data)
		console.log(dbResponse)
		res.status(200).send(dbResponse)
	}catch(err){
		console.log(err)
		res.status(500).send(err)
	}
})

app.post('/api/makeDate', tokenVerification.forReception, async(req, res) => {
	const data = req.body;
	try{	
		const dbResponse = await db.makeDate(data)
		res.status(200).send(dbResponse)
	}catch(err){
		console.log(err)
		res.status(500).send(err)
	}
})

app.get('/api/getDates', tokenVerification.forReception, async(req, res) => {
	try{
		const dbResponse = await db.getDates()
		res.status(200).send(dbResponse)
	}catch(err){
		console.log(err)
		res.status(500).send(err)
	}
})

app.get('/api/getDateByPatient/:patientId', tokenVerification.forReception, async(req, res) => {
	const patientId = req.params.patientId;
	try{
		const dbResponse = await db.getDatesByPatient(patientId)
		res.status(200).send(dbResponse)
	}catch(err){
		console.log(err)
		res.status(500).send(err)
	}
})

app.get('/api/getDateByDate/:date', tokenVerification.forReception, async(req, res) => {
	const date = req.params.date;
	try{
		const dbResponse = await db.getDateByDate(date)
		res.status(200).send(dbResponse)
	}catch(err){
		console.log(err)
		res.status(500).send(err)
	}
})

app.patch('/api/editDate', tokenVerification.forReception, async(req, res) => {
	const data = req.body;
	try{
		const dbResponse = await db.editDate(data)
		res.status(200).send(dbResponse)
	}catch(err){
		console.log(err)
		res.status(500).send(err)
	}
})

app.patch('/api/cancelDate/:dateId', tokenVerification.forReception, async(req, res) => {
	const dateId = req.params.dateId;
	try{
		const dbResponse = await db.cancelDate(dateId)
		res.status(200).send(dbResponse)
	}catch(err){
		console.log(err)
		res.status(500).send(err)
	}
})

app.get('/api/getStudentList', tokenVerification.forReception, async(req, res) => {
	try{
		const dbResponse = await db.getStudentList()
		res.status(200).send(dbResponse)
	}catch(err){
		console.log(err)
		res.status(500).send(err)
	}
})

app.listen(port, "0.0.0.0", () => {
	console.log(`Puerto: ${port}`)
})