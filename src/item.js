'use strict';
// one qr code + border

const draw = require('./draw.js');
const cfg = require('../config.json').image;
const gd = require('node-gd');

const create_item = (pair) => {
  const size = Math.floor(cfg.qr_code_size * cfg.ratio);

  let item = gd.createSync(size, size);

  item.colorAllocate(255, 255, 255);

  draw.border(item, cfg.border_type, {
    width: size,
    height: size,
    radius: cfg.border_radius
  });

  draw.qr(item, pair.private, {
    size: cfg.qr_code_size,
  });

  return item;
};

module.exports = create_item;
