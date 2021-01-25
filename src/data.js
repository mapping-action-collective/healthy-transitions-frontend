import {parse} from 'papaparse'

export default async function getData() {
  return await new Promise((resolve, reject) => parse(`${process.env.PUBLIC_URL}/youth-services-data.csv`, {complete: resolve, download: true, header: true, delimiter: ','}))
}