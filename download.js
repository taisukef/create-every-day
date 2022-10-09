const xml = await (await fetch("https://fukuno.jig.jp/rss.xml")).text();
await Deno.writeTextFile("rss.xml", xml);
