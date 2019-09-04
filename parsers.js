const parseHop = hopData => {
  const pattern = /^\s*(\d+)\s+(?:([a-zA-Z0-9:.]+)\s+([0-9.]+\s+ms)|(\*))/;
  const parsedData = new RegExp(pattern, '').exec(hopData);
  let result = null;

  if (parsedData !== null) {
    if (parsedData[4] === undefined) {
      result = {
        hop: parseInt(parsedData[1], 10),
        ip: parsedData[2],
        rtt1: parsedData[3],
      };
    } else {
      result = {
        hop: parseInt(parsedData[1], 10),
        ip: parsedData[4],
        rtt1: parsedData[4],
      };
    }
  }
  return result;
};

module.exports = parseHop;
