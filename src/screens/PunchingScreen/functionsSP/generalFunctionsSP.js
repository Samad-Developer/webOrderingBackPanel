// import mp3 from "../assets/sounds/swiftly.mp3";

export const delay = (cb, time) => {
  setTimeout(() => {
    cb();
  }, time);
};

export const deleteArrayOnject = (array, IdName, deleteID, count) => {
  if (array !== undefined) {
    let index = array.findIndex((x) => x[IdName] === deleteID);
    return array.splice(index, count);
  }
};

// export const playNotificationSound = () => {
//   const myAudio = new Audio(mp3);
//   myAudio.play();
// };

export const getRandomNumber = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
};

export const getRandomAlphaNumericString = (length, sp) => {
  return Math.random().toString(length).slice(sp);
};

export const getFloatValue = (value, fixedValue = 2) => {
  return parseFloat(value).toFixed(fixedValue);
};

export function currencyFormat(num) {
  if (num === null) return 0;
  else return "" + num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}

export const removeParanthesis = (str) => {
  return str
    .split("")
    .filter(
      (item) =>
        item !== ")" &&
        item !== "(" &&
        item !== "*" &&
        item !== "+" &&
        item !== "?" &&
        item !== "\\" &&
        item !== "|"
    )
    .join("");
};
export const removeCharectersAndtoLowerCase = (str) => {
  let _str = removeParanthesis(str);
  return _str.replace(/(?:^|})(.*?)(?:$|{)/g, function ($0, $1) {
    return $1.toLowerCase();
  });
};
export const removeCharectersAndtoUpperCase = (str) => {
  let _str = removeParanthesis(str);
  return _str.replace(/(?:^|})(.*?)(?:$|{)/g, function ($0, $1) {
    return $1.toUpperCase();
  });
};

export const isNullValue = (value) => {
  if (["", null, undefined].includes(value)) return false;
  return true;
};

export const nFormatter = (num, digits) => {
  const lookup = [
    { value: 1, symbol: "" },
    { value: 1e3, symbol: "K" },
    { value: 1e6, symbol: "M" },
    { value: 1e9, symbol: "G" },
    { value: 1e12, symbol: "T" },
    { value: 1e15, symbol: "P" },
    { value: 1e18, symbol: "E" },
  ];
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  var item = lookup
    .slice()
    .reverse()
    .find(function (item) {
      return num >= item.value;
    });
  return item
    ? (num / item.value).toFixed(digits).replace(rx, "$1") + item.symbol
    : "0";
};
