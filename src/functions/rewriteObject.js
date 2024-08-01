export const rewriteRecallData = (data = {}) => {
  let newData = {
    Table: data.Table2,
    Table1: data.Table3,
    Table2: data.Table4,
    Table3: data.Table5,
    Table4: data.Table6,
    Table5: data.Table7,
    Table6: data.Table8,
    Table7: data.Table9,
    Table8: data.Table10,
    Table9: data.Table11,
    Table10: data.Table12,
    Table11: data.Table13,
    Table12: data.Table14,
  };
  return newData;
};

const getDifference = (array1, array2) => {
  return array1.filter((object1) => {
    return !array2.some((object2) => {
      return object1.id === object2.id;
    });
  });
};

export const compareArray = (arr1, arr2) => {
  const difference = [
    ...getDifference(arr1, arr2),
    ...getDifference(arr2, arr1),
  ];
  return difference;
};
