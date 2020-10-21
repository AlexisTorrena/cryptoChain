const Block = require('./block');
const cryptoHash = require('./crypto-hash');

class Blockchain {
    constructor()
    {
        this.chain = [Block.genesis()];
    }

    addBlock({data}){
        const newBlock = Block.mineBlock({
            lastBlock: this.chain[this.chain.length-1],
            data
        });
        this.chain.push(newBlock);
    }

    static isValidChain(chain){
        if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) return false;

        for (let index = 1; index < chain.length; index++) {
            
            const {timestamp, lastHash, hash, data } = chain[index];
            const actualLastHash = chain[index-1].hash;
            
            if(lastHash !== actualLastHash) return false;

            const generatedHash = cryptoHash(timestamp,lastHash,data);

            if (hash !== generatedHash) return false;
        }
    return true;        
    }

    replaceChain(newChain){
        if(newChain.length <= this.chain.length){
            console.error('new chain must be longer');
            return;
        }
        
        if(!Blockchain.isValidChain(newChain)){
            console.error('new chain must be valid');
            return;
        }

        console.log('replacing Chain with', newChain);
        this.chain = newChain;
    }
}

module.exports = Blockchain;