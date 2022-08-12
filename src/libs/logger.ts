class Logger {
  constructor() {
    if (process.env.NODE_ENV) this.env = process.env.NODE_ENV;
    else throw Error("undefined NODE_ENV");
  }

  private env: string;

  debug = (...data: any[]) => {
    if (this.env === "development") console.log(...data);
  };
}

const logger = new Logger();
export default logger;
