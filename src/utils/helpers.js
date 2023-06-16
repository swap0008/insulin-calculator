import { notification } from "antd"

export const showNotification = (type = '', message = '', description = '') => {
  notification.open({
    type,
    message,
    description
  });
}

export const databaseKeyNameMap = {
  'morningInsulin': 'Morning Insulin',
  'morningSugar': 'Morning Sugar',
  'nightInsulin': 'Night Insulin',
  'nightSugar': 'Night Sugar',
  'baseSugarValue': 'Base Sugar Value'
};