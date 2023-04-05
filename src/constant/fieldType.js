// 组件枚举
export const FIELD_TYPE_INPUT = '1';
export const FIELD_TYPE_TEXTAREA = '2';
export const FIELD_TYPE_INT = '3';
export const FIELD_TYPE_FLOAT = '4';
export const FIELD_TYPE_SELECT = '5';
export const FIELD_TYPE_MULTI_SELECT = '6';
export const FIELD_TYPE_TAG_SELECT = '7';
export const FIELD_TYPE_SEARCH = '8';
export const FIELD_TYPE_MULTI_SEARCH = '9';
export const FIELD_TYPE_TREE_SELECT = '10';
export const FIELD_TYPE_MULTI_TREE_SELECT = '11';
export const FIELD_TYPE_DATE = '12';
export const FIELD_TYPE_RANGE = '13';
export const FIELD_TYPE_SWITCH = '14';
export const FIELD_TYPE_RADIO = '15';
export const FIELD_TYPE_CHECKBOX = '16';

export const FIELD_TYPE_FIELD_GROUP = '20';

export const FIELD_TYPE_COMPONENT = '99';


export const IS_FIELD_TYPE_TEXT_MAP = {
  [FIELD_TYPE_INPUT]: 1,
  [FIELD_TYPE_TEXTAREA]: 1,
}

export const IS_FIELD_TYPE_NUMBER_MAP = {
  [FIELD_TYPE_FLOAT]: 1,
  [FIELD_TYPE_INT]: 1,
}

export const IS_FIELD_TYPE_INPUT_MAP = {
  ...IS_FIELD_TYPE_TEXT_MAP,
  ...IS_FIELD_TYPE_NUMBER_MAP,
}

export const IS_FIELD_TYPE_LIST_MAP = {
  [FIELD_TYPE_SELECT]: 1,
  [FIELD_TYPE_MULTI_SELECT]: 1,
  [FIELD_TYPE_TAG_SELECT]: 1,
  [FIELD_TYPE_RADIO]: 1,
  [FIELD_TYPE_CHECKBOX]: 1,
  [FIELD_TYPE_SWITCH]: 1,
}

export const IS_FIELD_TYPE_TREE_LIST_MAP = {
  [FIELD_TYPE_TREE_SELECT]: 1,
  [FIELD_TYPE_MULTI_TREE_SELECT]: 1,
}

export const IS_FIELD_TYPE_SEARCH_MAP = {
  [FIELD_TYPE_SEARCH]: 1,
  [FIELD_TYPE_MULTI_SEARCH]: 1,
}

export const IS_FIELD_TYPE_DATA_MAP = {
  [FIELD_TYPE_DATE]: 1,
  [FIELD_TYPE_RANGE]: 1,
}
