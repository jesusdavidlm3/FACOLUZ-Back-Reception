export function toSqlDateTime(rawDate: Date){
    const date = new Date(rawDate)

    const year = date.getFullYear()
    const month = date.getMonth()+1 <= 9 ? (`0${date.getMonth()+1}`):(date.getMonth()+1)
    const day = date.getDate() <= 9 ? (`0${date.getDate()}`):(date.getDate())

    const hour = date.getHours() <= 9 ? (`0${date.getHours()}`):(date.getHours())
    const minutes = date.getMinutes() <=9 ? (`0${date.getMinutes()}`):(date.getMinutes())

    const res = `${year}-${month}-${day} ${hour}:${minutes}:00`
    return res
}