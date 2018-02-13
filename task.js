module.exports = {
  /* I have to give credit to https://stackoverflow.com/a/45363133/7683968 for this one :) */
  newTask: function () {
    let _resolve, _reject

    let promise = new Promise(function(resolve, reject) {
      _resolve = resolve
      _reject = reject
    })

    promise.resolve = _resolve
    promise.reject = _reject

    return promise
  }
}
