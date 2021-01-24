import {parse} from 'papaparse'

export default async function getData() {
  return await new Promise(complete => parse(`${process.env.PUBLIC_URL}/youth-services-data.csv`, {download: true, complete, header: true, delimiter: ','}))
}