import request from '@/utils/request'

const service = '/cwld/smartBatteryAction/getBatteryDataByParams.action'

export function getBatteryData() {
  return request({
    url: service,
    method: 'post'
  })
}
