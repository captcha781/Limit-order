const crypto = require('crypto')
const key = Buffer.from(process.env.KEY, 'base64')

exports.encrypt = (text) => {
    const iv = crypto.randomBytes(16)
    let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return { iv: iv.toString('base64'), encryptedData: encrypted.toString('base64') };
}


exports.decrypt = (text) => {
    let iv = Buffer.from(text.iv, 'base64');
    let encryptedText = Buffer.from(text.encryptedData, 'base64');
    let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}
