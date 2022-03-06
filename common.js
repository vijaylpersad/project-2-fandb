const cryptojs = require('crypto-js');

module.exports = {
    decryptUserId: (encryptedUserId) => cryptojs.AES.decrypt(encryptedUserId, process.env.SECRET).toString(cryptojs.enc.Utf8)
};