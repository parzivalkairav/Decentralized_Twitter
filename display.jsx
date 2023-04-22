import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import { abi, address } from './contracts/DecentralizedTwitter.json';

const web3 = new Web3(Web3.givenProvider || 'http://localhost:8545');
const contract = new web3.eth.Contract(abi, address);

function App() {
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');

  useEffect(() => {
    async function fetchData() {
      const messageIds = await contract.methods.getMessageIds().call();
      const messages = await Promise.all(messageIds.map(id => contract.methods.getMessage(id).call()));
      setMessages(messages);
    }

    fetchData();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    await contract.methods.postMessage(currentMessage).send({ from: web3.eth.defaultAccount });
    const messageIds = await contract.methods.getMessageIds().call();
    const messages = await Promise.all(messageIds.map(id => contract.methods.getMessage(id).call()));
    setMessages(messages);
    setCurrentMessage('');
  }

  return (
    <div>
      <h1>Decentralized Twitter</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="message">What's on your mind?</label>
        <input
          type="text"
          id="message"
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
        />
        <button type="submit">Post</button>
      </form>
      <ul>
        {messages.map(message => (
          <li key={message.id}>{message.text}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
