import React from 'react';
import Header from '../components/Header';
import WalletForm from '../components/WalletForm';
import '../App.css';

class Wallet extends React.Component {
  render() {
    return (
      <section className="TopSection">
        <Header />
        <WalletForm />
      </section>
    );
  }
}

export default Wallet;
