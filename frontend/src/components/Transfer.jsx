import { useState } from 'react';
import { Container } from '@/components/Container';
import { FaPlus, FaMinus } from 'react-icons/fa';

const Transfer = ({ isConnected, contract }) => {

    const isTransferDisabled = !isConnected;

    const [transfers, setTransfers] = useState([{ destChainId: '', recipients: [], amounts: [] }]);

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
                    {transfers.map((transfer, index) => (
                        <div key={index}>
                            <h2 className="mt-10 mb-5 text-xl font-medium ">Transfer {index + 1}</h2>
                            <div class="flex flex-wrap -mx-3 mb-2">
                                <div class="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                                    <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-city">
                                        Recipients
                                    </label>
                                    <input
                                        type="text"
                                        value={transfer.recipients.join(',')}
                                        onChange={(e) => handleRecipientChange(index, e.target.value)}
                                        placeholder='0x0...000,0x0...000,0x0...000'
                                        className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                        disabled={isTransferDisabled}
                                    />
                                </div>
                                <div class="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                                    <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-state">
                                        Destination Chain
                                    </label>
                                    <div class="relative">
                                        <select
                                            class="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                            value={transfer.destChainId}
                                            onChange={(e) => handleChainIdChange(index, e.target.value)}
                                            disabled={isTransferDisabled}
                                        >
                                            <option value="">Select Chain</option>
                                            <option value="80001">Polygon Mumbai</option>
                                            <option value="43113">Avalanche Fuji</option>
                                        </select>
                                    </div>

                                </div>
                                <div class="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                                    <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-zip">
                                        Amount
                                    </label>
                                    <input
                                        type="text"
                                        value={transfer.amounts.join(',')}
                                        placeholder='100,200,300'
                                        onChange={(e) => handleAmountChange(index, e.target.value)}
                                        className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                        disabled={isTransferDisabled}
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
                    <button 
                        className="bg-cyan-600 hover:bg-cyan-900 text-white font-bold py-2 px-4 rounded" 
                        onClick={handleTransfer}
                        disabled={isTransferDisabled}>
                        Transfer
                    </button>
                </div>
            </Container>
        </section>
    )
}

export default Transfer;