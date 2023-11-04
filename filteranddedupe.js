// VERSION 1.4
// require('../Tools/pluginsHelper');

// Playlist is available in m3u8 variable as Buffer object

//	For logging to hls-proxy console use:
//	globals.error('Your text of message');
//  globals.error(`Your text of message: ${variable}`);

// Define the grouptitlefilter
const grouptitlefilter = ["africa", "albania", "arabic", "australia", "belgium", "brazil", "canada french", "caribbean", "ex-ussr", "ex-yu", "filipino", "france", "germany", "greece", "india", "israel", "italy", "latino", "macedonia", "netherlands", "nordic", "poland", "portuguese", "romania", "russia", "spain"];

let linesArray = m3u8.toString().split('\n');
let skipChannels = [];

for (var i = 0; i < linesArray.length; i += 1) {
  var line = linesArray[i];
  var match = /group-title="([^"]+)"/.exec(line);
  if (match) {
    var groupTitle = match[1].toLowerCase();
    if (grouptitlefilter.includes(groupTitle)) {
      var tvgIdMatch = /tvg-id="([^"]+)"/.exec(line);
      if (tvgIdMatch) {
        var tvgId = tvgIdMatch[1];
        skipChannels.push(tvgId);
      }
    }
  }
}

for ( var i = linesArray.length-2; i > 0; i--) {	
  var line = linesArray[i];  
  var tvgIdMatch = /tvg-id="([^"]+)"/.exec(line);
  if (tvgIdMatch) {
    if (skipChannels.includes(tvgIdMatch[1])){
      linesArray.splice(i, 2); // Remove the line with tvg-id and the next line.
    }
  }
}


var uniqueLineIDs = {}; // Object to store unique lines
var uniqueLines = [];   //output array
uniqueLines.push('#EXTM3U\n')  

for (var i = 0; i < linesArray.length; i++) {
  var line = linesArray[i];
  if (line.trim() === "") {
      // Skip empty lines
      continue;
  }
  var tvgIdMatch = /tvg-id="([^"]+)"/.exec(line);  // Extract tvg-id value
  if (tvgIdMatch) {
	if (!uniqueLineIDs[tvgIdMatch[1]]) {
      uniqueLineIDs[tvgIdMatch[1]] = true;
      uniqueLines.push(line, linesArray[i + 1]);
	}
  }
}
globals.error(`${uniqueLines.length} lines in final m3u`);


for (let i = 0; i < uniqueLines.length; i++) {
print(uniqueLines[i] + '\n');
}
