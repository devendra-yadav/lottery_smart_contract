const {loadFixture} = require('@nomicfoundation/hardhat-network-helpers');
const {ethers} = require('hardhat');
const {expect} = require('chai');

let formatEther = (n)=>{
    return ethers.utils.parseEther(n.toString());
}

let humanReadableAmount = (n) => {
    return ethers.utils.formatEther(n);
}

describe('Lottery', ()=>{
    async function contractDeployment(){
        const [deployer, user1, user2, user3, user4, user5] = await ethers.getSigners();

        const Lottery = await ethers.getContractFactory("Lottery");
        const entryFee = formatEther(2);
        const lottery = await Lottery.deploy(entryFee);
        await lottery.deployed();
        
        return {lottery, deployer, entryFee, user1, user2, user3, user4, user5};
        
    }

    describe("Contract Deployement", ()=>{
        it("should deploy the contract", async ()=>{
            const {lottery} = await loadFixture(contractDeployment);

            console.log(`Lottery contract deployed successfully at ${lottery.address}`);

        })
    })

    describe("Lottery functions", ()=>{
        it("users should be able to participate in lottery", async () => {
            const {lottery, deployer, entryFee, user1, user2, user3, user4, user5} = await loadFixture(contractDeployment);

            await lottery.connect(user1).participateInLottery({value: entryFee});
            await lottery.connect(user2).participateInLottery({value: entryFee});
            await lottery.connect(user3).participateInLottery({value: entryFee});
            await lottery.connect(user4).participateInLottery({value: entryFee});
            await lottery.connect(user5).participateInLottery({value: entryFee});

            let contractBalance =  humanReadableAmount( await ethers.provider.getBalance(lottery.address));
            console.log(`Contract Balance: ${contractBalance}`);
            
            let participantCount = await lottery.getNumberOfParticipants();
            console.log(`Total participants : ${participantCount}`);

            expect(participantCount).to.equal(5);
            expect(contractBalance).to.equal('10.0');

        })

        it("after locking no participants should be able to participate", async ()=>{
            const {lottery, deployer, entryFee, user1, user2, user3, user4, user5} = await loadFixture(contractDeployment);
            await lottery.connect(user1).participateInLottery({value: entryFee});
            await lottery.connect(user2).participateInLottery({value: entryFee});
            await lottery.connect(user3).participateInLottery({value: entryFee});
            await lottery.connect(user4).participateInLottery({value: entryFee});
            await lottery.lockLottery();
           
            await expect(lottery.connect(user5).participateInLottery({value: entryFee})).to.be.reverted;
        })

        it("should be able to choose winner and transfer amount to the winner", async () => {
            const {lottery, deployer, entryFee, user1, user2, user3, user4, user5} = await loadFixture(contractDeployment);
            await lottery.connect(user1).participateInLottery({value: entryFee});
            await lottery.connect(user2).participateInLottery({value: entryFee});
            await lottery.connect(user3).participateInLottery({value: entryFee});
            await lottery.connect(user4).participateInLottery({value: entryFee});
            await lottery.connect(user4).participateInLottery({value: entryFee});
            
            await lottery.lockLottery();
            

            let contractBalance = humanReadableAmount(await ethers.provider.getBalance(lottery.address));
            console.log(`Contract Balance: ${contractBalance}`);
            expect(contractBalance).to.equal('10.0');
            await lottery.chooseWinner();
           
            contractBalance = humanReadableAmount(await ethers.provider.getBalance(lottery.address));
            console.log(`Contract Balance: ${contractBalance}`);
            expect(contractBalance).to.equal('0.0');
        })
    })
})