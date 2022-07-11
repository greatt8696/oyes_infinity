import FireSword from "./firesword";
import Projectile from "../Projectile";

export const getWeaponType = (key) => {
  switch (key) {
    case "FireSword":
      return { sword: FireSword, max: 30 };
      break;

    case "NormalSword":
      return { sword: Projectile, max: 50 };
      break;
    default:
      break;
  }
};
