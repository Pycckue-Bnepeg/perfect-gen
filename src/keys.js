'use strict';

const cfg = require('../config.json').keys;
const fs = require('fs');
const exec = require('child_process').exec;

// circle and square

const gen_pairs = () => {
  return new Promise((resolve, reject) => {
    const tmp_list = '/tmp/list_of_prefixes';

    let list = new String();
    for (let i = 1; i <= cfg.count; i++)
      list += `${configure_prefix(i)}\n`;

    fs.writeFileSync(tmp_list, list);

    exec(`${cfg.vanitygen_path} -f ${tmp_list}`, (err, stdout, stderr) => {
      if (err)
        return reject(err);

      const matches = stdout.match(/Address: (\w+)\nPrivkey: (\w+)/g);

      if (matches == null)
        return reject("can't match addresses and private keys");

      let pairs = new Array();

      for (const match of matches) {
        const submatch = match.match(/Address: (\w+)\nPrivkey: (\w+)/);
        pairs.push({
          public: submatch[1],
          private: submatch[2],
          serial: submatch[1].substring(1, cfg.prefix.length + cfg.serial.count + 1)
        });
      }

      fs.unlinkSync(tmp_list);
      resolve(pairs);
    });
  });
};

const configure_prefix = index => {
  const prefix = (cfg.prefix != null) ? cfg.prefix : "";
  const postfix = (cfg.postfix != null) ? cfg.postfix : "";

  return `1${prefix}${get_serial(index)}${postfix}`;
};

const get_serial = value => {
  let serial = new String();

  const count = cfg.serial.count;
  const replacement = cfg.serial.replacement;

  for (let i = 0; i < count; i++) {
    if (value >= 0 && value < 1) {
      serial = replacement + serial;
    } else {
      const symbol = (value % 10).toString();
      value = Math.trunc(value / 10);
      serial = symbol + serial;
    }
  }

  return serial;
};

module.exports = gen_pairs;
