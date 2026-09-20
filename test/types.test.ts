import breakword = require('breakword');

const index: number = breakword('abc', 2);
const cells: 0 | 1 | 2 = breakword.width('a');

void index;
void cells;

// @ts-expect-error width() requires a string
breakword.width(1);
