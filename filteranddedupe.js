// Your M3U8 content
var m3u8 = `
#EXTM3U
#EXTINF:-1 tvg-id="5.star.max.eastern.us" tvg-name="5.star.max.eastern.us" tvg-type="live" group-title="US" tvg-logo="https://media.tv4.live/5.star.max.eastern.us.png",5 Star Max (East)
https://tvnow.best/api/stream/gary@wizardsolutions.ca/192284/livetv.epg/5.star.max.eastern.us.m3u8
#EXTINF:-1 tvg-id="ae.us.eastern.us" tvg-name="ae.us.eastern.us" tvg-type="live" group-title="US" tvg-logo="https://media.tv4.live/ae.us.eastern.us.png",A&E (East) US
https://tvnow.best/api/stream/gary@wizardsolutions.ca/192284/livetv.epg/ae.us.eastern.us.m3u8
#EXTINF:-1 tvg-id="cnn.us" tvg-name="cnn.us" tvg-type="live" group-title="US" tvg-logo="https://media.tv4.live/cnn.us.png",CNN US
https://tvnow.best/api/stream/gary@wizardsolutions.ca/192284/livetv.epg/cnn.us.m3u8
#EXTINF:-1 tvg-id="animal.planet.us.east.us" tvg-name="animal.planet.us.east.us" tvg-type="live" group-title="US" tvg-logo="https://media.tv4.live/animal.planet.us.east.us.png",Animal Planet (East) US
https://tvnow.best/api/stream/gary@wizardsolutions.ca/192284/livetv.epg/animal.planet.us.east.us.m3u8
#EXTINF:-1 tvg-id="antenna.network.us" tvg-name="antenna.network.us" tvg-type="live" group-title="US" tvg-logo="https://media.tv4.live/antenna.network.us.png",Antenna Network
https://tvnow.best/api/stream/gary@wizardsolutions.ca/192284/livetv.epg/antenna.network.us.m3u8
#EXTINF:-1 tvg-id="cnn.us" tvg-name="cnn.us" tvg-type="live" group-title="News" tvg-logo="https://media.tv4.live/cnn.us.png",CNN US
https://tvnow.best/api/stream/gary@wizardsolutions.ca/192284/livetv.epg/cnn.ca.m3u8
#EXTINF:-1 tvg-id="arena.sport.1.ex" tvg-name="arena.sport.1.ex" tvg-type="live" group-title="Sports" tvg-logo="https://media.tv4.live/arena.sport.1.ex.png",Arena Sport 1 EX-YU
https://tvnow.best/api/stream/gary@wizardsolutions.ca/192284/livetv.epg/arena.sport.1.ex.m3u8
#EXTINF:-1 tvg-id="cnn.ca" tvg-name="cnn.ca" tvg-type="live" group-title="Canada" tvg-logo="https://media.tv4.live/cnn.ca.png",CNN CA
https://tvnow.best/api/stream/gary@wizardsolutions.ca/192284/livetv.epg/cnn.ca.m3u8
#EXTINF:-1 tvg-id="arena.sport.1.rs" tvg-name="arena.sport.1.rs" tvg-type="live" group-title="EX-YU" tvg-logo="https://media.tv4.live/arena.sport.1.rs.png",Arena Sport 1
https://tvnow.best/api/stream/gary@wizardsolutions.ca/192284/livetv.epg/arena.sport.1.rs.m3u8
`;

// Split the M3U8 content by lines
var lines = m3u8.split('\n');

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

// Define the grouptitlefilter
var grouptitlefilter = ["EX-YU", "RU"];

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
console.log(recomposedM3U8);
