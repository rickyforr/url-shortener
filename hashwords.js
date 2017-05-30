const bcrypt = require('bcryptjs');

console.log(bcrypt.hashSync('abc', 10));
console.log(bcrypt.hashSync('123', 10));