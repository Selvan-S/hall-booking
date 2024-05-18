import fs from "fs";

/**
 * Task
 *
 * read a file that is given in command promt
 */

const [, , filepath] = process.argv;
fs.readFile(filepath, "utf-8", (err, data) => {
  if (err) {
    console.log("ERROR: ", err);
  } else {
    const parseData = JSON.parse(data);
    console.log(parseData.port);
  }
});
