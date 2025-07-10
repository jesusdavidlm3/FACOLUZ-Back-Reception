export interface loginData{
    id: number,
    passwordHash: string
}

export interface makeAdultHistory{
    patientIdentification: number,
    name: string,
    lastname: string,
    identificationType: number,
    birthDate: Date,
    sex: number,
    race: number,
    instructionGrade: number,
    birthPlace: string,
    childPosition: number,
    ethnicity?: number,
    addressState: string,
    addressMunicipality: string,
    addressCity: string,
    address: string,
    emergencyName: string,
    emergencyPhone: string,
    emergencyRelationship: number,
    companionName: string,
    companionPhone: string,
    companionRelationship: string,
    idStudent: number,
    phone: string,
    currentWorking: number,
    workType: string,
    homeOwnership: number,
    familyBurden: 1
}

export interface makeChildHistory{
    name: string,
    lastname: string,
    birthDate: Date,
    childPosition: number,
    sex: number,
    race: number,
    ethnicity: number,
    instructionGrade: number,
    currentStudying: number,
    addressState: string,
    addressMunicipality: string,
    addressCity: string,
    birthPlace: string,
    address: string,
    companionName: string,
    companionPhone: string,
    companionRelationship: number,
    emergencyName: string,
    emergencyPhone: string,
    emergencyRelationship: number,
    representativeName: string,
    representativeId: string,
    representativeInstructionGrade: number,
    representativePhone: string,
    representativeWorking: number,
    representativeWorkType?: string,
    representativeFamilyBurden?: string,
    homeOwnership: number,
    idStudent: number,
}

export interface makeDate{
    patientId: number,
    doctorId: number,
    date: Date
}

export interface editDate{
    id: number,
    doctorId: number,
    date: Date
}