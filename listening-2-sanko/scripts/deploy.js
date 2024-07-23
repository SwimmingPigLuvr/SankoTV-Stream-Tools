async function main() {
  const AuthContract = await ethers.getContractFactory('AuthContract');
  console.log('deploying AuthContract...');
  const authContract = await AuthContract.deploy();
  await authContract.deployed();
  console.log('AuthContract deployed to: ', authContract.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
