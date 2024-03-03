const http = require('http');
const fs = require('fs');

function downloadFileAsync(url, dest){
  return new Promise((resolve, reject)=>{
      // 确保dest路径存在
    const file = fs.createWriteStream(dest);

    http.get(url, (res)=>{
      if(res.statusCode !== 200){
        reject(response.statusCode);
        return;
      }

      res.on('end', ()=>{
        console.log('download end');
      });

      // 进度、超时等

      file.on('finish', ()=>{
        console.log('finish write file')
        file.close(resolve);
      }).on('error', (err)=>{
        fs.unlink(dest);
        reject(err.message);
      })

      res.pipe(file);
    });
  });
}
exports.downloadFileAsync = downloadFileAsync;