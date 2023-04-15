const farmers = ['John', 'Mary', 'Peter', 'Alice', 'Tom'];
const millers = ['Miller A', 'Miller B', 'Miller C', 'Miller D', 'Miller E'];

const products = [];

for (let i = 0; i < 10; i++) {
  const farmerName = farmers[Math.floor(Math.random() * farmers.length)];
  const price = Math.floor(Math.random() * 1000) + 500;
  const unit = 'kg';
  const millerName = millers[Math.floor(Math.random() * millers.length)];

  products.push({
    farmerName,
    price,
    unit,
    millerName
  });
}

module.exports = products;
