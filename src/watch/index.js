//watch监听data的keyLine更新
function watchUpdate(keyLine) {
	if(this.watch[keyLine] && typeof this.watch[keyLine] === 'function') {
		this.watch[keyLine].call(this, this._get(keyLine));
	}
}

export {watchUpdate};