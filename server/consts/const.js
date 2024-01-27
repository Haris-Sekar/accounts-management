export const USER_TYPE = {
    ADMIN: 0,
    EMPLOYEE: 1
}

export const MODULES = {
    CUSTOMERS: 0,
    BILLS: 1,
    VOUCHERS: 2,
    DASHBOARD: 3,
    USER: 4
}
export function convertDateToMilliseconds(dateString) {
    // Split the date string into parts
    var parts = dateString.split("/");
    
    // Please note that months are 0-based in JavaScript Date (0 = January, 11 = December)
    var day = parseInt(parts[0], 10);
    var month = parseInt(parts[1], 10) - 1; // Subtract 1 to make the month 0-based
    var year = parseInt(parts[2], 10);
    
    // Create a new Date object with the extracted date parts
    var date = new Date(year, month, day);
    
    // Return the time in milliseconds
    return date.getTime();
}