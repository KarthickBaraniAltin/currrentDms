import SmartySDK from "smartystreets-javascript-sdk"
const SmartyCore = SmartySDK.core
const Lookup = SmartySDK.usAutocompletePro.Lookup

// let authId = '2cdff039-0fc8-18ef-2759-1b4c3f0f898c'
let authId = "c79e1839-2e38-078d-c125-7cc441d1316c"
// let authToken = 'eE5LVc4z71roT8L4S0i9'
let authToken = "JqrH7UjRHXuRHSorQxRH"

let clientBuilder = new SmartyCore.ClientBuilder(new SmartyCore.StaticCredentials(authId, authToken))
let client = clientBuilder.buildUsAutocompleteProClient()

export default async function handler(req, res) {
  const { address } = req.body;
  let lookup = new Lookup(address)
  try {
    const results = await client.send(lookup)
    res.status(200).json(results)
  } catch(err) {
    console.log(err)
    res.status(500).json({ error: "An error occurred" })
  }
}