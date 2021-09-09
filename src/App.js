import React, { useState, useEffect } from 'react';

import './App.css';

function App() {
 
  const [customerid, setCustomerid] = useState('');
  const [initialcredit, setInitialcredit] = useState('');
  const [customerFetchId, setCustomerFetchId] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [accounts, setAccounts] = useState({});
  
  const doCreateAccount = () => {
    if(customerid === '' || initialcredit === '') {
      return;
    }
    let req = {
      customerId: customerid,
      initialCredit: initialcredit
    }
    let request = JSON.stringify(req);
    setMessage('');
    setLoading(true);
    fetch("http://localhost:7070/accountservice/api/v1/accounts/create", {body: request, method: "post",     headers: {
      'Content-Type': 'application/json'
    }})
    .then(res => res.json())
    .then(
      (result) => {
        setLoading(false);
        if(result.error) {
          setError(true);
          setMessage(result.error.responseMessage);
        }
        else {
          setError(false);
          setMessage(result.responseMessage);
        }
        setInitialcredit("");
        setCustomerid("");
      },
      (error) => {
        console.log("Error: ", error);
        setInitialcredit('');
        setCustomerid('');
      }
    )
  }
  
  const changeInitialCredit = (e) => {
    let initialCredit = e.target.value;
    setInitialcredit(initialCredit);
  }
  
  const changeCustomerId = (e) => {
    let customerId = e.target.value;
    setCustomerid(customerId);
  }
  
  const changeCustomerFetchId = (e) => {
    let customerFetchId = e.target.value;
    setCustomerFetchId(customerFetchId);
  }
  
  const doFetchAccount = () => {
    if(customerFetchId === '') {
      return;
    }
    setMessage('');
    setLoading(true);
    fetch("http://localhost:7070/accountservice/api/v1/accounts/fetch/"+customerFetchId, {method: "get",     headers: {
      'Content-Type': 'application/json'
    }})
    .then(res => res.json())
    .then(
      (result) => {
        setLoading(false)
        if(result.error) {
          setError(true);
          setMessage(result.error.responseMessage);
        }
        else {
          setError(false);
          setAccounts(result);
        }

      },
      (error) => {
        console.log("Error: ", error);
      }
    )
  }
  
  return (
    <div className="App">
        <h1>BlueHarvest Account-ui</h1>
        <div className="createAccount-div">
          <div className="message-boundary">
            <div className={error ? 'has-error' : 'success'}>{message}</div>
          </div>
          <h3>Create Account</h3>
          <input className="" type="text" name="customerId" id="customerId" placeholder="Customer Id" onChange={(e) => changeCustomerId(e)}/>
          <input className="mr-2" type="text" name="initialCredit" id="initialCredit" placeholder="Initial Credit" onChange={(e) => changeInitialCredit(e)}/>
          <button type="button" className="btn btn-info" onClick={() => doCreateAccount()}>Create Account</button>
        </div>
        
        <hr/>
        <h3>Get user Acounts/transactions</h3>
        <div className="form">
          <input type="text" name="customerFetchId" id="customerFetchId" placeholder="Customer ID" onChange={(e) => changeCustomerFetchId(e)}/>
          <button type = "button" className="btn btn-info" onClick={() => doFetchAccount()}>Fetch Accounts</button>
        </div>
        <div className={!loading && error ? 'hide' : 'show'} id="content-id">
        <p>{accounts.name}</p>
        <p>{accounts.surname}</p>
        
        {accounts.accountDetails && accounts.accountDetails.map(item => (
          <div>
            <p> Account ID: {item.accountId} | Account Balance: {item.balance} </p>
            <p><b>Transactions for Account ID : {item.accountId}</b></p>
            {item.transaction && item.transaction.map(trans => (
              <div>
                <p>Transaction ID: {trans.id} | Account ID: {trans.accountId} | Amount: {trans.amount} | Transaction Date: {trans.transactionDate}</p>
              </div>
            ))}
          </div>
        ))}
        </div>
      </div>
  );
}

export default App;
