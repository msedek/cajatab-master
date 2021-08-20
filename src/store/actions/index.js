export { turnShadowCardOff } from "./cShadow";

export { getOrder, sendOrder, addOrder, setPax } from "./orderNote";

export { getTables, setTableNumber, getMesaID, setMesaEstado } from "./tables";

export {
  passItemToCheck,
  passItemToList,
  setIndexCheck,
  setIndexSubCheck
} from "./itemCheck";

export { fillChecks } from "./finalCheck";

export { getCatalog, sendItem, clearCatalog } from "./catalog";

export {
  saveClientZoho,
  setCajeroId,
  setFondoId,
  setFirstTitle,
  setSecondTitle,
  setThirdTitle,
  setFirstData,
  setSecondData,
  setThirdData,
  setFirstTop,
  setSecondTop,
  setFirstBottom,
  setSecondBottom,
  setTextAlignFirstBottom,
  setFontSizeSecondBottom,
  setFontWeightSecondBottom,
  setTopBarVisibility,
  setCargo,
  saveToken
} from "./topBarState";

export { setOrder } from "./checkState";

export { getRecargos } from "./recargos";
