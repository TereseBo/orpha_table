
export function getDateString() {
    const currentDate = new Date()
    const dateString = currentDate.toDateString()
    const year = currentDate.getFullYear()
    let month = currentDate.getMonth()
    month = month < 10 ? '0' + month : month
    let day = currentDate.getDate()
    day = day < 10 ? '0' + day : day

    const formattedDate = `${year}${month}${day}`
    return formattedDate
}