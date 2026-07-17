const fs = require('fs');
const path = require('path');

const walk = (dir, done) => {
  let results = [];
  fs.readdir(dir, (err, list) => {
    if (err) return done(err);
    let i = 0;
    (function next() {
      let file = list[i++];
      if (!file) return done(null, results);
      file = path.resolve(dir, file);
      fs.stat(file, (err, stat) => {
        if (stat && stat.isDirectory()) {
          walk(file, (err, res) => {
            results = results.concat(res);
            next();
          });
        } else {
          if (file.endsWith('.jsx')) results.push(file);
          next();
        }
      });
    })();
  });
};

walk('src', (err, files) => {
  if (err) throw err;
  files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;
    
    // Replace $ inside template strings (e.g. `Price: $${price}`)
    content = content.replace(/\$\$\{/g, 'LKR ${');
    
    // Replace >$ inside JSX (e.g. <span>$150</span> or <span>${price}</span>)
    content = content.replace(/>\$/g, '>LKR ');
    
    // Replace ($) inside JSX (e.g. Daily Price ($))
    content = content.replace(/\(\$\)/g, '(LKR)');
    
    // Replace • $ inside JSX (e.g. • $150/Day)
    content = content.replace(/• \$/g, '• LKR ');

    // Replace DollarSign icon with LKR text block in AdminOverview and others
    content = content.replace(/<DollarSign className="[^"]*" \/>/g, '<span className="font-bold text-lg">LKR</span>');
    
    // Check if Revenue Overview ($)
    content = content.replace(/Overview \(\$\)/g, 'Overview (LKR)');
    
    // Handle cases where $ is followed by { but not preceded by > or •
    // For example: <span>${car.dailyPrice} x {calcDays} days</span>
    // Note: >$ already covers >${car.dailyPrice}
    
    if (content !== original) {
      fs.writeFileSync(file, content, 'utf8');
      console.log(`Updated ${file}`);
    }
  });
});
