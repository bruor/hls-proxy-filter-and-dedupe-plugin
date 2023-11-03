// VERSION 1.0
// require('../Tools/pluginsHelper');

// Define the grouptitlefilter
var grouptitlefilter = ["Africa", "albania", "ARABIC", "australia", "belgium", "brazil", "canada french", "caribbean", "EX-USSR", "EX-YU", "Filipino", "France", "Germany", "Greece", "india", "israel", "italy", "latino", "macedonia", "music", "netherlands", "nordic", "poland", "portuguese", "romania", "russia", "spain"];

// Playlist is available in m3u8 variable as Buffer object
// Split the M3U8 content by lines
var lines = m3u8.toString().split('\n');

// Initialize an array to store channel objects
var channels = [];

// Regular expression to extract channel information
var regex = /#EXTINF:-1 tvg-id="([^"]+)" tvg-name="([^"]+)" tvg-type="([^"]+)" group-title="([^"]+)" tvg-logo="([^"]+),(.*)/;

// Loop through the lines to extract channel information
for (var i = 0; i < lines.length; i += 2) {
  if (i + 1 < lines.length) {
    var match = lines[i].match(regex);
    if (match) {
      var channel = {
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

// Filter and remove channels matching grouptitlefilter
channels = channels.filter(channel => !grouptitlefilter.includes(channel.grouptitle.toLowerCase()));

// Create a Set to track unique tvgid values
var uniqueTvgIds = new Set();

// Filter and remove duplicates while keeping the first instance
var uniqueChannels = channels.filter(channel => {
  if (!uniqueTvgIds.has(channel.tvgid)) {
    uniqueTvgIds.add(channel.tvgid);
    return true;
  }
  return false;
});

// Recompose the uniqueChannels array into M3U8 format
var recomposedM3U8 = '#EXTM3U\n';
uniqueChannels.forEach(channel => {
  recomposedM3U8 +=
    `#EXTINF:-1 tvg-id="${channel.tvgid}" tvg-name="${channel.tvgname}" tvg-type="${channel.tvgtype}" group-title="${channel.grouptitle}" tvg-logo="${channel.tvglogo}",${channel.name}\n` +
    `${channel.url}\n`;
});

// Print the recomposed M3U8
print(recomposedM3U8);
