import mariadb from 'npm:mariadb'
import * as t from './interfaces.ts'
import "jsr:@std/dotenv/load";
import { toSqlDateTime } from "./functions.ts";

const db = mariadb.createPool({
	host: Deno.env.get("BDD_HOST"),
	user: Deno.env.get("BDD_USER"),
	password: Deno.env.get("BDD_PASSWORD"),
	database: Deno.env.get("BDD_DATABASE"),
	port: Number(Deno.env.get("BDD_PORT")),
	acquireTimeout: Number(Deno.env.get("BDD_TIMEOUT")),
	connectionLimit: Number(Deno.env.get("BDD_CONECTION_LIMITS"))
})

async function query(query: string, params?: object) {
	let connection
	try{
		connection = await db.getConnection()
		const res = await connection.query(query, params)
		return res
	}catch(err){
		console.log(err)
		throw err
	}finally{
		connection?.release()
	}
}

async function execute(query: string, params?: object) {
	let connection
	try{
		connection = await db.getConnection()
		const res = await connection.execute(query, params)
		return res
	}catch(err){
		console.log(err)
		throw err
	}finally{
		connection?.release()
	}
}

export async function login(data: t.loginData){
	const id = data.id
	const res = await query('SELECT * FROM users WHERE id = ?', [id])
	return res
}

export async function verifyPatient(patientId: number) {
	const res = await query('SELECT * FROM patients WHERE patientIdentificacion = ? OR patientCode = ?', [patientId, patientId])
	return res
}

export async function makeHistory(data: t.makeHistory) {
	const id = crypto.randomUUID()
	const rawNow = Date.now()
	const createPatient = toSqlDateTime(rawNow)
	const name = data.name
	const lastname = data.lastname
	const identificationType = data.identificationType
	const patientIdentification = data.patientIdentification
	const phone = data.phone
	const sex = data.sex
	const birthDate = toSqlDateTime(data.birthDate)
	const birthPlace = data.birthPlace
	const religion = data.religion
	const race = data.race
	const address = data.address
	const addressMunicipality = data.addressMunicipality
	const addressCity = data.addressCity
	const emergencyName = data.emergencyName
	const emergencyPhone = data.emergencyPhone
	const emergencyRelationship = data.emergencyRelationship
	const companionName = data.companionName
	const companionPhone = data.companionPhone
	const companionRelationship = data.companionRelationship
	const instructionGrade = data.instructionGrade
	const idStudent = data.idStudent

	console.log(idStudent)
	//Seleccionar una seccion segun el estudiante dado
	//segun la seccion encontrada seleccionar un docente
	//el docente seleccionado pasa a ser idTeacher
	const idTeacher = await query(`
		SELECT
			p.userId
		FROM clases AS c
		JOIN clases AS p ON p.role = 1 AND p.section = c.section AND p.asignature = c.asignature
		WHERE c.userId = ?
	`, [idStudent])

	const _res = await execute(`
		INSERT INTO patients(
			id,
			createPatient,
			name,
			lastname,
			identificationType,
			patientIdentificacion,
			phone,
			sex,
			birthDate,
			birthPlace,
			religion,
			race,
			address,
			addressMunicipality,
			addressCity,
			emergencyName,
			emergencyPhone,
			emergencyRelationship,
			companionName,
			companionPhone,
			companionRelationship,
			instructionGrade,
			idStudent,
			idTeacher
		) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
			id,
			createPatient,
			name,
			lastname,
			identificationType,
			patientIdentification,
			phone,
			sex,
			birthDate,
			birthPlace,
			religion,
			race,
			address,
			addressMunicipality,
			addressCity,
			emergencyName,
			emergencyPhone,
			emergencyRelationship,
			companionName,
			companionPhone,
			companionRelationship,
			instructionGrade,
			idStudent,
			idTeacher[0].userId
			])
	return {uuid: id}
}

export async function makeDate(data: t.makeDate) {

	const id = crypto.randomUUID()
	const patientId = data.patientId
	const doctorId = data.doctorId
	const date = data.date

	const _res = await execute(`
		INSERT INTO dates(
			id,
			patientId,
			doctorId,
			date
		) VALUES(?, ?, ?, ?)`, [
			id,
			patientId,
			doctorId,
			date
		])
	return {dateUUID: id}
}

export async function editDate(data: t.editDate) {

	const id = data.id
	const patientId = data.patientId
	const doctorId = data.doctorId
	const date = data.date

	const res = await execute(`
		UPDATE dates SET patientId = ?, doctorId = ?, date = ? WHERE id = ?
	`, [patientId, doctorId, date, id])
	return res
}

export async function cancelDate(dateId: number) {
	const res = await execute('UPDATE dates SET status = 2 WHERE id = ?', [dateId])
	return res
}

export async function getStudentList() {
	const res = await query('SELECT * FROM users WHERE type = 2 AND active = 1')
	return res
}