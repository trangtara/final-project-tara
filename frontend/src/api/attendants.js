// const API_URL = 'https://event-check-in-app.herokuapp.com/api'
const API_URL = 'http://localhost:8080/api'
// const API_REGISTER_URL = `${API_URL}/registration`
// const API_SENDQRCODE_URL = `${API_URL}/sendqrcode`
// const API_DELETEATTENDANT_URL = `${API_URL}/delete`
const API_ALLATTENDANTS_URL = `${API_URL}/attendants`


export async function fetchAll({ accessToken }) {
  const params = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': accessToken
    }
  }
  const result = await fetch(API_ALLATTENDANTS_URL, params);
  if (!result.ok) {
    throw new Error('Could not fetch the attendant list')
  }
  return result.json()
}

export async function addOne() {

}

export async function deleteOne() {

}

export async function sendInvite() {

}