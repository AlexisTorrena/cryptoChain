const Block = require('./block');
const { GENESIS_DATA } = require('./config');
const cryptoHash = require('./crypto-hash');

describe('Block', () => {
    const timestamp = 'a-date';
    const lastHash = 'foo-hash';
    const hash = 'hash';
    const data = 'data';

    const block = new Block({timestamp,lastHash,hash,data});

    it('has a timestamp, lastHash, hash, and data property', () => {
        expect(block.timestamp).toEqual(timestamp);
        expect(block.lastHash).toEqual(lastHash);
        expect(block.hash).toEqual(hash);
        expect(block.data).toEqual(data);
        //not the best practice to have multiple expect
    });

    describe('genesis()', () => {
        const genesisBlock = Block.genesis();

        //console.log('genesis',genesisBlock);

        it('returns a Block instance', () => {
           expect(genesisBlock).toBeInstanceOf(Block); 
        });

        it('returns the genesis data', () => {
            expect(genesisBlock).toEqual(GENESIS_DATA);
        });
    });

    describe('mineBlock()', () => { 
        const lastBlock = Block.genesis();
        const data = 'mined data';
        const minedBlock = Block.mineBlock({lastBlock,data});

        it('returns a block instance', () => {
            expect(minedBlock).toBeInstanceOf(Block); 
        });

        it('sets the ´lastHash´ to be the ´hash´ of the lastBlock', () => {
            expect(minedBlock.lastHash).toEqual(lastBlock.hash);
        });

        it('sets the ´data´', () => {
            expect(minedBlock.data).toEqual(data);
        });

        it('sets the ´timestamp´', () => {
            expect(minedBlock.timestamp).not.toEqual(undefined);
        });

        it('creates a SHA-256 ´hash´ with proper inputs', () => {
            expect(minedBlock.hash)
                .toEqual(cryptoHash(minedBlock.timestamp,lastBlock.hash,data));
        });
    });
});