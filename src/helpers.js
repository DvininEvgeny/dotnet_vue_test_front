import { apiUsers } from '@/urls'

export function sendRequestXHR(method, url, body = '', context = null) {
   return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      xhr.open(method, url)
      xhr.responseType = 'json'
      xhr.setRequestHeader('Content-Type', 'application/json')

      if (method === 'POST') {
         xhr.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
               sendRequestXHR('GET', apiUsers).then(data => (context.rows = data))
            }
         }
      }

      xhr.onload = () => {
         if (xhr.status >= 400) {
            reject(xhr.response)
         } else {
            resolve(xhr.response)
         }
      }

      xhr.onerror = () => {
         reject(xhr.response)
      }

      xhr.send(JSON.stringify(body))
   })
}
