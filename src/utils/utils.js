
import React from 'react';
import util from 'util';
import moment from 'moment';
import { Icon } from 'antd';
import IconFont from '../expand/Common/IconFont'
import { omit as _omit, pick as _pick,isEmpty } from 'lodash';

/* eslint no-useless-escape:0 import/prefer-default-export:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

const isUrl = path => reg.test(path);

//===============================自定义==============================
/**
 * 随机生成字母和数字
 */
const randomLetterAndNums = () => {
  return Math.random()
    .toString(36)
    .substr(2);
}

/**
 * 获取图标对象
 * @param {*} icon 
 */
const getIcon = (icon) => {
  if (!isEmpty(icon) && typeof icon === 'string') {
    if (isUrl(icon)) {
      return <Icon component={() => <img src={icon} alt="icon" className={"ant-pro-sider-menu-icon"} />} />;
    } else if (icon.startsWith('icon-')) {
      return <IconFont type={icon} />;
    } else {
      return <Icon type={icon} />;
    }
  }
  return icon;
};

/**
 * 将数值四舍五入后格式化. 
 * @param {*} num  数值(Number或者String)
 * @param {*} cent  要保留的小数位(Number)
 * @param {*} isThousand 是否需要千分位 0:不需要,1:需要(数值类型);
 * @return 格式的字符串,如'1,234,567.45'
 */
const formatNumber = (num, cent, isThousand) => {
  num = num.toString().replace(/\$|\,/g, '');
  if (isNaN(num)) num = "0";
  if (isNaN(cent)) cent = 0;
  cent = parseInt(cent);
  cent = Math.abs(cent);
  if (typeof isThousand == 'boolean') isThousand = isThousand ? "1" : "0";
  if (isNaN(isThousand)) isThousand = 0;
  isThousand = parseInt(isThousand);
  if (isThousand < 0) isThousand = 0;
  if (isThousand >= 1) isThousand = 1;
  sign = (num == (num = Math.abs(num)));
  num = Math.floor(num * Math.pow(10, cent) + 0.50000000001);
  cents = num % Math.pow(10, cent);
  num = Math.floor(num / Math.pow(10, cent)).toString();
  cents = cents.toString();
  while (cents.length < cent) cents = "0" + cents;
  if (isThousand == 0) return (cent == 0) ? (((sign) ? '' : '-') + num) : (((sign) ? '' : '-') + num + '.' + cents);
  for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++) {
    num = num.substring(0, num.length - (4 * i + 3)) + ',' + num.substring(num.length - (4 * i + 3));
  }
  return (cent == 0) ? (((sign) ? '' : '-') + num) : (((sign) ? '' : '-') + num + '.' + cents);
}

const getFieldValue = (value, data, field) => {
  if (field.convert) {
    return field.convert(value, data);
  } else {
    value = value || field.defaultValue;
    if (value && field.type) {
      switch (field.type) {
        case 'string': {
          value = String(value);
          break;
        }
        case 'number': {
          value = formatNumber(value, field.len, field.isThousand);
          break;
        }
        case 'boolean': {
          value = util.isBoolean(value) ? value : false;
          break;
        }
        case 'date': {
          value = moment(value).format(field.format);
          break;
        }
      }
    }
    return value;
  }
}

/**
 *  执行回调
 * @param {*} callback 
 * @param {Object} scope 
 * @param {Array} args 
 * @param {Long} delay 
 */
const callback = (callback, scope, args, delay) => {
  if (util.isNull(callback)) return;
  if (util.isString(callback)) {
    callback = scope[callback];
  }
  if (!util.isFunction(callback)) return;
  return callback.apply(scope, args);
}

/**
 * 删除origin对象的属性，并且赋予缺省值
 * @param {*} origin  来源对象
 * @param {*} props (...(string|string[])): 要被忽略的属性。（单独指定或指定在数组中。）
 * @param {*} target  缺省值
 */
const omit = (origin = {}, props, target = {}) => {
  const newObj = _omit(origin, props);
  for(var key in target){
      if(newObj[key] == null){
         newObj[key] = target[key];
      }
  }
  return newObj;
}


/**
 * 创建一个从 origin 中选中的属性的对象，并且赋予缺省值
 * @param {*} origin  来源对象
 * @param {*} props (...(string|string[])): 需要的属性。（单独指定或指定在数组中。）
 * @param {*} target  缺省值
 */
const pick = (origin = {}, props, target = {}) => {
  const newObj = _pick(origin, props);
  return { ...newObj, ...target };
}

const forEachTree = (nodes, callback) => {
  if (!nodes) return;
  nodes.forEach((node) => {
    if (node.childNodes) {
      forEachTree(node.childNodes, callback);
    }
    callback(node);
  })
}

export default {
  ...util,
  isUrl,
  randomLetterAndNums,
  getIcon,
  getFieldValue,
  callback,
  omit,
  pick,
  forEachTree,
};

export {
  isUrl,
  randomLetterAndNums,
  getIcon,
  getFieldValue,
  callback,
  omit,
  pick,
  forEachTree,
};
