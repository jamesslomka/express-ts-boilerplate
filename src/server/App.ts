import express from 'express';

export default class App {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.config();
  }

  public config(): void {
    this.app.set('port', process.env.PORT || 5000);
  }

  public start(): void {
    this.app.get('/', (_, res) => res.send('<h1>Hello World!</h1>'));
    this.app.listen(this.app.get('port'), () => {
      console.log('App is running at http://localhost:%d', this.app.get('port'));
    });
  }

  public routes(): void {
    // this.app.use('/', new )
  }
}
