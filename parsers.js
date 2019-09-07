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

const parseWinHop = hopData => {
  const regex = /^\s*(\d*)\s*(<?\d+\sms|\*)\s*(<?\d+\sms|\*)\s*(<?\d+\sms|\*)\s*([a-zA-Z0-9:.\s]+)/;
  const parsedData = new RegExp(regex, '').exec(hopData);

  let result = null;
  if (parsedData !== null) {
    result = {
      hop: parseInt(parsedData[1], 10),
      rtt1: parsedData[2],
      rtt2: parsedData[3],
      rtt3: parsedData[4],
      ip: parsedData[5].trim(),
    };
  }

  return result;
};
module.exports = { parseHop, parseWinHop };
