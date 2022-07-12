import FireSword from "./firesword";
import Projectile from "../Projectile";

export const getWeaponType = (key) => {
  switch (key) {
    case "FireSword":
      return { name: "FireSword", sword: FireSword, max: 80 };
      break;

    case "NormalSword":
      return { name: "FireSword", sword: Projectile, max: 50 };
      break;
    default:
      break;
  }
};
