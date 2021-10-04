import SHA256 from 'crypto-js/sha256.js';
import EC from 'elliptic';
const ec = new EC.ec('secp256k1')
export default class Transaction{
    constructor(fromAddress,toAddress,amount){
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }

    calculateHash(){
        return SHA256( this.fromAddress + this.toAddress + this.amount).toString();
    }

    signTransaction(siginingKey){
        const hashTx = this.calculateHash();
        const sig = siginingKey.sign(hashTx,'base64');
        this.signature = sig.toDER('hex');
    }

    isValid(){
        if(this.fromAddress===null) return false;

        if(!this.signature || this.signature.length===0){
            throw new Error("No signature on this transaction")
        }
        

        const publicKey = ec.keyFromPublic(this.fromAddress,'hex');
        return publicKey.verify(this.calculateHash(),this.signature);
    }
}