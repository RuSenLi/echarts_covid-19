import axios from 'axios'

const server = axios.create({
  baseURL: 'https://api.inews.qq.com/newsqa/v1/query/inner/publish/modules/list?modules=localCityNCOVDataList,diseaseh5Shelf'
})

export const getApiList = () => server.post('').then(res => res.data.data) 