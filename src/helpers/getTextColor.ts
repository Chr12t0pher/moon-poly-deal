import tinycolor from "tinycolor2";

const getTextColor = (backgroundColor: string) => {
  const color1 = tinycolor(backgroundColor);
  const isDark = color1.isDark();

  return isDark ? "#fff" : "#000";
};

export default getTextColor;
