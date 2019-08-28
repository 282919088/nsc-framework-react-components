/**
 * 统一处理action
 * @param {*} type
 */
export const createAction = type => payload => ({ type, payload });
/**
 * 统一处理action
 * @param {*} type
 */
export const createActions = type => payload => callback => ({ type, payload, callback });

/**
 * 网络检查
 * @param {*} response
 */
export const net = response => response && response.code == 200;

/**
 * 网络请求
 */
import request from './request';

export default request;