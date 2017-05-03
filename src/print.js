'use strict';
// printing lists of qr codes
const gd = require('node-gd');
const cfg = require('../config.json');
const fs = require('fs');

const create_item = require('./item.js');
//const gen_pairs = require('./keys.js');
const draw = require('./draw.js');

const block_size = Math.floor(cfg.image.qr_code_size * cfg.image.ratio + cfg.blocks.padding * 2);

const print_list = (pairs) => {
  // gen size
  let list = gd.createSync(block_size * cfg.blocks.max_width, block_size * cfg.blocks.max_height);
  list.colorAllocate(255, 255, 255);

  const max_height = cfg.blocks.max_height;
  const max_width = cfg.blocks.max_width;

  for (let i = 0; i < max_height; i++) {
    for (let j = 0; j < max_width; j++) {
      const block = create_block(pairs[i * max_width + j]);
      block.copy(list, block_size * j, block_size * i, 0, 0, block_size, block_size);
      block.destroy();
    }
  }

  return list;
};

const create_block = (pair) => {
  let block = gd.createSync(block_size, block_size);
  block.colorAllocate(255, 255, 255);
  const black = block.colorAllocate(0, 0, 0);

  const item = create_item(pair);

  item.copy(block, (block.width - item.width) / 2, (block.width - item.width) / 2, 0, 0, item.width, item.height);

  const y = Math.floor((cfg.blocks.padding * 1.5) + item.height - (cfg.blocks.serial_size / 2));
  const x = Math.floor(block.width / 2 - cfg.blocks.serial_size * (pair.serial.length / 2));

  block.stringFT(black, cfg.blocks.font_path, cfg.blocks.serial_size, 0, x, y, pair.serial);
  block.rectangle(0, 0, block_size, block_size, black);

  item.destroy();

  return block;
};

const print_lists = (pairs) => {
  const size = cfg.blocks.max_width * cfg.blocks.max_height;

  for (let i = 0; i < pairs.length; i += size) {
    const list = print_list(pairs.slice(i, i + size));
    list.savePng(`./output/list_${Math.floor(i / size)}.png`, 0, (err) => {
      if (err)
        console.log(err);

      list.destroy();
    });
  }
};

module.exports = print_lists;
