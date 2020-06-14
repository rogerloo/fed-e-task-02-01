const fs = require('fs');
const path = require('path');

function read(root, filter, files, prefix) {
    prefix = prefix || '';
    files = files || [];
    filter = filter || noDotFiles; 
    const dir = path.join(root, prefix);  
    if (!fs.existsSync(dir)) return files;  
    if (fs.statSync(dir).isDirectory()) {
      fs.readdirSync(dir)
        .filter(filter)
        .forEach(function (name) {
          read(root, filter, files, path.join(prefix, name));
        }); 
    }else {
        files.push(prefix);  
    }
    return files
}
function noDotFiles(x) {  
    return x[0] !== '.';
}

// function read(root, fn, context) {
//     fs.readdir(root, (err, files) => {
//         if (err) {
//             return 
//         }
//         files.forEach( function (file){
//             if (fs.existsSync(context.sourceRoot()+'\\'+file)) {
//                 read(context.sourceRoot()+'\\'+file, fn, context)
//             } else {
//                 fn( file )
//             }
//         })
//     })
// }

module.exports = {
    read
};