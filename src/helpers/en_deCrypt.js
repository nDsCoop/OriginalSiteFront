
import crypto from 'crypto';
import CryptoJS from 'crypto-js';

const keySecret = '3zTvzr3p67VC61jmV54rIYu1545x4TlY';
const algorithm = 'aes-256-ctr';
const keySecret2 = 'vOVH6sdmpNWjRRIqCc7rdxs01lwHzfr3';
const iv = crypto.randomBytes(16);

export const encrypt = (text) => {
    try{

        const salt = CryptoJS.lib.WordArray.random(128 / 8)
        const iv = CryptoJS.lib.WordArray.random(128 / 8)
        const encrypted = CryptoJS.AES.encrypt(text, CryptoJS.PBKDF2(keySecret, salt, { keySize: 256 / 32, iterations: 100 }) /* key */, { iv: iv, padding: CryptoJS.pad.Pkcs7, mode: CryptoJS.mode.CBC })
        const transitmessage = salt.toString() + iv.toString() + encrypted.toString();
        return transitmessage;

    }
    catch (err) 
    {
        console.log(err)
    }
   
}

export const decrypt = (text) => {
    try{

        const key = CryptoJS.PBKDF2(keySecret, CryptoJS.enc.Hex.parse(text.substr(0, 32)) /* Salt */, { keySize: 256 / 32, iterations: 100 })
        const decrypted = CryptoJS.AES.decrypt(text.substring(64) /* encrypted */, key, { iv: CryptoJS.enc.Hex.parse(text.substr(32, 32)) /* iv */, padding: CryptoJS.pad.Pkcs7, mode: CryptoJS.mode.CBC })
        return decrypted.toString(CryptoJS.enc.Utf8)

    }
    catch (err)
    {
        console.log(err)
    }
   
}

export const encrypt2 = (text) => {
    try{

        const cipher = crypto.createCipheriv(algorithm, keySecret2, iv);
        const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
        return {
            iv: iv.toString('hex'),
            content: encrypted.toString('hex')

        }
    }
    catch (err) {
        console.log(err)
    }

  
}

export const decrypt2 = (hash) => {
    try {

        const decipher = crypto.createDecipheriv(algorithm, keySecret2, Buffer.from(hash.iv, 'hex'));
        const decrpyted = Buffer.concat([decipher.update(Buffer.from(hash.content, 'hex')), decipher.final()]);
        return decrpyted.toString();

    }
    catch (err) {
        console.log(err)
    }
   
};


