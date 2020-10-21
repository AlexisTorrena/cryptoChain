const Blockchain = require('./blockchain');
const Block = require('./block');

describe('Blockchain', () => {
    let  blockchain, newBlockchain, originalChain;

    beforeEach( ()=> {
        blockchain = new Blockchain();
        newBlockchain = new Blockchain();
        originalChain = blockchain.chain;
    });

    it('contains a ´chain´ Array instance', () => {
        expect(blockchain.chain instanceof Array).toBe(true); 

    });

    it('starts with the genesis block',()=> {
        expect(blockchain.chain[0]).toEqual(Block.genesis());

    });

    it('adds a new block to the blockchain', ()=> {
        const newData = 'foo bar';
        blockchain.addBlock({data:newData});

        expect(blockchain.chain[blockchain.chain.length-1].data).toEqual(newData);
    });

    describe('isValidChain()', () => {
        describe('when the chain does not start with genesis block', () => {
            it('returns false', () => {
                blockchain.chain[0] = {data:'fake-genesis'};
                expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
            });
        });

        describe('when the chain starts with genesis block and has multiple blocks', () => {
            beforeEach(()=>{
                blockchain.addBlock({data:'Bears'});
                blockchain.addBlock({data:'Beats'});
                blockchain.addBlock({data:'Star Wars'});
            });
            describe('and a lastHash reference has changed', ()=> {
                it('returns false', () => {

                    blockchain.chain[2].lastHash = 'broken-hash';

                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
                });
            });

            describe('and the chain contains a block with invalid an field', ()=> {
                it('returns false', () => {

                    blockchain.chain[2].data = 'some-bad-and-evil-data';

                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
                });
            });
            describe('and the chain does not contain any invalid block', ()=> {
                it('returns true', ()=> {
                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(true);
                });
            });
        });    
    });

    describe('replaceChain()', () => {
        let errorMock, logMock;

        beforeEach(()=> {
            errorMock = jest.fn();
            logMock = jest.fn();

            global.console.error = errorMock;
            global.console.log = logMock;
        });

        describe('when the new chain is not longer', ()=> {
            beforeEach(()=> {
                newBlockchain.chain[0].data = 'some-new-data';
                blockchain.replaceChain(newBlockchain.chain);
            })

            it('does not replace the chain', ()=> {
                expect(blockchain.chain).toEqual(originalChain);
            });

            it('logs an error', ()=> {
                expect(errorMock).toHaveBeenCalled();
            });
        });
        describe('when the new chain is longer', ()=> {
            
            beforeEach(()=>{
                newBlockchain.addBlock({data:'Bears'});
                newBlockchain.addBlock({data:'Beats'});
                newBlockchain.addBlock({data:'Star Wars'});
            });

            describe('and the chain is not valid',()=> {
                beforeEach(()=> {
                    newBlockchain.chain[2].data = 'some-new-data';
                    blockchain.replaceChain(newBlockchain.chain);
                });

                it('does not replace the chain', ()=> {                   
                    expect(blockchain.chain).toEqual(originalChain);
                });
            
                it('logs an error', ()=> {
                    expect(errorMock).toHaveBeenCalled();
                });
            });

            describe('and the chain is valid', ()=> {
                beforeEach(()=> {
                    blockchain.replaceChain(newBlockchain.chain);
                });
                
                it('replaces the chain', ()=> {
                    expect(blockchain.chain).toEqual(newBlockchain.chain);
                });

                it('logs about chain replacement', ()=> {
                    expect(logMock).toHaveBeenCalled();
                });
            });
        });
    });
});