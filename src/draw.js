'use strict';

const gd = require('node-gd');
const qr = require('qr-image');

const draw_border = (image, type, options) => {
  if (type == "none" || type == null)
    return;

  const padding = (options.padding != undefined) ? options.padding : { x: 0, y: 0 };
  const width = options.width;
  const height = (options.height != undefined) ? options.height : width;

  const border_color = image.colorAllocate(0, 0, 0);
  const bg_color = image.colorAllocate(255, 255, 255);

  if (type == "square") {
    image.filledRectangle(padding.x, padding.y, width - padding.x, height - padding.y, border_color);
    image.filledRectangle(padding.x + options.radius, padding.y + options.radius, width - padding.x - options.radius, height - padding.y - options.radius, bg_color);
  }

  if (type == "circle") {
    const center = Math.floor(image.width / 2);
    image.filledEllipse(center, center, width, height, border_color);
    image.filledEllipse(center, center, width - options.radius, height - options.radius, bg_color);
  }
};

const draw_qr = (image, text, options) => {
  const matrix = qr.matrix(text);
  const pixels = matrix_to_object(matrix);

  const qr_code = draw_default_qr(pixels, matrix.length);

  const center = Math.floor((image.width - options.size) / 2);

  qr_code.copyResized(image, center, center, 0, 0, options.size, options.size, qr_code.width, qr_code.height);
};

// padding-y
const draw_serial = (image, serial, options) => {
  const x = Math.floor((image.width / 2) - (options.size * serial.length / 2));
  const y = Math.floor(image.height - options.padding - options.size - 10);

  const color = image.colorAllocate(0, 0, 0);

  image.stringFT(color, options.font, options.size, 0, x, y, serial);
};

const draw_default_qr = (pixels, size) => {
  let image = gd.createSync(size, size);

  image.colorAllocate(255, 255, 255);
  const black = image.colorAllocate(0, 0, 0);

  for (let i = 0; i < pixels.length; i++)
    image.setPixel(pixels[i].x, pixels[i].y, black);

  return image;
};

const matrix_to_object = (matrix) => {
  let array = new Array();
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      if (matrix[i][j] == 1)
        array.push({ x: i, y: j });
    }
  }
  return array;
};

module.exports = {
  border: draw_border,
  qr: draw_qr,
  serial: draw_serial
};
