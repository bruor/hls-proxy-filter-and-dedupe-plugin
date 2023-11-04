// VERSION 1.4
// require('../Tools/pluginsHelper');

// Playlist is available in m3u8 variable as Buffer object

//	For logging to hls-proxy console use:
//	globals.error('Your text of message');
//
var tempm3u = m3u8;

// Define the grouptitlefilter
var grouptitlefilter = ["africa", "albania", "arabic", "australia", "belgium", "brazil", "canada french", "caribbean", "ex-ussr", "ex-yu", "filipino", "france", "germany", "greece", "india", "israel", "italy", "latino", "macedonia", "netherlands", "nordic", "poland", "portuguese", "romania", "russia", "spain"];

// Playlist is available in m3u8 variable as Buffer object
// Split the M3U8 content by lines
var lines = m3u8.toString().split('\n');
globals.error(lines.length.toString());
globals.error("number of lines");
// Initialize an array to store channel objects
var channels = [];
var filteredChannels = [];

// Regular expression to extract channel information
const regex = /#EXTINF:-1 tvg-id="(.*?)" tvg-name="(.*?)" tvg-type="(.*?)" group-title="(.*?)" tvg-logo="(.*?)",(.*)/;

//count channels found
var channelsFound = 0;

// Loop through the lines to extract channel information
for (var i = 0; i < lines.length; i += 2) {
  if (i + 1 < lines.length && lines[i].startsWith("#EXTINF")) {
	globals.error(lines[i]);
	var match = lines[i].match(regex);
    if (match) {
	  globals.error("line matched");
      var channel = {
        tvgid: match[1],
        tvgname: match[2],
        tvgtype: match[3],
        grouptitle: match[4],
        tvglogo: match[5],
        name: match[6],
        url: lines[i + 1]
      };
	  //channels.push(channel);
	  channelsFound++;
	  globals.error(`matched ${channelsFound.toString()} channels from m3u`);
    }
	else{globals.error("line didn't match");}
  }
}

//FOR SOME REASON THIS CODE CANNOT HANDLE MORE THAN 765 CHANNELS.  THE LOOP ABOVE WILL EXIT EARLY AND CONTINUE EXECUTION ONCE THAT LIMIT IS HIT. 


globals.error(`found ${channelsFound.toString()} channels`)
globals.error(`getting ready to filter ${channels.length.toString()} channels`);

// Loop through the channels array and remove objects with matching grouptitles
for (var i = channels.length - 1; i >= 0; i--) {
  var channel = channels[i];
  if (grouptitlefilter.includes(channel.grouptitle.toLowerCase())) {
    globals.error(channel.grouptitle.toString());
	channels.splice(i, 1); // Remove the channel if the grouptitle is in the filter
	globals.error("channel spliced out");
	globals.error(channels.length);
  }
}


//doesn't work for some reason? 
// Loop through the channels array and copy channels that don't match filter groups to filteredChannels
/*
for (var i = channels.length - 1; i >= 0; i--) {
  var channel = channels[i];
  if (!grouptitlefilter.includes(channel.grouptitle.toLowerCase())) {
    filteredChannels.push(channel); // Copy the channel if grouptitle is not in the filter
  }
}
*/

// Create a Set to track unique tvgid values
let uniqueTvgIds = new Set();


// Filter and keep only unique channels based on their tvgid
/*
let uniqueChannels = channels.filter(channel => {
  if (!uniqueTvgIds.has(channel.tvgid)) {
    uniqueTvgIds.add(channel.tvgid);
    return true;
  }
  return false;
});
*/

// Recompose the uniqueChannels array into M3U8 format
function recomposeChannels(channel) {
  return (
    `#EXTINF:-1 tvg-id="${channel.tvgid}" tvg-name="${channel.tvgname}" tvg-type="${channel.tvgtype}" group-title="${channel.grouptitle}" tvg-logo="${channel.tvglogo}",${channel.name}\n` +
    `${channel.url}\n`
  );
}

/*
let recomposedM3U8 = '#EXTM3U\n';
for (let i = 0; i < uniqueChannels.length; i++) {
  recomposedM3U8 += recomposeChannel(uniqueChannels[i]);
}
*/

//recompose from filteredChannels var
/*
let recomposedM3U8 = '#EXTM3U\n';
for (let i = 0; i < filteredChannels.length; i++) {
  recomposedM3U8 += recomposeChannels(filteredChannels[i]);
}
*/

//recompose from channels var
let recomposedM3U8 = '#EXTM3U\n';
for (let i = 0; i < channels.length; i++) {
  recomposedM3U8 += recomposeChannels(channels[i]);
}
//error(recomposedM3U8);

// Output the recomposed M3U8
//print(recomposedM3U8);
print(tempm3u);
