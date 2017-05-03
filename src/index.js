const print_lists = require('./print.js');
const gen_pairs = require('./keys.js');

gen_pairs()
  .then(pairs => print_lists(pairs))
  .catch(err => console.log(err));
