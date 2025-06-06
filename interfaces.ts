export interface loginData{
    id: number,
    passwordHash: string
}

export interface makeHistory{
    name: string,
    lastname: string,
    identificationType: number,
    patientIdentification: number,
    phone: string,
    sex: number,
    birthDate: Date,
    birthPlace: string,
    religion: string,
    race: number,
    address: string,
    addressMunicipality: string,
    addressCity: string,
    emergencyName: string,
    emergencyPhone: string,
    emergencyRelationship: string,
    companionName: string,
    companionPhone: string,
    companionRelationship: string,
    instructionGrade: number,
    idStudent: number
}

export interface makeDate{
    patientId: number,
    doctorId: number,
    date: Date
}

export interface editDate{
    id: string,
    patientId: number,
    doctorId: number,
    date: Date
}