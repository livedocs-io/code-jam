import app from './app';

const port = process.env.PORT || 4000;
const env = process.env.ENV || 'development';

const server = app.listen(port, () => {
  console.log(
    `Server is running at: http://localhost:${port} in ${env} mode`
  );
});

export default server;
