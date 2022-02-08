function deleteUnkownProperties(crudObject: any) {
    delete crudObject.Modified_By
    delete crudObject.ID
    delete crudObject.Created_Date
    delete crudObject.Modified_Date
    delete crudObject.Created_By
    delete crudObject.UUID
    return crudObject
}

export default deleteUnkownProperties
