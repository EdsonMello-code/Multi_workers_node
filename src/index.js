import cluster from 'cluster';
import express from 'express';
import os from 'os';

const app = express();

function fibonacci(num) {
  if (num === 0 || num === 1) {
    return num;
  }
  return fibonacci(num - 1) + fibonacci(num - 2);
}

const numbCore = os.cpus().length;
console.log(numbCore);
if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);

  for (let i = 0; i < numbCore; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} is died`);
  });
} else {
  app.get('/cluster', (req, res) => {
    let worker = cluster.worker.id;
    function fibonacci(num) {
      if (num === 0 || num === 1) {
        return num;
      }
      return fibonacci(num - 1) + fibonacci(num - 2);
    }
    return res.send(`Running on worker width id ==> ${worker}`);
  });

  app.listen(3333, () => console.log('Server running.'));
}
