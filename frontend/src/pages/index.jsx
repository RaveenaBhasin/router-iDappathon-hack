import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { ethers } from 'ethers';
import Hero from '@/components/Hero';
import Header from '@/components/Header';
import Transfer from '@/components/Transfer';
import Footer from '@/components/Footer';
import { BulkTransfer } from '@/utils/BulkTransfer';

const Home = () => {
  const [account, setAccount] = useState('');
  const [contract, setContract] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState('');

  useEffect(() => {
    const isWalletConnected = localStorage.getItem('isWalletConnected') === 'true';
    if (!isWalletConnected) {
      connect();
    }
  }, []);


  const connect = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.enable();
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const network = await provider.getNetwork();
        console.log("network", network);
        var selectedContractAddress;

        if (network.chainId === 80001) {
          selectedContractAddress = '0xd6958c37Ae5E6CC7fc48b0e476f3bd0d19339aa0';
          setSelectedNetwork("Mumbai")
        } else if (network.chainId === 43113) {
          selectedContractAddress = '0x5606F0a148CF84CECeF5B411a808445583acEB18';
          setSelectedNetwork("Fuji")
        } else {
          console.error('Unsupported network. Please connect to Mumbai or Fuji testnet.');
          return;
        }
        console.log("selectedContractAddress", selectedContractAddress)
        const contract = new ethers.Contract(selectedContractAddress, BulkTransfer, signer);
        setContract(contract);

        const accounts = await provider.listAccounts();
        const account = accounts[0];
        setAccount(account);
        setIsConnected(true);
        localStorage.setItem('isWalletConnected', 'true');
      } catch (error) {
        console.error(error);
      }
    } else {
      console.error('Metamask not found. Please install Metamask extension.');
    }
  };


  const handleNetworkChange = async (e) => {
    const networkName = e.target.value;
    setSelectedNetwork(networkName);
    if (networkName === 'Mumbai') {
      await switchNetwork(80001);
    } else if (networkName === 'Fuji') {
      await switchNetwork(43113);
    }
  };

  const switchNetwork = async (chainId) => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${chainId.toString(16)}` }],
      });
    } catch (error) {
      console.error(error);
    }
    connect();
  };

  const disconnect = () => {
    console.log('Disconnected')
    setAccount('');
    setIsConnected(false);
    localStorage.setItem('isWalletConnected', 'false');
  };

  return (

    <div>
      <Head>
        <title>ChainFlow</title>
        <meta
          name="description"
          content="Cross Chain Fund Transfer Accelerator"
        />
      </Head>
      <Header isConnected={isConnected} account={account} selectedNetwork={selectedNetwork} handleNetworkChange={handleNetworkChange} connect={connect} disconnect={disconnect} />
      <Hero />
      <Transfer isConnected={isConnected} contract={contract} />
      <Footer/>
    </div>
  )
}

export default Home;

