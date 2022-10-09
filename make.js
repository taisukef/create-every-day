import { XML } from "https://js.sabae.cc/XML.js";
import { ArrayUtil } from "https://js.sabae.cc/ArrayUtil.js";
import { DateTime } from "https://js.sabae.cc/DateTime.js";

const xml = await Deno.readTextFile("rss.xml");
const data = XML.toJSON(xml);
//console.log(data);
const items = data.rss.channel.item;

// pubDate -> datetime
items.forEach(i => {
  const d = i.pubDate["#text"];
  const dt = new Date(d);
  delete i.pubDate;
  i.title = i.title["#text"];
  const ntag = i.title.indexOf(" #");
  i.tags = ntag == -1 ? "" : i.title.substring(ntag + 1).split(" ").join(",");
  if (ntag > 0) {
    i.title = i.title.substring(0, ntag);
  }
  i.body = i.description["#text"];
  delete i.description;
  i.guid = i.guid["#text"];
  i.dt = new DateTime(dt).toString();
});

// sort
items.sort((a, b) => a.dt.localeCompare(b.dt));

console.log(items[0]);
const years = ArrayUtil.toUnique(items.map(i => i.dt.substring(0, 4)));
console.log(years);

for (const year of years) {
  const list = items.filter(i => i.dt.startsWith(year));
  await Deno.writeTextFile("blog_" + year + ".json", JSON.stringify(list, null, 2));
}
