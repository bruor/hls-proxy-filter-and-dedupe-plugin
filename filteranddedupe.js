// VERSION 1.0
// require('../Tools/pluginsHelper');

// Define the grouptitlefilter
let grouptitlefilter = ["africa", "albania", "arabic", "australia", "belgium", "brazil", "canada french", "caribbean", "ex-ussr", "ex-yu", "filipino", "france", "germany", "greece", "india", "israel", "italy", "latino", "macedonia", "netherlands", "nordic", "poland", "portuguese", "romania", "russia", "spain"];

// Playlist is available in m3u8 variable as Buffer object
// Split the M3U8 content by lines
let lines = m3u8.toString().split('\n');

// Initialize an array to store channel objects
let channels = [];

// Regular expression to extract channel information
const regex = /#EXTINF:-1 tvg-id="([^"]+)" tvg-name="([^"]+)" tvg-type="([^"]+)" group-title="([^"]+)" tvg-logo="([^"]+),(.*)/;

// Loop through the lines to extract channel information
for (var i = 0; i < lines.length; i += 2) {
  if (i + 1 < lines.length) {
    let match = lines[i].match(regex);
    if (match) {
      let channel = {
        tvgid: match[1],
        tvgname: match[2],
        tvgtype: match[3],
        grouptitle: match[4],
        tvglogo: match[5],
        name: match[6],
        url: lines[i + 1]
      };
      channels.push(channel);
    }
  }
}

// Loop through the channels array and remove objects with matching grouptitles
for (let i = channels.length - 1; i >= 0; i--) {
  let channel = channels[i];
  if (grouptitlefilter.includes(channel.grouptitle.toLowerCase())) {
    channels.splice(i, 1); // Remove the channel if the grouptitle is in the filter
  }
}

// Create a Set to track unique tvgid values
let uniqueTvgIds = new Set();

// Filter and keep only unique channels based on their tvgid
let uniqueChannels = channels.filter(channel => {
  if (!uniqueTvgIds.has(channel.tvgid)) {
    uniqueTvgIds.add(channel.tvgid);
    return true;
  }
  return false;
});

// Recompose the uniqueChannels array into M3U8 format
let recomposedM3U8 = '#EXTM3U\n';
uniqueChannels.forEach(channel => {
  recomposedM3U8 +=
    `#EXTINF:-1 tvg-id="${channel.tvgid}" tvg-name="${channel.tvgname}" tvg-type="${channel.tvgtype}" group-title="${channel.grouptitle}" tvg-logo="${channel.tvglogo}",${channel.name}\n` +
    `${channel.url}\n`;
});

// Output the recomposed M3U8
print(recomposedM3U8);
