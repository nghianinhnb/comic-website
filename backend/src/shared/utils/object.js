export function removeUndefined(obj) {
    console.log(obj);
    Object.keys(obj).forEach(key => obj[key] === undefined && delete obj[key])
    console.log(obj);
    return obj
}