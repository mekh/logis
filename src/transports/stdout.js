class Stdout {
  constructor() {
    this.writer = process.stdout;
  }

  write(data) {
    this.writer.write(`${data}\n`);
  }
}

module.exports = {
  Stdout,
};
