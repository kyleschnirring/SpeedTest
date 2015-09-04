var speedTest    =  require('speedtest-net');
var ProgressBar  =  require('progress');
var chalk        =  require("chalk");

var test = speedTest({maxTime:5000});

var bar,pingTime;

// Event triggered when best Server is found.

test.on('testserver',function(server) {
   pingTime = server.bestPing;
});

// Invoke every time when download speed check begin
// Return completion value in percentage

test.on('downloadprogress',function(pct){
   prog('Checking Download Speed ',pct);
});

// Invoke every time when upload speed check begin
// Return completion value in percentage

test.on('uploadprogress',function(pct){
   prog('Checking Upload Speed ',pct);
});

// Invoke When final data recieved

test.on('data',function(data){
   console.log(chalk.cyan("Ping : "),Math.abs(pingTime),chalk.dim('ms'));
   console.log(chalk.cyan("Download Speed : ") + data.speeds.download + chalk.dim(" MBps"));
   console.log(chalk.cyan("Upload Speed : ") + data.speeds.upload + chalk.dim(" MBps"));
});

// in case of error, exit.

test.on('error',function(error){
   process.exit(1);
});

/*
   function : prog
   params : type and percentage.
   task : update the progress bar.
*/

function prog(what,pct){
   // if its completed, terminate current progress.
   if (pct>=100){
       if (bar) bar.terminate();
       bar=null;
       return;
   }
   // if bar object is not created
   if (!bar) {
       var green = '\u001b[42m \u001b[0m',
             red = '\u001b[41m \u001b[0m';
       bar = new ProgressBar(' '+what+' [:bar] :percent', {
           complete: green,
           incomplete: red,
           clear: true,
           width:40,
           total: 100
       });
   }
   // else update the bar with coming value.
   bar.update(pct/100);
}
