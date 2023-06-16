import SmartySDK from "smartystreets-javascript-sdk"
const SmartyCore = SmartySDK.core
const Lookup = SmartySDK.usAutocompletePro.Lookup

// let authId = '2cdff039-0fc8-18ef-2759-1b4c3f0f898c'
// let authToken = 'eE5LVc4z71roT8L4S0i9'

let key = '165366487772277357'
const credentials = new SmartyCore.SharedCredentials(key)

// let clientBuilder = new SmartyCore.ClientBuilder(new SmartyCore.StaticCredentials(authId, authToken))
let clientBuilder = new SmartyCore.ClientBuilder(credentials).withLicenses(["us-autocomplete-pro-cloud"])
let client = clientBuilder.buildUsAutocompleteProClient()

// let lookup = new Lookup('4770 Lincoln')

export default function AddressAutoComplete() {
    function logSuggestions(response, message) {
        console.log(message);
        console.log(response.result);
        console.log("*********************");
    }

    async function handleRequest(address) {
        let lookup = new Lookup(address)
        try {
            const results = await client.send(lookup)
            // logSuggestions(results, 'Simple Lookup')
            return results
        } catch(err) {
            console.log(err)
            return []
        }
    }

    return { handleRequest }
}