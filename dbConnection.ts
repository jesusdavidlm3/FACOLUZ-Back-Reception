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

export async function makeAdultHistory(data: t.makeAdultHistory) {
	console.log(data)
	const id = crypto.randomUUID()
	const patientIdentification = data.patientIdentification
	const name = data.name
	const lastname = data.lastname
	const identificationType = data.identificationType
	const birthDate = toSqlDateTime(data.birthDate)
	const sex = data.sex
	const race = data.race
	const ethnicity = data.ethnicity
	const instructionGrade = data.instructionGrade
	const birthPlace = data.birthPlace
	//const childPosition = data.childPosition
	const addressState = data.addressState
	const addressMunicipality = data.addressMunicipality
	const addressCity = data.addressCity
	const address = data.address
	const emergencyName = data.emergencyName
	const emergencyPhone = data.emergencyPhone
	const emergencyRelationship = data.emergencyRelationship
	const companionName = data.companionName
	const companionPhone = data.companionPhone
	const companionRelationship = data.companionRelationship
	const idStudent = data.idStudent
	const rawNow = Date.now()
	const createPatient = toSqlDateTime(rawNow)

	const phone = data.phone
	const currentWorking = data.currentWorking
	const workType = data.workType
	const familyBurden = data.familyBurden
	const homeOwnership = data.homeOwnership

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

	const _res1 = await execute(`
		INSERT INTO patients(
			id,
			patientIdentificacion,
			name,
			lastname,
			identificationType,
			birthDate,
			sex,
			race,
			ethnicity,
			instructionGrade,
			birthPlace,
			addressState,
			addressMunicipality,
			addressCity,
			address,
			emergencyName,
			emergencyPhone,
			emergencyRelationship,
			companionName,
			companionPhone,
			companionRelationship,
			idStudent,
			createPatient,
			idTeacher,
			homeOwnership
		) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
		`, [
			id,
			patientIdentification,
			name,
			lastname,
			identificationType,
			birthDate,
			sex,
			race,
			ethnicity,
			instructionGrade,
			birthPlace,
			//childPosition,
			addressState,
			addressMunicipality,
			addressCity,
			address,
			emergencyName,
			emergencyPhone,
			emergencyRelationship,
			companionName,
			companionPhone,
			companionRelationship,
			idStudent,
			createPatient,
			idTeacher[0].userId,
			homeOwnership
		])

		const _res2 = await execute(`
			INSERT INTO adulthistories(
				patientId,
				phone,
				currentWorking,
				workType,
				familyBurden
			) VALUES(?, ?, ?, ?, ?)
		`, [
			id,
			phone,
			currentWorking,
			workType,
			familyBurden
		])
	return {uuid: id}
}

export async function makeChildHistory(data:t.makeChildHistory) {
	const id = crypto.randomUUID()
	const patientCode = crypto.randomUUID()
	const name = data.name
	const lastname = data.lastname
	const birthDate = toSqlDateTime(data.birthDate)
	//const childPosition = data.childPosition
	const sex = data.sex
	const race = data.race
	const ethnicity = data.ethnicity
	const instructionGrade = data.instructionGrade
	const currentStudying = data.currentStudying
	const addressState = data.addressState
	const addressMunicipality = data.addressMunicipality
	const addressCity = data.addressCity
	const birthPlace = data.birthPlace
	const address = data.address
	const companionName = data.companionName
	const companionPhone = data.companionPhone
	const companionRelationship = data.companionRelationship
	const emergencyName = data.emergencyName
	const emergencyPhone = data.emergencyPhone
	const emergencyRelationship = data.emergencyRelationship
	const idStudent = data.idStudent
	const rawNow = Date.now()
	const createPatient = toSqlDateTime(rawNow)

	const representativeName = data.representativeName
	const representativeId = data.representativeId
	const representativeInstructionGrade = data.representativeInstructionGrade
	const representativePhone = data.representativePhone
	const representativeWorking = data.representativeWorking
	const representativeWorkType = data.representativeWorkType
	const representativeFamilyBurden = data.representativeFamilyBurden
	const homeOwnership = data.homeOwnership

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

	const _res1 = await execute(`
		INSERT INTO patients(
			id,
			patientCode,
			name,
			lastname,
			identificationType,
			birthDate,
			sex,
			race,
			ethnicity,
			instructionGrade,
			birthPlace,
			addressState,
			addressMunicipality,
			addressCity,
			address,
			emergencyName,
			emergencyPhone,
			emergencyRelationship,
			companionName,
			companionPhone,
			companionRelationship,
			idStudent,
			createPatient,
			idTeacher,
			homeOwnership
		) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,[
			id,
			patientCode,
			name,
			lastname,
			3,
			birthDate,
			sex,
			race,
			ethnicity,
			instructionGrade,
			birthPlace,
			//childPosition,
			addressState,
			addressMunicipality,
			addressCity,
			address,
			emergencyName,
			emergencyPhone,
			emergencyRelationship,
			companionName,
			companionPhone,
			companionRelationship,
			idStudent,
			createPatient,
			idTeacher[0].userId,
			homeOwnership
		])

		const _res2 = await execute(`INSERT INTO childHistories(
			patientId,
			currentStudying,
			representativeIdentification,
			representativeName,
			representativeInstructionGrade,
			representativePhone,
			representativeWorking,
			representativeWorkType,
			representativeFamilyBurden
		) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?);
		`,[
			id,
			currentStudying,
			representativeId,
			representativeName,
			representativeInstructionGrade,
			representativePhone,
			representativeWorking,
			representativeWorkType,
			representativeFamilyBurden
		])

	return {uuid: id, patientCode: patientCode}
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

export async function getDates() {
	const res = await query('SELECT d.id AS dateId, p.id, p.name AS patientName, p.lastname AS patientLastname, d.date, u.name AS doctorName, u.lastname AS doctorLastname FROM dates d INNER JOIN patients p INNER JOIN users u ON (d.patientId = p.id AND u.id = d.doctorId) WHERE status = 1 ORDER BY d.date ASC')
	return res
}

export async function getDatesByPatient(patientId: number) {
	const res = await query('SELECT d.id AS dateId, p.id, p.name AS patientName, p.lastname AS patientLastname, d.date, u.name AS doctorName, u.lastname AS doctorLastname FROM dates d INNER JOIN patients p INNER JOIN users u ON (d.patientId = p.id AND u.id = d.doctorId) WHERE status = 1 AND (p.patientIdentificacion = ? OR p.patientCode = ?) ORDER BY d.date ASC' , [patientId, patientId])
	return res
}

/*export async function getDatesByDoctor(doctorId: number) {
	const res = await query('SELECT * FROM dates WHERE doctorId = ? AND status = 1', [doctorId])
	return res
}*/

export async function getDateByDate(date: Date) {
	const res = await query('SELECT d.id AS dateId, p.id, p.name AS patientName, p.lastname AS patientLastname, d.date, u.name AS doctorName, u.lastname AS doctorLastname FROM dates d INNER JOIN patients p INNER JOIN users u ON (d.patientId = p.id AND u.id = d.doctorId) WHERE status = 1 AND DATE(d.date) = ? ORDER BY d.date ASC' , [date])
	return res
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
	const res = await query('SELECT u.id, u.name, u.lastname FROM users u INNER JOIN clases c ON u.id = c.userId WHERE u.type = 2 AND u.active = 1')
	return res
}