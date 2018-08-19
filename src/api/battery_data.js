import request from '@/utils/request'

export function getBatteryData() {
  return request({
    url: '/cwld/smartBatteryAction/getBatteryDataByParams.action',
    method: 'post'
  })
}
export function getBatteryStatusByParams(city) {
  return request({
    url: '/cwld/smartBatteryAction/getBatteryStatusByParams.action',
    method: 'post',
    params: { city: city }
  })
}

export function getBatteryAlarmNumByParams(city, startTime, endTime) {
  let params = {}

  if (city) {
    params.city = city
  }

  params.startTime = startTime
  params.endTime = endTime

  return request({
    url: '/cwld/smartBatteryAction/getBatteryAlarmNumByParams.action',
    method: 'post',
    params: params
  })
}

export function getBatteryDataByCity(city) {
  return request({
    url: '/cwld/smartBatteryAction/getBatteryDataByCity.action',
    method: 'post',
    data: { city: city }
  })
}

export function getBatteryTrackByParams(deviceId, startTime, endTime) {
  return request({
    url: '/cwld/smartBatteryAction/getBatteryTrackByParams.action',
    method: 'post',
    params: { deviceId: deviceId, startTime: startTime, endTime: endTime }
  })
}
