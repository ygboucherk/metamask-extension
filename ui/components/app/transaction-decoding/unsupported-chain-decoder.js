import * as Codec from '@truffle/codec';

class UnsupportedChainDecoder {
	constructor(txData) {
		this.fctSig = test.substr(0,8);
		this.decodable = test.substr(8);
	}
	
	async getFunction() {
		let url = `https://www.4byte.directory/api/v1/signatures/?hex_signature=${this.fctSig}&format=json`
		let response = (await (await fetch(url)).json());
		if (response.results == 0) {
			throw "UnknownFunctionError";
		}
		this.fctText = response.results[0];
		this.params = this.fctText.split("(")[1].replaceAll(")", "").split(",");
	}
	
	async decode() {
	}
}