# -*- coding: utf-8 -*-
"""
Created on Wed Sep 14 09:56:11 2022

@author: Gokuleshwaran
"""

import datetime
import hashlib
import json
from flask import Flask, jsonify

#Building Blockchain:
class Blockchain:
     
    #this is to create genesis block
    def __init__(self):
        self.chain = []
        self.create_block(proof = 1, previous_hash = '0') #genisis block
    
    #creating block which will be appended to the chain
    def create_block(self, proof, previous_hash):
        block = {'index':len(self.chain)+1,
                 'timestamp': str(datetime.datetime.now()),
                 'proof': proof, #it is like nonce
                 'previous_hash': previous_hash}
        self.chain.append(block)
        return block
    
    #to get previous block which means end block
    def get_previous_block(self):
        return self.chain[-1] #-1 gives last block of the chain
    
    #to get hash of the block
    def hash(self, block):
        #to make block string
        encoded_block = json.dumps(block,sort_keys=True).encode()
        return hashlib.sha256(encoded_block).hexdigest()     
    
    #this check is done by all the peers
    def is_chain_valid(self, chain):
        previous_block = chain[0]
        block_index = 1
        while block_index < len(chain):
            block = chain[block_index]
            #first we check hash
            if block['previous_hash'] != self.hash(previous_block):
                return False
            
            #second we verify proof (nonce) of current block
            previous_proof = previous_block['proof']
            proof = block['proof']
            
            #here we are using hash operation instead of hash of the block to minimize computation
            hash_operation = hashlib.sha256(str(proof**2 - previous_proof**2).encode()).hexdigest()
            if hash_operation[:4] != '0000':
                return False
            previous_block = block
            block_index+=1
        return True
    
    #to return proof of work
    def proof_of_work(self, previous_proof):
        new_proof = 1
        check_proof = False
        while check_proof is False:
            #now we are defining mathematical problem
            #here we dont use no of actual leading zeroes problem
            #we use simple mathematical problem
            hash_operation = hashlib.sha256(str(new_proof**2 - previous_proof**2).encode()).hexdigest()
            if hash_operation[:4] == '0000':
                check_proof = True
            else:
                new_proof+=1
        return new_proof   
    
    

#Mining blockchain:

#creating a Web app based on flask
app = Flask(__name__)
app.config['JSONIFY_PRETTYPRINT_REGULAR'] = False

#creating a blockchain #instance of Blockchain class
blockchain = Blockchain() 
  
#mining our new block
@app.route('/mine_block', methods=['GET'])
def mine_block():
    previous_block = blockchain.get_previous_block()
    previous_proof = previous_block['proof']
    proof = blockchain.proof_of_work(previous_proof)
    previous_hash = blockchain.hash(previous_block)
    block = blockchain.create_block(proof, previous_hash)
    response = {'message':'Congratilations, you just mined a block',
                'index': block['index'],
                'timestamp': block['timestamp'],
                'proof': block['proof'],
                'previous_hash':block['previous_hash']}
    return jsonify(response), 200

#getting the full blockchain
@app.route('/get_chain', methods=['GET'])
def get_chain():
    response = {'chain':blockchain.chain,
                'length':len(blockchain.chain)}
    return jsonify(response), 200

@app.route('/is_valid', methods=['GET'])
def is_valid():
    check = blockchain.is_chain_valid(blockchain.chain)
    if check == True:
        response = {'message':'All good, Blockchain is valid'}
    else:
        response = {'message':'All good, Blockchain is not valid'}
    return jsonify(response), 200

#running the app
app.run(host='0.0.0.0',port=5000)
        

