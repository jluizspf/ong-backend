// utils.js
function serializeBigInt(data) {
    return JSON.parse(JSON.stringify(data, (_k, v) => (typeof v === 'bigint' ? v.toString() : v)));
}
module.exports = { serializeBigInt };
