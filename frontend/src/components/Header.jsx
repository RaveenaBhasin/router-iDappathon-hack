import { Container } from '@/components/Container'
import { Logo } from '@/components/Logo'
import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { FaPowerOff, FaPlus, FaMinus} from 'react-icons/fa';
import { BulkTransfer } from '@/utils/BulkTransfer';
import { Hero } from './Hero';

const Header = () => {
  const [account, setAccount] = useState('');
  const [contract, setContract] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState('');
  const [transfers, setTransfers] = useState([{ destChainId: '', recipients: [], amounts: [] }]);


  useEffect(() => {
    connect();
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
  };

  const handleChainIdChange = (index, value) => {
    const updatedTransfers = [...transfers];
    updatedTransfers[index].destChainId = value;
    setTransfers(updatedTransfers);
  };

  const handleRecipientChange = (index, value) => {
    const updatedTransfers = [...transfers];
    updatedTransfers[index].recipients = value.split(',');
    setTransfers(updatedTransfers);
  };

  const handleAmountChange = (index, value) => {
    const updatedTransfers = [...transfers];
    updatedTransfers[index].amounts = value.split(',').map(Number);
    setTransfers(updatedTransfers);
  };


  const handleAddOrRemoveTransfer = (index) => {
    const updatedTransfers = [...transfers];

    if (index === transfers.length - 1) {
      updatedTransfers.push({ destChainId: '', recipients: [], amounts: [] });
    } else {
      updatedTransfers.splice(index, 1);
    }

    setTransfers(updatedTransfers);
  };

  const handleTransfer = async () => {
    try {
      if (!contract) {
        console.error('Contract not loaded');
        return;
      }

      const filteredTransfers = transfers.filter((transfer) => {
        return (
          transfer.destChainId !== '' &&
          transfer.recipients.length > 0 &&
          transfer.amounts.length > 0 &&
          transfer.recipients.length === transfer.amounts.length
        );
      });

      if (filteredTransfers.length === 0) {
        console.error('Invalid transfer details');
        return;
      }

      const requestMetadata = "0x000000000007a12000000006fc23ac0000000000000000000000000000000000000000000000000000000000000000000000";
      const tx = await contract.transferBulkCrossChain(filteredTransfers, requestMetadata);
      await tx.wait();
      console.log('Transfers successful!');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const Transfer = () => {
    return (
      <section
        id="secondary-features"
        aria-label="Features for building a portfolio"
        className="py-20 sm:py-32"
      >
        <Container>
          <div className="mx-auto max-w-3xl sm:text-center">
            <h2 className="text-3xl font-medium tracking-tight text-gray-900">
              One-click fund transfer across multiple chains!
            </h2>
          </div>
          <div>
            {isConnected ? (
              <>
                {transfers.map((transfer, index) => (
                  <div key={index}>
                    <h2 className="mt-10 mb-5 text-xl font-medium ">Transfer {index + 1}</h2>
                    <div class="flex flex-wrap -mx-3 mb-2">
                      <div class="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                        <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-city">
                          Recipient
                        </label>
                        <input
                          type="text"
                          value={transfer.recipients.join(',')}
                          onChange={(e) => handleRecipientChange(index, e.target.value)}
                          placeholder='0x0000000,0x0000000'
                          className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                        />
                      </div>
                      <div class="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                        <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-state">
                          Destination Chain ID:
                        </label>
                        <div class="relative">
                          <select
                            class="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                            value={transfer.destChainId}
                            onChange={(e) => handleChainIdChange(index, e.target.value)}
                          >
                            <option value="">Select Chain</option>
                            <option value="80001">Polygon Mumbai</option>
                            <option value="43113">Avalanche Fuji</option>
                          </select>
                        </div>

                      </div>
                      <div class="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                        <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-zip">
                          Amounts:
                        </label>
                        <input
                          type="text"
                          value={transfer.amounts.join(',')}
                          placeholder='100,200'
                          onChange={(e) => handleAmountChange(index, e.target.value)}
                          className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                        />
                      </div>
                    </div>
                    {index === transfers.length - 1 ? (
                      <button onClick={() => handleAddOrRemoveTransfer(index)}><FaPlus className="inline-block mr-1" /></button>
                    ) : (
                      <button onClick={() => handleAddOrRemoveTransfer(index)}><FaMinus className="inline-block mr-1" /></button>
                    )}
                  </div>
                ))}
                <br />
                <button className="bg-cyan-600 hover:bg-cyan-900 text-white font-bold py-2 px-4 rounded" onClick={handleTransfer}>
                  Transfer
                </button>
              </>
            ) : (
              <div></div>
            )}
          </div>
        </Container>
      </section>
    )
  }
  return (
    <header>
      <nav>
        <Container className="relative z-50 flex justify-between py-8">
          <div className="relative z-10 flex items-center">
            <Logo className="h-10 w-auto" />
            <h1 className="font-display font-bold text-xl">ChainFlow</h1>
          </div>
          <div className="flex items-center gap-6">
            {isConnected ? (
              <>
                <label>
                  <select
                    class="block appearance-none bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                    value={selectedNetwork} onChange={handleNetworkChange}>
                    <option value="Mumbai">Mumbai</option>
                    <option value="Fuji">Fuji</option>
                  </select>
                </label>
                <button className="hidden lg:block bg-black hover:bg-gray-900 text-white font-bold py-2 px-4 rounded-md" onClick={disconnect}>
                  {account.slice(0, 6) + '...' + account.slice(-4)} <FaPowerOff className="inline-block ml-3 " />
                </button>
              </>
            ) : (
              <button class="bg-black hover:bg-gray-900 text-white font-bold py-2 px-4 rounded" onClick={connect}>
                Connect Wallet
              </button>
            )}
          </div>
        </Container>
        <Hero />
        <Transfer />
      </nav>
    </header>
  )
}

export default Header;
