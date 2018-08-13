import request from '@/utils/request'

export function getBatteryData() {
  return request({
    url: '/cwld/smartBatteryAction/getBatteryDataByParams.action',
    method: 'post'
  })
}

export function getBatteryAlarmNum(query) {
  return request({
    url: '/cwld/smartBatteryAction/getBatteryAlarmNumByParams.action',
    method: 'post',
    params: query
  })
}
