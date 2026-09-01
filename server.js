/* Minimal static server — no dependencies. Run: node server.js  then open http://localhost:8000 */
const http = require('http');
const fs = require('fs');
const path = require('path');
const ROOT = __dirname;
const PORT = 8000;
const TYPES = {'.html':'text/html','.css':'text/css','.js':'text/javascript','.json':'application/json','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.svg':'image/svg+xml','.gif':'image/gif','.ico':'image/x-icon','.xml':'application/xml','.txt':'text/plain','.woff2':'font/woff2'};
http.createServer((req,res)=>{
  let p = decodeURIComponent(req.url.split('?')[0]);
  if(p==='/') p='/index.html';
  let f = path.join(ROOT, p);
  if(!f.startsWith(ROOT)){res.writeHead(403);return res.end('403');}
  fs.readFile(f,(err,data)=>{
    if(err){res.writeHead(404,{'Content-Type':'text/html'});return res.end('<h1>404</h1>');}
    res.writeHead(200,{'Content-Type':TYPES[path.extname(f).toLowerCase()]||'application/octet-stream'});
    res.end(data);
  });
}).listen(PORT,()=>console.log(`BetEdge running: http://localhost:${PORT}`));
