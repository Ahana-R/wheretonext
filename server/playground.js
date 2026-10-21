const prices = [50, 80, 30];

const withGst = prices.map((price) => price + 10);

const doubled = prices.map((price) => price + price );

const cities = ["goa", "shimla", "ooty"];
const loud = cities.map((city) => city.toUpperCase())

const total = prices.reduce((piggyBank, price) => piggyBank + price, 0);
console.log("Total:", total);

const biggest = withGst.reduce((biggestSoFar, withGstcost) => Math.max(withGstcost,biggestSoFar) ,withGst[0]);
console.log("Biggest:", biggest);

console.log("Loud:", loud);

console.log("Before:", prices);
console.log("After:", withGst);
console.log("Doubled :", doubled);