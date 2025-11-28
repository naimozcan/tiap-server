const enums = {

    EMPLOYEE_TITLES : ["operator", "coach", "team leader", "shift leader", "exception handler", "supervisor"],
    EMPLOYEE_ROLES : ["user", "admin", "superAdmin"],
    EMAIL_REGEX: [/^[a-z]+\.[a-z]+[0-9]{2}@[a-z]+\.com$/, "Email should be in this format: jane.smith01@company.com"],
    DEPARTMENTS : ["outbound"],
    PASSWORD_REGEX : /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!.,:;?'"(){}\[\]\\\/\-_=+*@#$%^&~`|<>])(?!.*\s).{8,}$/,

    RECEIEVED_AS : ["costumer complaint", "operation error"],
    EXCEPTION_STATUS : ["handled", "irrecoverable", "replaced", "backlog"],
    EXCEPTION_TYPES : ["missing", "damaged"],
    EXCEPTION_REGEX: /^EXO(?:19|20)\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])(?!000000)\d{6}E$/,

    LOCATION_PURPOSES : ["picking", "packing", "exception"],
    LOCATION_REGEX: /^(AR(?:00[1-9]|0[1-9][0-9]|[1-9][0-9]{2})|PDR(?:00[1-9]|0[1-9][0-9]|[1-9][0-9]{2})|AX(?:00[1-9]|0[1-9][0-9]|[1-9][0-9]{2})|AC(?:00[1-9]|0[1-9][0-9]|[1-9][0-9]{2})|AF(?:00[1-9]|0[1-9][0-9]|[1-9][0-9]{2})|AL(?:00[1-9]|0[1-9][0-9]|[1-9][0-9]{2}))$/,

    ORDER_REGEX: /^WON(?:19|20)\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])(?!000000)\d{6}E$/,
    TASK_COLLECTION_REGEX: /^OBR(?:19|20)\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])(?!000000)\d{6}E$/,
    TASK_REGEX: /^(PIR|PAR)(?:19|20)\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])(?!000000)\d{6}E$/,

    TASK_TYPES : ["picking", "packing"],
    ZONES : ["AR"],
    SKU_REGEX : /^\d{6}$/

}

module.exports = enums