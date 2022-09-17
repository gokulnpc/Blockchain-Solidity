# -*- coding: utf-8 -*-
"""
Created on Wed Sep 14 21:55:47 2022

@author: Gokuleshwaran
"""
import hashlib
import datetime

import json
from flask import Flask, jsonify

class Blockchain:
    
    def __init__(self):
        self.chain = []
        self.create_block(proof = 1, previous_hash = '0') 
    
    def create_block(self, proof, previous_hash):
        block = {'index':len(self.chain)+1,
                 'timestamp': str(datetime.datetime.now()),
                 'proof': proof,
                 'previous_hash': previous_hash}
        self.chain.append(block)
        return block
    
    def get_previous_block(self):
        return self.chain[-1]
    
    def hash(self,block):
        encoded_block = json.dumps(block,sort_keys=True).encode()
        return hashlib.sha256(encoded_block).hexdigest()   
    
    def proof_of_work(self, previous_proof):
        proof = 1
        check_proof = False
        while check_proof is False:
            hash_operation = hashlib.sha256(str(proof**2 - previous_proof**2).encode()).hexdigest()
            if hash_operation[:4] == '0000':
                check_proof = True
            else:
                proof+=1
        return proof

        
    
    def is_valid_chain(self):
        previous_block = self.chain[0]
        block_index = 1
        while block_index < len(self.chain):
            block = self.chain[block_index]
            if block['previous_hash'] != self.hash(previous_block):
                return False
            previous_proof = previous_block['proof']
            proof = block['proof']
            hash_operation = hashlib.sha256(str(proof**2 - previous_proof**2).encode()).hexdigest()
            if hash_operation[:4] != '0000':
                return False
            block_index+=1
        return True
    
app = Flask(__name__)
app.config['JSONIFY_PRETTYPRINT_REGULAR'] = False

blockchain = Blockchain()

@app.route('/mine_block',methods=['GET'])
def mine_block():
    previous_block = blockchain.get_previous_block()
    previous_proof = previous_block['proof']
    previous_hash = blockchain.hash(previous_block)
    proof = blockchain.proof_of_work(previous_proof)
    block = blockchain.create_block(proof, previous_hash)
    response = {
        'message':'congrats for mining a block',
        'index':block['index'],
        'timestamp':block['timestamp'],
        'proof':block['proof'],
        'previous_hash': block['previous_hash']}
    return jsonify(response),200

@app.route('/get_chain',methods=['GET'])
def get_chain():
    response = {
        'chain': blockchain.chain,
        'length': len(blockchain.chain)}
    return jsonify(response), 200

@app.route('/is_valid',methods=['GET'])
def is_valid():
    check = blockchain.is_valid_chain()
    if check == True:
        response ={
            'message':'it is a valid blockchain'}
    else:
        response={
            'message':'it is not a valid blockchain'}
    return jsonify(response), 200

app.run(host='0.0.0.0',port=5000)